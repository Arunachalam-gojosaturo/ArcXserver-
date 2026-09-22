/**
 * Interactive Cyber Terminal Emulator
 * arunachalam@arcxos-breach:~#
 */
class CyberTerminal {
  constructor() {
    this.container = document.getElementById('terminal-output');
    this.input = document.getElementById('terminal-input');
    this.form = document.getElementById('terminal-form');
    this.history = [];
    this.historyIndex = -1;

    this.commands = {
      help: () => this.cmdHelp(),
      whoami: () => this.cmdWhoami(),
      arcxos: () => this.cmdArcXOS(),
      luna: () => this.cmdLuna(),
      target: () => this.cmdTarget(),
      scan: () => this.cmdScan(),
      neofetch: () => this.cmdNeofetch(),
      exploit: () => this.cmdExploit(),
      matrix: () => this.cmdMatrix(),
      disclaimer: () => this.cmdDisclaimer(),
      google: () => this.cmdGoogle(),
      boot: () => this.cmdReplay(),
      replay: () => this.cmdReplay(),
      clear: () => this.cmdClear()
    };

    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleInput();
      });
    }

    if (this.input) {
      this.input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (this.historyIndex > 0) {
            this.historyIndex--;
            this.input.value = this.history[this.historyIndex] || '';
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.input.value = this.history[this.historyIndex] || '';
          } else {
            this.historyIndex = this.history.length;
            this.input.value = '';
          }
        } else if (e.key === 'Tab') {
          e.preventDefault();
          this.autoComplete();
        }
      });
    }

    // Connect quick pill buttons
    document.querySelectorAll('.term-quick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        if (cmd) {
          this.execute(cmd);
        }
      });
    });

    this.printInitial();
  }

  printInitial() {
    this.printLine('ArcXOS Breach Shell v4.9.1 [HYPER-KERNEL 6.10.9-arch1]', 'term-system');
    this.printLine('Authenticated Session: arunachalam (UID=0 / GID=0) [ROOT PRIVILEGES ACTIVE]', 'term-accent');
    this.printLine('Type <span class="term-hl">help</span> or tap quick-action buttons below to interrogate system modules.', 'term-muted');
  }

  handleInput() {
    const raw = this.input.value.trim();
    if (!raw) return;

    this.history.push(raw);
    this.historyIndex = this.history.length;
    this.input.value = '';

    this.execute(raw);
  }

  execute(raw) {
    if (window.cyberAudio) window.cyberAudio.playKeyClick();
    this.printLine(`<span class="term-prompt">arunachalam@arcxos:~#</span> ${this.escapeHtml(raw)}`, 'term-input-echo');

    const parts = raw.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (this.commands[cmd]) {
      this.commands[cmd](args);
    } else {
      this.printLine(`bash: command not found: ${this.escapeHtml(cmd)}. Type 'help' for available commands.`, 'term-danger');
      if (window.cyberAudio) window.cyberAudio.playGlitch(0.1);
    }

    this.scrollToBottom();
  }

  autoComplete() {
    const val = this.input.value.toLowerCase().trim();
    const matches = Object.keys(this.commands).filter(c => c.startsWith(val));
    if (matches.length === 1) {
      this.input.value = matches[0];
    }
  }

  printLine(html, className = '') {
    if (!this.container) return;
    const div = document.createElement('div');
    div.className = `term-line ${className}`;
    div.innerHTML = html;
    this.container.appendChild(div);
  }

  scrollToBottom() {
    if (this.container) {
      this.container.scrollTop = this.container.scrollHeight;
    }
  }

  cmdClear() {
    if (this.container) this.container.innerHTML = '';
  }

  cmdHelp() {
    const helpText = `
<div class="term-block">
  <div class="term-accent font-bold">AVAILABLE COMMAND PROTOCOLS:</div>
  <table class="term-table">
    <tr><td class="term-hl">whoami</td><td>Operator profile: Arunachalam M., Arch Linux & Security Specialist</td></tr>
    <tr><td class="term-hl">arcxos</td><td>ArcXOS Distribution specs (Arch Linux + BlackArch + Hyprland)</td></tr>
    <tr><td class="term-hl">luna</td><td>Luna AI modular cyberpunk desktop assistant specs (Arch AUR)</td></tr>
    <tr><td class="term-hl">target</td><td>Interrogate live hardware & forensic telemetry of this device</td></tr>
    <tr><td class="term-hl">scan</td><td>Execute real-time socket and vulnerability audit</td></tr>
    <tr><td class="term-hl">neofetch</td><td>Display Arch Linux ASCII logo and system performance stats</td></tr>
    <tr><td class="term-hl">exploit</td><td>Inspect active memory payload and privilege elevation logs</td></tr>
    <tr><td class="term-hl">google</td><td>Search "Arunachalam archlinux" directly on Google</td></tr>
    <tr><td class="term-hl">matrix</td><td>Toggle holographic matrix code stream</td></tr>
    <tr><td class="term-hl">replay</td><td>Rerun the 21-second neural voice device takeover sequence</td></tr>
    <tr><td class="term-hl">disclaimer</td><td>Display educational & ethical security presentation notice</td></tr>
    <tr><td class="term-hl">clear</td><td>Clear terminal screen</td></tr>
  </table>
</div>`;
    this.printLine(helpText);
  }

  cmdWhoami() {
    const info = `
<div class="term-block term-box">
  <div class="term-accent font-bold">>>> OPERATOR IDENTITY PROFILE</div>
  <div><span class="term-muted">OPERATOR:</span> Arunachalam M.</div>
  <div><span class="term-muted">SPECIALIZATION:</span> Arch Linux System Orchestration | Offensive Security | Kernel Customization</div>
  <div><span class="term-muted">LOCATION:</span> Vellore, Tamil Nadu, India</div>
  <div><span class="term-muted">EXPERIENCE:</span> 7+ Years Linux Architecture & AUR Maintenance</div>
  <div><span class="term-muted">SIGNATURE CREATIONS:</span> ArcXOS (Security Distro), Luna AI (AUR luna-llm), Netwatch, Cyberkit</div>
  <div><span class="term-muted">RESEARCH QUERY:</span> Search <span class="term-hl">"Arunachalam archlinux"</span> on Google for official repos & articles.</div>
</div>`;
    this.printLine(info);
  }

  cmdArcXOS() {
    const arcx = `
<div class="term-block">
  <div class="term-accent font-bold">>>> ARCXOS LINUX ARCHITECTURE [OFFENSIVE SECURITY DISTRO]</div>
  <div>• <span class="term-hl">Base OS:</span> Pure Arch Linux rolling release framework</div>
  <div>• <span class="term-hl">Security Repos:</span> Full BlackArch pentesting repository integration (2,800+ tools)</div>
  <div>• <span class="term-hl">Compositor:</span> Ultra-fast Wayland Hyprland WM with custom cyber HUD animations</div>
  <div>• <span class="term-hl">Target Audience:</span> Penetration testers, ethical hackers, kernel developers</div>
  <div>• <span class="term-hl">Hardware Acceleration:</span> Custom kernel patches for zero-latency packet capture</div>
</div>`;
    this.printLine(arcx);
  }

  cmdLuna() {
    const luna = `
<div class="term-block">
  <div class="term-accent font-bold">>>> LUNA AI [HACKER-STYLE DESKTOP ASSISTANT]</div>
  <div>• <span class="term-hl">Package:</span> Arch User Repository (AUR: luna-llm)</div>
  <div>• <span class="term-hl">Role:</span> Modular AI desktop coprocessor for Linux power-users and security engineers</div>
  <div>• <span class="term-hl">Capabilities:</span> Real-time network threat correlation, automated bash triage, log parsing</div>
</div>`;
    this.printLine(luna);
  }

  cmdTarget() {
    const t = window.telemetry ? window.telemetry.data : {};
    const targetInfo = `
<div class="term-block term-box-danger">
  <div class="term-danger font-bold">>>> TARGET FORENSIC EXTRACTION DUMP</div>
  <div>HOST PLATFORM:       <span class="term-hl">${t.os || 'UNKNOWN'}</span></div>
  <div>CPU LOGICAL CORES:   <span class="term-hl">${t.cores || '8'} THREADS</span></div>
  <div>DEVICE MEMORY:       <span class="term-hl">${t.memory || '16 GB'}</span></div>
  <div>GPU ACCELERATOR:     <span class="term-hl">${t.gpu || 'HARDWARE ACCELERATED'}</span></div>
  <div>RESOLUTION/VIEWPORT: <span class="term-hl">${t.resolution} / ${t.viewport}</span></div>
  <div>TOUCH INTERFACE:     <span class="term-hl">${t.touch}</span></div>
  <div>NETWORK ADAPTER:     <span class="term-hl">${t.network}</span></div>
  <div>TARGET GATEWAY:      <span class="term-hl">${t.ip}</span></div>
  <div>SESSION HASH:        <span class="term-muted">${t.sessionHash}</span></div>
  <div class="term-danger font-bold mt-2">STATUS: FULL ROOT OVERRIDE MAINTAINED BY ARUNACHALAM</div>
</div>`;
    this.printLine(targetInfo);
  }

  cmdScan() {
    this.printLine('<span class="term-accent">[*] Initiating high-speed SYN socket probe across target interfaces...</span>');
    const ports = [
      { port: '22/tcp', service: 'SSH', status: 'COMPROMISED (Root Key Injected)', color: 'term-danger' },
      { port: '80/tcp', service: 'HTTP', status: 'INTERCEPTED (Traffic Mirrored)', color: 'term-warn' },
      { port: '443/tcp', service: 'HTTPS', status: 'INTERCEPTED (TLS Terminated)', color: 'term-warn' },
      { port: '3306/tcp', service: 'MySQL', status: 'EXPLOITED (Auth Bypass)', color: 'term-danger' },
      { port: '4444/tcp', service: 'ArcXOS-C2', status: 'ACTIVE BEACON [ONLINE]', color: 'term-accent' },
      { port: '8080/tcp', service: 'HTTP-Proxy', status: 'FILTERED', color: 'term-muted' }
    ];

    ports.forEach((p, idx) => {
      setTimeout(() => {
        this.printLine(`PORT ${p.port.padEnd(10)} ${p.service.padEnd(12)} <span class="${p.color}">[ ${p.status} ]</span>`);
        if (window.cyberAudio) window.cyberAudio.playPing(600 + idx * 100);
        this.scrollToBottom();
      }, (idx + 1) * 250);
    });
  }

  cmdNeofetch() {
    const t = window.telemetry ? window.telemetry.data : {};
    const neo = `
<pre class="neofetch-art">
<span class="term-accent">      /\\        </span> <span class="term-hl font-bold">arunachalam@arcxos-breach</span>
<span class="term-accent">     /  \\       </span> -------------------------
<span class="term-accent">    /\\   \\      </span> <span class="term-hl">OS:</span> ArcXOS Linux x86_64 (Arch Linux base)
<span class="term-accent">   /      \\     </span> <span class="term-hl">Host:</span> ${t.os || 'Target Host Node'}
<span class="term-accent">  /   ,,   \\    </span> <span class="term-hl">Kernel:</span> 6.10.9-arch1-arcxos-hardened
<span class="term-accent"> /   |  |  -\\   </span> <span class="term-hl">Uptime:</span> 1337 hours, 42 mins
<span class="term-accent">/_-''    ''-_\\  </span> <span class="term-hl">Shell:</span> zsh 5.9 (x86_64-pc-linux-gnu)
                 <span class="term-hl">WM:</span> Hyprland (Wayland Custom Security Suite)
                 <span class="term-hl">CPU:</span> Host Processor (${t.cores || 8} Threads)
                 <span class="term-hl">GPU:</span> ${t.gpu ? t.gpu.substring(0, 32) : 'Hardware Accelerator'}
                 <span class="term-hl">Resolution:</span> ${t.resolution}
                 <span class="term-hl">Security:</span> <span class="term-danger font-bold">OVERRIDDEN BY ARUNACHALAM</span>
</pre>`;
    this.printLine(neo);
  }

  cmdExploit() {
    const exp = `
<div class="term-block">
  <div class="term-danger font-bold">>>> CVE-ARCXOS-2026-PAYLOAD REGISTER DUMP:</div>
  <div class="term-muted">RAX: 0x0000000000000000  RBX: 0x00007ffc9a18f220  RCX: 0x00007f9c2d1b8e40</div>
  <div class="term-muted">RDX: 0x0000000000000001  RSI: 0x00007ffc9a18f1a0  RDI: 0x0000000000000001</div>
  <div class="term-muted">RBP: 0x00007ffc9a18f230  RSP: 0x00007ffc9a18f180  RIP: 0x00007f9c2d152a83</div>
  <div class="term-accent mt-1">[+] MEMORY INJECTION AT 0x7FFF004B SUCCESSFUL</div>
  <div class="term-accent">[+] SYSTEM CALL HOOKS ESTABLISHED VIA ARCXOS DAEMON</div>
</div>`;
    this.printLine(exp);
  }

  cmdGoogle() {
    this.printLine('<span class="term-accent">[*] Launching Google Search query: "Arunachalam archlinux"...</span>');
    window.open('https://www.google.com/search?q=Arunachalam+archlinux', '_blank');
  }

  cmdMatrix() {
    if (window.matrixRain) {
      const active = window.matrixRain.toggle();
      this.printLine(`Matrix stream state: <span class="term-hl">${active ? 'ENABLED' : 'DISABLED'}</span>`);
    }
  }

  cmdDisclaimer() {
    const disc = `
<div class="term-block term-box-disclaimer">
  <div class="term-warn font-bold">⚠️ EDUCATIONAL & ETHICAL HACKING DIRECTIVE</div>
  <div>This interface is authored strictly for <span class="term-hl">PRESENTATION & EDUCATIONAL PURPOSES</span>, displaying cybersecurity telemetry and demonstrating offensive & defensive concepts in ethical engineering. No unauthorized systems were harmed. All telemetry displayed reflects standard browser-accessible client parameters.</div>
</div>`;
    this.printLine(disc);
  }

  cmdReplay() {
    this.printLine('<span class="term-danger font-bold">[*] RE-INITIALIZING 21-SECOND NEURAL VOICE TAKEOVER PROTOCOL...</span>');
    setTimeout(() => {
      if (window.replayTakeover) window.replayTakeover();
    }, 400);
  }

  escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.cyberTerminal = new CyberTerminal();
});
