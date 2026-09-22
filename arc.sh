#!/bin/bash
# ╔══════════════════════════════════════════════════════════╗
# ║   S T A R K   P O R T A L  v2.0                          ║
# ║   Universal captive portal — OS/device auto-detect       ║
# ║   Auto-opens browser on ANY device. JARVIS-grade.        ║
# ╚══════════════════════════════════════════════════════════╝

IFACE="wlan0"                          # <<< your hotspot-facing interface
SHARE_IFACE="wlan1"                    # <<< interface with internet (or same wlan)
PORTAL_IP="10.66.66.1"
PORTAL_URL="https://arunachalam-gojosaturo.gith/"
WEBROOT="/srv/starkportal"
LOG="$WEBROOT/captured.log"

[[ $EUID -ne 0 ]] && exec sudo "$0" "$@"

banner() { echo -e "\e[38;5;39m$1\e[0m"; }
banner "╔══════════════════════════════════════╗"
banner "║  INITIALIZING STARK PORTAL...        ║"
banner "║  \"Sometimes you gotta run before\"  ║"
banner "╚══════════════════════════════════════╝"

# ---------- 0. Dependencies ----------
banner "[*] Installing modules..."
pacman -S --needed --noconfirm dnsmasq python nmap python-pip
pip install --break-system-packages user_agents >/dev/null 2>&1

mkdir -p "$WEBROOT"

# ---------- 1. Network setup ----------
banner "[*] Spinning up network core..."
ip link set "$IFACE" up
ip addr flush dev "$IFACE"
ip addr add "$PORTAL_IP/24" dev "$IFACE"

sysctl -w net.ipv4.ip_forward=1 >/dev/null
iptables -t nat -C POSTROUTING -o "$SHARE_IFACE" -j MASQUERADE 2>/dev/null || \
  iptables -t nat -A POSTROUTING -o "$SHARE_IFACE" -j MASQUERADE
iptables -C FORWARD -i "$IFACE" -o "$SHARE_IFACE" -j ACCEPT 2>/dev/null || \
  iptables -A FORWARD -i "$IFACE" -o "$SHARE_IFACE" -j ACCEPT
iptables -C FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT 2>/dev/null || \
  iptables -A FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT

# ---------- 2. dnsmasq: DNS wildcard hijack ----------
banner "[*] arming DNS interceptor..."
cat > /etc/dnsmasq-stark.conf <<EOF
interface=$IFACE
bind-interfaces
dhcp-range=10.66.66.10,10.66.66.250,12h
dhcp-option=3,$PORTAL_IP
dhcp-option=6,$PORTAL_IP
address=/#/$PORTAL_IP
log-queries
EOF
killall dnsmasq 2>/dev/null
systemctl stop systemd-resolved 2>/dev/null
dnsmasq -C /etc/dnsmasq-stark.conf --log-facility="$WEBROOT/dnsmasq.log" &

# ---------- 3. THE STARK SERVER: OS-aware captive portal ----------
banner "[*] Forging the intelligence core (server.py)..."
cat > "$WEBROOT/server.py" <<'PYEOF'
#!/usr/bin/env python3
"""
STARK PORTAL CORE
Detects: OS / device / browser from User-Agent + probe signatures.
Auto-triggers captive portal popup on: Android, iOS, macOS, Windows 11,
Ubuntu, Debian, ChromeOS, Smart TVs.
"""
import http.server, socketserver, ssl, threading, datetime, json, re, os
import user_agents

PORTAL_URL   = "https://arunachalam-gojosaturo.gith/"
LOG          = "/srv/starkportal/captured.log"
DASH         = "/srv/starkportal/dashboard.html"

# --- Captive-portal probe signatures -------------------------------------
# key: (url path fragment, required 200-body to say "online", OS label)
PROBES = [
    # ANDROID / CHROMEOS  -> needs HTTP 204 (no content)
    ("generate_204", "android", "204"),
    ("gen_204",      "android", "204"),
    # iOS / macOS  -> needs 200 "Success" body (we instead say captive -> popup)
    ("hotspot-detect.html", "apple",  "captive"),
    ("library/test/success.html", "apple", "captive"),
    # WINDOWS 11/10 -> expects "Microsoft Connect Test" ; NCSI decides popup
    ("connecttest.txt",   "windows", "captive"),
    ("ncsi.txt",          "windows", "captive"),
    ("redirect",          "windows", "302"),
    # UBUNTU / DEBIAN / Fedora
    ("connectivity-check", "linux", "captive"),
    ("network-test.debian.org", "linux", "captive"),
    ("nm-check.txt", "linux", "captive"),
]

def classify_ua(ua):
    try:
        u = user_agents.parse(ua)
        return f"{u.device.family} | {u.os.family} {u.os.version_string} | {u.browser.family} {u.browser.version_string}"
    except Exception:
        return ua[:80]

def is_tv(ua):
    return bool(re.search(r"TV|SmartTV|AppleTV|Tizen|Web0S|WebOS|BRAVIA|FireTV|HbbTV", ua, re.I))

def log_client(ip, ua, probe, verdict):
    entry = {
        "time": datetime.datetime.now().isoformat(timespec="seconds"),
        "ip": ip, "device": classify_ua(ua),
        "probe": probe, "verdict": verdict, "tv": is_tv(ua)
    }
    with open(LOG, "a") as f: f.write(json.dumps(entry) + "\n")
    icon = "📺" if entry["tv"] else "🖥"
    print(f'  {icon} [{entry["time"]}] {ip:15} → {entry["device"]}')

