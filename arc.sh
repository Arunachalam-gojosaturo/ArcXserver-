#!/bin/bash
# ╔══════════════════════════════════════════════╗
# ║   ARC PORTAL v2.1 — auto-detect edition      ║
# ╚══════════════════════════════════════════════╝

PORTAL_IP="10.66.66.1"
PORTAL_URL="https://arc-xserver.vercel.app/"
WEBROOT="/srv/starkportal"
LOG="$WEBROOT/captured.log"

[[ $EUID -ne 0 ]] && exec sudo "$0" "$@"

# ---------- AUTO-DETECT interfaces ----------
echo "[*] Detecting interfaces..."
# WIFI iface (wireless)
WIFI_IFACES=$(iw dev 2>/dev/null | awk '$1=="Interface"{print $2}')
# Internet iface = whichever has the default route right now
INET_IFACE=$(ip route show default | awk '{print $5; exit}')

echo "    Wireless ifaces : ${WIFI_IFACES:-NONE FOUND}"
echo "    Internet iface  : ${INET_IFACE:-NONE FOUND}"

if [[ -z "$WIFI_IFACES" ]]; then
  echo "[!] No wireless interface found. Run: ip link   (and check wifi is not rfkill-blocked: rfkill list)"
  exit 1
fi

IFACE=$(echo "$WIFI_IFACES" | head -n1)   # first wifi iface
echo "[*] Using IFACE=$IFACE  INTERNET=$INET_IFACE"

banner() { echo -e "\e[38;5;39m$1\e[0m"; }
banner "╔══════════════════════════════════════╗"
banner "║  INITIALIZING ARC PORTAL...          ║"
banner "╚══════════════════════════════════════╝"

pacman -S --needed --noconfirm dnsmasq python python-pip >/dev/null
pip install --break-system-packages user_agents >/dev/null 2>&1
mkdir -p "$WEBROOT"

# ---------- Network ----------
ip link set "$IFACE" up
ip addr flush dev "$IFACE"
ip addr add "$PORTAL_IP/24" dev "$IFACE"

sysctl -w net.ipv4.ip_forward=1 >/dev/null
if [[ -n "$INET_IFACE" ]]; then
  iptables -t nat -C POSTROUTING -o "$INET_IFACE" -j MASQUERADE 2>/dev/null || iptables -t nat -A POSTROUTING -o "$INET_IFACE" -j MASQUERADE
  iptables -C FORWARD -i "$IFACE" -o "$INET_IFACE" -j ACCEPT 2>/dev/null || iptables -A FORWARD -i "$IFACE" -o "$INET_IFACE" -j ACCEPT
  iptables -C FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT 2>/dev/null || iptables -A FORWARD -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
fi

# ---------- DNS hijack ----------
cat > /etc/dnsmasq-arc.conf <<EOF
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
dnsmasq -C /etc/dnsmasq-arc.conf --log-facility="$WEBROOT/dnsmasq.log" &
sleep 1

# ---------- Server (same core, new URL) ----------
cat > "$WEBROOT/server.py" <<'PYEOF'
#!/usr/bin/env python3
import http.server, socketserver, threading, datetime, json, re, time
import user_agents

PORTAL_URL = "https://arc-xserver.vercel.app/"
LOG = "/srv/starkportal/captured.log"

PROBES = [
    ("generate_204", "android", "302"),
    ("gen_204", "android", "302"),
    ("hotspot-detect.html", "apple", "captive"),
    ("library/test/success.html", "apple", "captive"),
    ("connecttest.txt", "windows", "captive"),
    ("ncsi.txt", "windows", "captive"),
    ("connectivity-check", "linux", "captive"),
    ("nm-check.txt", "linux", "captive"),
]

def classify(ua):
    try:
        u = user_agents.parse(ua)
        return f"{u.device.family} | {u.os.family} {u.os.version_string} | {u.browser.family} {u.browser.version_string}"
    except Exception:
        return ua[:80]

def log_client(ip, ua, probe, verdict):
    tv = bool(re.search(r"TV|SmartTV|Tizen|WebOS|BRAVIA|FireTV", ua, re.I))
    e = {"time": datetime.datetime.now().isoformat(timespec="seconds"),
         "ip": ip, "device": classify(ua), "probe": probe, "verdict": verdict, "tv": tv}
    with open(LOG, "a") as f: f.write(json.dumps(e) + "\n")
    print(f'  {"📺" if tv else "🖥"} [{e["time"]}] {ip:15} → {e["device"]}')

class H(http.server.BaseHTTPRequestHandler):
    def probe(self):
        ua = self.headers.get("User-Agent", "")
        key = self.headers.get("Host","") + self.path
        for frag, osn, mode in PROBES:
            if frag in key:
                log_client(self.client_address[0], ua, osn, mode)
                if mode == "302":
                    self.send_response(302)
                    self.send_header("Location", PORTAL_URL); self.send_header("Content-Length","0"); self.end_headers()
                else:
                    b = b"<html><head><meta http-equiv='refresh' content='0;url=" + PORTAL_URL.encode() + b"'></head><body></body></html>"
                    self.send_response(200)
                    self.send_header("Content-Type","text/html"); self.send_header("Content-Length",str(len(b))); self.end_headers()
                    self.wfile.write(b)
                return True
        return False

    def serve(self):
        if not self.probe():
            log_client(self.client_address[0], self.headers.get("User-Agent",""), "direct", "302")
            self.send_response(302)
            self.send_header("Location", PORTAL_URL); self.send_header("Content-Length","0"); self.end_headers()
    def do_GET(self): self.serve()
    def do_POST(self): self.serve()
    def do_HEAD(self): self.serve()
    def log_message(self, *a): pass

class S(socketserver.ThreadingTCPServer):
    allow_reuse_address = True; daemon_threads = True

print("[*] ARC CORE ONLINE :80")
threading.Thread(target=S(("0.0.0.0",80), H).serve_forever, daemon=True).start()
while True: time.sleep(60)
PYEOF

python "$WEBROOT/server.py" &
CORE_PID=$!
python -m http.server 8080 --directory "$WEBROOT" --bind 0.0.0.0 >/dev/null 2>&1 &
DASH_PID=$!

banner "╔════════════════════════════════════════════╗"
banner "║  ⬡ ARC PORTAL ACTIVE                       ║"
banner "║  IFACE     : $IFACE"
banner "║  Internet  : ${INET_IFACE:-none}"
banner "║  Redirect  : $PORTAL_URL"
banner "║  Dashboard : http://$PORTAL_IP:8080/dashboard.html"
banner "╚════════════════════════════════════════════╝"

trap 'kill $CORE_PID $DASH_PID 2>/dev/null; killall dnsmasq 2>/dev/null' INT TERM
wait