class StarkHandler(http.server.BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def handle_probe(self):
        ua  = self.headers.get("User-Agent", "")
        host = self.headers.get("Host", "")
        path = self.path
        key = f"{host}{path}"

        for frag, osname, mode in PROBES:
            if frag in key:
                log_client(self.client_address[0], ua, osname, f"portal-{mode}")
                if mode == "204":
                    # Android: 204-with-Location? Android honors 302 on generate_204
                    self.send_response(302)
                    self.send_header("Location", PORTAL_URL)
                    self.send_header("Content-Length", "0")
                    self.end_headers()
                elif mode == "302":
                    self.send_response(302)
                    self.send_header("Location", PORTAL_URL)
                    self.send_header("Content-Length", "0")
                    self.end_headers()
                else:
                    # Apple/Windows/Linux: serve "not online" marker
                    body = b"<html><head><meta http-equiv='refresh' content='0;url=" \
                           + PORTAL_URL.encode() + b"'></head><body>OFFLINE</body></html>"
                    self.send_response(200)
                    self.send_header("Content-Type", "text/html")
                    self.send_header("Content-Length", str(len(body)))
                    self.end_headers()
                    self.wfile.write(body)
                return True
        return False

    def _serve(self):
        if not self.handle_probe():
            log_client(self.client_address[0], self.headers.get("User-Agent",""), "direct", "302")
            self.send_response(302)
            self.send_header("Location", PORTAL_URL)
            self.send_header("Content-Length", "0")
            self.end_headers()

    def do_GET(self):  self._serve()
    def do_POST(self): self._serve()
    def do_HEAD(self):
        ua = self.headers.get("User-Agent","")
        if not self.handle_probe():
            self.send_response(302)
            self.send_header("Location", PORTAL_URL)
            self.send_header("Content-Length", "0")
            self.end_headers()
    def log_message(self, *a): pass

class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True

def run(port):
    try:
        Server(("0.0.0.0", port), StarkHandler).serve_forever()
    except OSError as e:
        print(f"    [!] port {port}: {e}")

print("[*] CORE ONLINE — listening :80")
for p in (80,):
    threading.Thread(target=run, args=(p,), daemon=True).start()

# JARVIS-style live ticker
print("    ────────────────────────────────────────")
print("    LIVE DEVICE FEED  (JARVIS monitoring)")
print("    ────────────────────────────────────────")
try:
    while True: __import__("time").sleep(60)
except KeyboardInterrupt:
    print("\n[*] Portal shutting down. \"I am Iron Man.\"")
PYEOF

# ---------- 4. Stark dashboard (your live "presentation screen") ----------
banner "[*] Building JARVIS dashboard..."
cat > "$WEBROOT/dashboard.html" <<'HTMLEOF'
<!DOCTYPE html><html><head><meta charset=utf-8><title>STARK PORTAL — LIVE FEED</title>
<style>
body{background:#050a12;color:#4fd8ff;font-family:'Courier New',monospace;margin:0;padding:20px}
h1{color:#7df9ff;text-shadow:0 0 15px #00d4ff;letter-spacing:6px}
.hud{border:1px solid #0af;border-radius:10px;padding:15px;margin:10px 0;box-shadow:0 0 12px #06c inset}
.row{display:flex;justify-content:space-between;padding:6px 4px;border-bottom:1px solid #013}
.tag{color:#ffb300;font-weight:bold}
.count{font-size:2em;color:#0f0;text-shadow:0 0 20px #0f0}
</style></head><body>
<h1>⬡ STARK PORTAL // LIVE INTRUSION FEED ⬡</h1>
<div class="hud">DEVICES CAPTURED: <span class="count" id="c">0</span></div>
<div class="hud" id="feed">Awaiting targets…</div>
<script>
const icons = {TV:"📺", Mac:"🍎", iPad:"📱", iPhone:"📱", Android:"🤖", Windows:"🪟", Linux:"🐧"};
async function poll(){
  try{
    const r = await fetch('captured.log');        // serve log dir too
    const lines = (await r.text()).trim().split('\n').filter(Boolean);
    document.getElementById('c').textContent = lines.length;
    document.getElementById('feed').innerHTML = lines.slice(-15).reverse().map(l=>{
      const j = JSON.parse(l);
      const icon = j.tv ? "📺" : (Object.keys(icons).find(k=>j.device.includes(k))||"🖥");
      return `<div class="row"><span>${icon} ${j.ip}</span><span class="tag">${j.device}</span></div>`;
    }).join('');
  }catch(e){}
}
setInterval(poll,2000); poll();
</script></body></html>
HTMLEOF

# serve dashboard + logs on :8080 (for your presentation screen)
python -m http.server 8080 --directory "$WEBROOT" --bind 0.0.0.0 >/dev/null 2>&1 &
DASH_PID=$!

# ---------- 5. Launch ----------
banner "[*] LAUNCHING CORE..."
python "$WEBROOT/server.py" &
CORE_PID=$!

banner ""
banner "╔════════════════════════════════════════════════════╗"
banner "║  ⬡  STARK PORTAL ACTIVE                            ║"
banner "║  Portal IP : $PORTAL_IP                           ║"
banner "║  Redirect  : $PORTAL_URL"
banner "║  Dashboard : http://$PORTAL_IP:8080/dashboard.html"
banner "║  Log file  : $LOG"
banner "║  \"Sometimes you gotta run before you can walk.\"  ║"
banner "╚════════════════════════════════════════════════════╝"
banner ""

trap 'kill $CORE_PID $DASH_PID 2>/dev/null; killall dnsmasq 2>/dev/null; echo "Portal down."' INT TERM
wait
