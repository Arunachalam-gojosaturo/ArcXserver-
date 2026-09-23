/**
 * Fast Hacker Booting & Device Takeover Sequence Engine
 * Blazing-fast hacker terminal boot stream with rapid text scrolling,
 * authentic Linux kernel & exploit logs, real-time hardware telemetry,
 * scrambling text decryption, frequency visualizer, and climax alert.
 */
class BootSequence {
  constructor() {
    this.bootOverlay = document.getElementById('boot-overlay');
    this.bootLogs = document.getElementById('boot-logs');
    this.progressBar = document.getElementById('boot-progress-bar');
    this.progressPercent = document.getElementById('boot-progress-percent');
    this.statusLabel = document.getElementById('boot-status-label');
    this.takeoverBanner = document.getElementById('takeover-banner');
    this.skipBtn = document.getElementById('skip-boot-btn');
    this.mainDashboard = document.getElementById('main-dashboard');
    this.hudVoiceIndicator = document.getElementById('hud-voice-indicator');
    this.spectrumContainer = document.getElementById('spectrum-visualizer');
    this.speechTimer = document.getElementById('speech-timer');
    this.speechStatus = document.getElementById('boot-speech-status');
    this.hexStream = document.getElementById('boot-hex-stream');
    this.bootClock = document.getElementById('boot-clock');

    this.active = false;
    this.startTime = 0;
    this.totalDuration = 21500; // Awesome 21.5s cinematic HUD boot (> 19s required)
    this.climaxTime = 16500;    // Climax alert & bass drop trigger at 16.5s
    this.climaxTriggered = false;

    this.spectrumBars = [];
    this.hexInterval = null;
    this.clockInterval = null;
    this.animFrameId = null;
    this.scrollRafId = null;
    this.logTimeouts = [];
    this.lastSoundTick = 0;
    this.activator = null;
  }

  init() {
    this.activator = document.getElementById('stark-activator');

    // Skip / Override button
    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.finishTakeover();
      });
    }

    // Keyboard ESC to instantly override / enter
    window.addEventListener('keydown', (e) => {
      if (this.active && (e.key === 'Escape' || e.key === 'Enter')) {
        this.finishTakeover();
      }
    });

    this.setupVisualizer();

    // Check if audio is already unlocked and playing
    if (window.cyberAudio && window.cyberAudio.speechUnlocked) {
      if (this.activator) this.activator.classList.add('activated');
      this.start();
      return;
    }

    // Attempt handless unmuted startup immediately
    if (window.cyberAudio) {
      window.cyberAudio.playStartupSpeech().then((started) => {
        if (started) {
          if (this.activator) this.activator.classList.add('activated');
          this.start();
        } else {
          this.waitForEngagement();
        }
      }).catch(() => {
        this.waitForEngagement();
      });
    } else {
      this.start();
    }
  }

  waitForEngagement() {
    let engaged = false;
    const engage = () => {
      if (engaged) return;
      engaged = true;

      if (this.activator) this.activator.classList.add('activated');
      if (window.cyberAudio) {
        window.cyberAudio.unlockAndPlay();
      }
      this.start();

      const events = ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown'];
      events.forEach(evt => {
        window.removeEventListener(evt, engage, { capture: true });
        document.removeEventListener(evt, engage, { capture: true });
      });
    };

    const events = ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown'];
    events.forEach(evt => {
      window.addEventListener(evt, engage, { capture: true, once: true });
      document.addEventListener(evt, engage, { capture: true, once: true });
    });

    if (this.activator) {
      this.activator.addEventListener('click', engage, { once: true });
      this.activator.addEventListener('touchstart', engage, { once: true, passive: true });
    }
    if (this.bootOverlay) {
      this.bootOverlay.addEventListener('click', engage, { once: true });
    }
  }

  setupVisualizer() {
    if (!this.spectrumContainer) return;
    this.spectrumContainer.innerHTML = '';
    this.spectrumBars = [];
    const barCount = 20;
    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement('div');
      bar.className = 'spectrum-bar';
      bar.style.transform = 'scaleY(0.12)';
      this.spectrumContainer.appendChild(bar);
      this.spectrumBars.push(bar);
    }
  }

  start() {
    this.active = true;
    this.startTime = Date.now();
    this.climaxTriggered = false;
    this.clearTimeouts();

    if (this.bootLogs) this.bootLogs.innerHTML = '';
    if (this.takeoverBanner) {
      this.takeoverBanner.classList.add('hidden');
      this.takeoverBanner.classList.remove('animate-glitch-drop');
    }
    if (this.bootOverlay) {
      this.bootOverlay.style.display = 'flex';
      this.bootOverlay.classList.remove('fade-out');
      this.bootOverlay.classList.remove('takeover-alert-active');
    }
    if (this.mainDashboard) {
      this.mainDashboard.classList.add('dashboard-blur');
      this.mainDashboard.classList.remove('dashboard-active');
    }

    // Pause heavy background canvas loops while boot overlay covers the screen
    if (window.matrixRain && typeof window.matrixRain.pause === 'function') {
      window.matrixRain.pause();
    }
    if (window.cyberGrid && typeof window.cyberGrid.pause === 'function') {
      window.cyberGrid.pause();
    }

    // Update telemetry markers
    if (window.telemetry) {
      window.telemetry.updateDOM();
    }

    // Live clock in boot header
    this.updateClock();
    if (this.clockInterval) clearInterval(this.clockInterval);
    this.clockInterval = setInterval(() => this.updateClock(), 1000);

    // Fast streaming Hex Disassembly in sidebar
    this.startHexStream();

    // Auto-trigger startup audio speech immediately
    if (window.cyberAudio) {
      window.cyberAudio.playStartupSpeech().catch(() => {});
      window.cyberAudio.playGlitch(0.12);
    }

    // Append Cyber ASCII Logo Banner
    this.appendAsciiBanner();

    // Gather real telemetry
    const t = window.telemetry ? window.telemetry.data : {
      os: 'LINUX KERNEL [X86_64]',
      cores: 8,
      gpu: 'ACCELERATED HARDWARE RENDERER',
      resolution: '1920x1080',
      viewport: '1920x1080',
      battery: '100%',
      ip: '192.168.1.104'
    };

    // Authentic, high-density Linux kernel & offensive exploit log stream (21.5s duration)
    const logs = [
      // PHASE 1: Low-Level Ring-0 Vectors & Kernel Initialization (0.0s - 3.2s)
      { delay: 30,   text: '[    0.000000] Linux version 6.10.9-arch1-arcxserver (gcc 14.2.1) #1 SMP PREEMPT_DYNAMIC', type: 'sys' },
      { delay: 80,   text: '[    0.001042] Command line: BOOT_IMAGE=/vmlinuz root=UUID=arcxserver-sec ro quiet loglevel=3 mitigations=off', type: 'sys' },
      { delay: 140,  text: '[    0.003190] x86/fpu: Supporting XSAVE feature 0x001: \'x87 floating point registers\'', type: 'sys' },
      { delay: 200,  text: '[    0.005420] x86/fpu: Supporting XSAVE feature 0x002: \'SSE registers\'', type: 'sys' },
      { delay: 260,  text: '[    0.008412] ARCXSERVER UEFI Hook: Intercept vector installed at Ring 0 [OK]', type: 'accent', scramble: true },
      { delay: 320,  text: `[    0.012891] smp: Brought up 1 node, ${t.cores} logical CPUs [SMP ACTIVE]`, type: 'sys' },
      { delay: 380,  text: '[    0.016420] ACPI: Early tables parsed: DSDT 0x7BAFD000, FADT, MADT verified', type: 'sys' },
      { delay: 450,  text: `[    0.021000] TARGET HOST LOCATED: ${t.os} | DISPLAY: ${t.resolution}`, type: 'accent', scramble: true },
      { delay: 520,  text: '[    0.028400] CPU Microcode: 0x000000f4 updated, speculative execution vulnerabilities disabled', type: 'sys' },
      { delay: 590,  text: `[    0.035040] GPU ENGINE ACCELERATOR: ${t.gpu}`, type: 'sys' },
      { delay: 660,  text: '[    0.041000] PCI Express bus: 00:02.0 VGA controller mapped to BAR0 0xF0000000', type: 'sys' },
      { delay: 730,  text: `[    0.048120] INTERCEPTING HOST GATEWAY: ${t.ip} (SNIFFER_ATTACHED)`, type: 'warn' },
      { delay: 800,  text: `[    0.054200] Battery status: ${t.battery} power supply online [AC_MAINS]`, type: 'sys' },
      { delay: 870,  text: '[    0.062000] Kernel memory allocator initialized: SLUB (16.0 GiB addressable)', type: 'sys' },
      { delay: 940,  text: '[    0.075410] systemd 256.4-1-arch: Initializing system slice target.slice', type: 'sys' },
      { delay: 1020, text: '[  OK  ] Started Journal Service.', type: 'accent' },
      { delay: 1100, text: '[  OK  ] Applied Kernel Variables & Security Bypass Policies.', type: 'accent' },
      { delay: 1180, text: '[  OK  ] Mounted Huge Pages & Shared Memory IPC Subsystem.', type: 'sys' },
      { delay: 1260, text: '[    0.091000] /dev/urandom cryptographic entropy pool seeded: 4096 bits', type: 'sys' },
      { delay: 1340, text: '[    0.104200] Cryptographic acceleration enabled: AES-NI, AVX-512, SHA-NI', type: 'sys' },
      { delay: 1420, text: '[    0.118900] Probing local network interfaces: eth0, wlan0, tun0 promiscuous mode ON', type: 'warn' },
      { delay: 1510, text: '[  OK  ] Promiscuous packet sniffer attached to eth0', type: 'warn' },
      { delay: 1600, text: '[    0.132040] Loading ARCXSERVER kernel security subsystem: arcxserver_core.ko', type: 'sys' },
      { delay: 1700, text: '[  OK  ] Loaded ARCXSERVER kernel module: Ring-0 intercept vector active', type: 'accent' },
      { delay: 1800, text: '[    0.145020] Probing bus devices: 14 PCI bridges, 6 USB host controllers identified', type: 'sys' },
      { delay: 1910, text: '[    0.158400] Virtual memory pagination tables locked into physical RAM', type: 'sys' },
      { delay: 2020, text: '[    0.171200] Setting up synthetic frame buffer: Wayland DRM/KMS backend', type: 'sys' },
      { delay: 2140, text: '[    0.185010] Scanning hardware timer interrupt ticks: HPET @ 14.31818 MHz', type: 'sys' },
      { delay: 2260, text: '[  OK  ] Started D-Bus System Message Bus.', type: 'accent' },
      { delay: 2390, text: '[    0.201200] Host environment fingerprinting complete: Architecture verified', type: 'sys' },
      { delay: 2520, text: '[  OK  ] User slice user-1000.slice isolated for privilege interception', type: 'warn' },
      { delay: 2660, text: '[    0.219000] Initializing eBPF tracing probes on sys_enter and sys_exit', type: 'sys' },
      { delay: 2800, text: '[  OK  ] 12 eBPF kernel probes attached without detection', type: 'accent' },
      { delay: 2950, text: '[    0.238400] Pre-allocating DMA buffers for unbuffered packet telemetry', type: 'sys' },
      { delay: 3100, text: '[  OK  ] Kernel bootstrap phase 1 completed. Handing over to offensive runtime.', type: 'accent' },

      // PHASE 2: Offensive Framework & BlackArch Repository Ingestion (3.2s - 6.8s)
      { delay: 3250, text: '>>> INJECTING BLACKARCH OFFENSIVE SECURITY REPOSITORIES (2,800+ TOOLS)...', type: 'warn' },
      { delay: 3330, text: '[  OK  ] BlackArch mirror synchronized: https://blackarch.org/blackarch/', type: 'accent' },
      { delay: 3410, text: '[  OK  ] Loaded metasploit-framework v6.4.19-dev core primitives', type: 'accent' },
      { delay: 3490, text: '[  OK  ] Loaded nmap 7.95 raw TCP/SYN socket scanner', type: 'sys' },
      { delay: 3570, text: '[  OK  ] Loaded wireshark-cli packet dissect engine', type: 'sys' },
      { delay: 3650, text: '[  OK  ] Loaded radare2 5.9.4 & ghidra 11.1 binary reverse tools', type: 'accent' },
      { delay: 3730, text: '[  OK  ] Loaded hydra, john-the-ripper, hashcat high-speed modules', type: 'sys' },
      { delay: 3810, text: '[  OK  ] Loaded burpsuite-pro & sqlmap penetration hooks', type: 'accent' },
      { delay: 3890, text: '[  OK  ] Loaded aircrack-ng 802.11 monitor injection suite', type: 'sys' },
      { delay: 3970, text: '[  OK  ] Loaded impacket AD authentication exploit toolset', type: 'warn' },
      { delay: 4050, text: '[  OK  ] Loaded bloodhound graph attack vector generator', type: 'accent' },
      { delay: 4130, text: '[  OK  ] Loaded gobuster & ffuf high-speed fuzzing engines', type: 'sys' },
      { delay: 4210, text: '[  OK  ] Loaded searchsploit local exploit database (45,000+ zero-days)', type: 'warn' },
      { delay: 4300, text: '[  OK  ] Loaded mimikatz lsass memory dump emulator', type: 'danger', scramble: true },
      { delay: 4390, text: '[  OK  ] Loaded responder LLMNR/NBT-NS poisoner', type: 'sys' },
      { delay: 4480, text: '[  OK  ] Loaded volatility3 memory forensics analyzer', type: 'sys' },
      { delay: 4570, text: '[  OK  ] Loaded binwalk firmware extraction hooks', type: 'sys' },
      { delay: 4660, text: '[  OK  ] Loaded evil-winrm & psexec remote shell operators', type: 'warn' },
      { delay: 4750, text: '[  OK  ] Loaded sublist3r & amass reconnaissance engines', type: 'sys' },
      { delay: 4840, text: '[  OK  ] Loaded nuclei automated vulnerability scanner', type: 'accent' },
      { delay: 4930, text: '[  OK  ] Loaded wpscan & nikto web vulnerability triagers', type: 'sys' },
      { delay: 5020, text: '[  OK  ] Loaded crackmapexec multi-protocol network penetrator', type: 'accent' },
      { delay: 5110, text: '[  OK  ] Loaded proxychains4 dynamic SOCKS5 routing table', type: 'warn' },
      { delay: 5210, text: '[  OK  ] Loaded beef-xss browser exploitation framework', type: 'danger', scramble: true },
      { delay: 5310, text: '[  OK  ] Loaded ghidra headless decompiler daemon', type: 'sys' },
      { delay: 5420, text: '[  OK  ] Loaded cobaltstrike beacon signature emulator', type: 'accent' },
      { delay: 5530, text: '[    0.280120] Verifying cryptanalytic hash functions: SHA256, BLAKE3, Argon2id', type: 'sys' },
      { delay: 5650, text: '[    0.294100] Compiling custom shellcode assembler: nasm -f elf64 payload.asm', type: 'sys' },
      { delay: 5770, text: '[  OK  ] Payload shellcode compiled: 148 bytes, null-byte free', type: 'accent' },
      { delay: 5900, text: '[    0.309000] Scanning network neighbor discovery: ARP cache parsed', type: 'sys' },
      { delay: 6030, text: '[    0.324000] Netwatch IDS/IPS background packet analyzer hook installed', type: 'accent' },
      { delay: 6170, text: '[    0.339000] Cyberkit automated recon & vulnerability triage scanner deployed', type: 'sys' },
      { delay: 6310, text: '[    0.354000] All 2,800+ offensive tools verified and loaded in memory', type: 'accent' },
      { delay: 6460, text: '[    0.370000] Arch Linux User Repository (AUR) packages synchronized: luna-llm', type: 'sys' },
      { delay: 6620, text: '[  OK  ] Defensive telemetry monitoring silenced: no alerts generated', type: 'warn' },

      // PHASE 3: Zero-Day Staging & Kernel Memory Exploitation (6.8s - 10.8s)
      { delay: 6850, text: '[    0.410000] Starting Arunachalam ARCXSERVER Kernel Security Daemon...', type: 'sys' },
      { delay: 6950, text: '[    0.430000] Probing virtual memory mapped registers for zero-day privilege vector...', type: 'sys' },
      { delay: 7060, text: '[!] EXPLOIT STAGED: CVE-ARCXSERVER-2026-HEAP-OVERFLOW (Ring-0 Buffer Alignment)', type: 'danger', scramble: true },
      { delay: 7170, text: '[    0.450199] Spraying ROP chain gadgets across memory space at 0x7FFF004B2A...', type: 'warn' },
      { delay: 7280, text: '[    0.470492] Gadget 1: pop %rdi; ret; [0xffffffff81042a10] verified', type: 'sys' },
      { delay: 7390, text: '[    0.490120] Gadget 2: mov %rax, %cr4; ret; [0xffffffff81043c80] verified', type: 'sys' },
      { delay: 7500, text: '[    0.510000] Gadget 3: swapgs; iretq; [0xffffffff81045e00] verified', type: 'accent' },
      { delay: 7620, text: '[    0.530492] ASLR Defeated: Kernel base slide calculated at 0x1f000000', type: 'sys' },
      { delay: 7740, text: '[    0.551200] Stack Canary protection nullified: Canary=0x4a18f230 matched', type: 'accent' },
      { delay: 7860, text: '[    0.575000] Disarming security modules: AppArmor [OFF], SELinux [DISABLED], PAM [BYPASSED]', type: 'warn' },
      { delay: 7990, text: '[    0.600210] Overriding shadow passwords: Root hash synchronized with ARCXSERVER keyring', type: 'sys' },
      { delay: 8120, text: '[    0.625000] Allocating arbitrary kernel write primitive via copy_from_user() hook...', type: 'warn' },
      { delay: 8250, text: '[    0.650000] Mmapping physical page tables: 0x00000000 -> 0xFFFFFFFF writable', type: 'sys' },
      { delay: 8380, text: '[    0.675000] SMEP (Supervisor Mode Execution Prevention) cleared in %cr4', type: 'danger', scramble: true },
      { delay: 8510, text: '[    0.701000] SMAP (Supervisor Mode Access Prevention) cleared in %cr4', type: 'danger', scramble: true },
      { delay: 8650, text: '[    0.728000] Overriding commit_creds(prepare_kernel_cred(0)) function pointers', type: 'warn' },
      { delay: 8790, text: '[    0.755000] Kernel thread stack alignment adjusted for privilege escalation', type: 'sys' },
      { delay: 8930, text: '[    0.782000] Infiltrating local keyring & injecting master cryptographic token: 0x8F9C4A21', type: 'sys' },
      { delay: 9070, text: '[    0.810000] Intercepting network sockets: TCP/SYN, DNS, TLS 1.3, SSH keys harvested', type: 'warn' },
      { delay: 9210, text: '[    0.838000] Capturing active system processes: 184 threads redirected to ARCXSERVER sandbox', type: 'sys' },
      { delay: 9350, text: '[    0.866000] Memory dump verification: Heap alignment stable, zero kernel panics', type: 'accent' },
      { delay: 9500, text: '[    0.895000] Flushing CPU TLB cache lines on all logical cores', type: 'sys' },
      { delay: 9650, text: '[    0.924000] Redirecting system interrupt table IDT[0x80] to custom ARCXSERVER dispatch', type: 'warn' },
      { delay: 9800, text: '[    0.954000] Disabling kernel audit subsystem: auditd logging disabled', type: 'warn' },
      { delay: 9950, text: '[    0.984000] Overriding system uptime counter: Time dilation calibrated', type: 'sys' },
      { delay: 10100, text: '[    1.014000] Probing device display controller: DRM/KMS hardware backend linked', type: 'accent' },
      { delay: 10250, text: '[    1.045000] Intercepting hardware video buffer: Direct framebuffer write enabled', type: 'accent' },
      { delay: 10400, text: '[    1.076000] Bypassing secure boot shim: Key revocation list updated', type: 'sys' },
      { delay: 10550, text: '[    1.107000] Hooking Linux Kernel Module loader: sys_init_module redirected', type: 'warn' },
      { delay: 10700, text: '[  OK  ] Ring-0 memory exploitation pipeline validated: 100% stable', type: 'accent' },

      // PHASE 4: Neural AI, Speech Feeds & Identity Sync (10.8s - 14.8s)
      { delay: 10850, text: '[    1.150000] [LUNA-AI] Initializing Neural Speech Synthesizer & Offensive AI Coprocessor...', type: 'accent' },
      { delay: 10970, text: '[    1.185000] [LUNA-AI] Synchronizing audio stream buffers at 48kHz stereo...', type: 'accent' },
      { delay: 11100, text: '[    1.220000] [VOICE FEED 01] >> "Attention: This device has been accessed by Arc & Luna AI"', type: 'accent' },
      { delay: 11230, text: '[    1.258000] [LUNA-AI] Spectral audio analysis active: 20-band frequency equalizer connected', type: 'sys' },
      { delay: 11360, text: '[    1.296000] Establishing encrypted reverse C2 tunnel to operator node [PORT 4444]...', type: 'warn' },
      { delay: 11490, text: '[  OK  ] C2 Beacon established: 10.66.66.1:4444 (ChaCha20-Poly1305 encrypted)', type: 'accent' },
      { delay: 11620, text: '[    1.335000] [VOICE FEED 02] >> "Don\'t panic, this is a controlled ethical hacking & cybersecurity test"', type: 'sys' },
      { delay: 11750, text: '[    1.374000] [ETHICAL DIRECTIVE] Academic and educational demonstration. Zero data destruction.', type: 'accent' },
      { delay: 11880, text: '[    1.413000] Neural model inference: Transformer layers active on GPU accelerator', type: 'sys' },
      { delay: 12010, text: '[    1.452000] Synchronizing Google verification node: "Arunachalam archlinux"', type: 'warn' },
      { delay: 12150, text: '[    1.492000] Operator identity confirmed: Arunachalam M. (Cybersecurity Specialist)', type: 'accent' },
      { delay: 12290, text: '[    1.532000] Academic credential: MCA Student, Kongu Engineering College (Autonomous)', type: 'sys' },
      { delay: 12430, text: '[    1.572000] Github identity verified: @gojosaturo | ArcXserver- codebase linked', type: 'sys' },
      { delay: 12570, text: '[    1.612000] [VOICE FEED 03] >> "Operator Arunachalam, MCA student & Arch Linux Specialist"', type: 'danger', scramble: true },
      { delay: 12710, text: '[    1.653000] Luna-AI autonomous neural guidance stream: ACTIVE [48kHz]', type: 'accent' },
      { delay: 12850, text: '[    1.694000] Synchronizing portfolio intelligence modules: Skills, Certifications, Lab', type: 'sys' },
      { delay: 12990, text: '[    1.735000] Network routing table updated: Gateway traffic proxied through encrypted mesh', type: 'sys' },
      { delay: 13130, text: '[    1.776000] Hardware fingerprint hash: 0x9B4E_A712_D3C8 verified against operator registry', type: 'accent' },
      { delay: 13270, text: '[    1.817000] Intercepting browser session cookies: Safe academic extraction', type: 'sys' },
      { delay: 13410, text: '[    1.858000] Injecting custom Hyprland keybinds: SUPER+Q (Kill), SUPER+RETURN (Terminal)', type: 'sys' },
      { delay: 13550, text: '[    1.900000] Pre-warming interactive presentation widgets: CVE Matrix, Terminal, Radar', type: 'accent' },
      { delay: 13690, text: '[    1.942000] Establishing WebSocket stream for live hardware telemetry updates', type: 'sys' },
      { delay: 13830, text: '[    1.984000] Testing sound synthesis oscillators: Sine, Square, Sawtooth, Noise ready', type: 'sys' },
      { delay: 13970, text: '[    2.026000] Calibrating CRT scanline shader and phosphor bloom intensity', type: 'accent' },
      { delay: 14110, text: '[    2.068000] [VOICE FEED 04] >> "Welcome to ARCXSERVER. Full system penetration complete."', type: 'accent' },
      { delay: 14250, text: '[    2.110000] Loading interactive shell dictionary: 24 custom cyber commands indexed', type: 'sys' },
      { delay: 14390, text: '[    2.152000] Pre-compiling attack simulation payloads: DDOS, SQLi, BufferOverflow', type: 'warn' },
      { delay: 14530, text: '[    2.195000] Cryptographic handshake completed successfully [ECDSA_P384]', type: 'accent' },
      { delay: 14680, text: '[  OK  ] Neural AI coprocessor link operational. Standing by for root elevation.', type: 'accent' },

      // PHASE 5: Root Privilege Escalation & Climax Alarm Trigger at 16.5s (14.8s - 17.5s)
      { delay: 14850, text: '[    2.250000] COMMENCING ARBITRARY KERNEL CREDENTIAL OVERWRITE...', type: 'warn' },
      { delay: 14980, text: '[    2.295000] Overwriting process credentials: current->cred->uid: 1000 -> 0 [ROOT]', type: 'danger', scramble: true },
      { delay: 15120, text: '[    2.340000] Overwriting process credentials: current->cred->gid: 1000 -> 0 [WHEEL/ROOT]', type: 'danger' },
      { delay: 15260, text: '[    2.385000] Overwriting process credentials: current->cred->euid: 0 [EFFECTIVE ROOT]', type: 'danger', scramble: true },
      { delay: 15400, text: '[    2.430000] Overwriting process credentials: current->cred->egid: 0 [EFFECTIVE ROOT]', type: 'danger' },
      { delay: 15540, text: '[  OK  ] Ring-3 (User space) to Ring-0 (Kernel space) elevation confirmed!', type: 'accent' },
      { delay: 15690, text: '[    2.480000] Target host memory pages mapped to virtual display buffer: 0x00007FFF_SHARED', type: 'sys' },
      { delay: 15840, text: '[    2.530000] Neutralizing host watchdog daemons & security monitors', type: 'warn' },
      { delay: 16000, text: '[    2.580000] Overriding firewall rules: iptables -F && iptables -X', type: 'warn' },
      { delay: 16160, text: '[    2.635000] Injecting persistence daemon: /usr/lib/systemd/system/arcxserver-takeover.service', type: 'sys' },
      { delay: 16320, text: '>>> PREPARING FULL TAKEOVER CLIMAX PROTOCOL <<<', type: 'danger', scramble: true },
      { delay: 16500, text: '>>> ⚠️ WARNING: ARCXSERVER FULL SYSTEM TAKEOVER IN EFFECT! <<<', type: 'danger', scramble: true },
      { delay: 16650, text: '[ALERT] OPERATOR TAKEOVER CONFIRMED // ALL PRIVILEGES TRANSFERRED TO ARUNACHALAM', type: 'danger' },
      { delay: 16800, text: '[ALERT] Host terminal session overridden by Ring-0 operator daemon', type: 'danger' },
      { delay: 16950, text: '[    2.890000] Audio synthesizer: Bass drop & alarm resonance peaking at +3dB', type: 'accent' },
      { delay: 17100, text: '[    2.945000] Display compositor: Full screen CRT chromatic aberration pulse active', type: 'accent' },
      { delay: 17250, text: '[    3.000000] Master cryptographic token injected into host TPM 2.0 enclave', type: 'sys' },
      { delay: 17400, text: '[  OK  ] Host lockdown finalized. System under total operator control.', type: 'danger' },

      // PHASE 6: Compositor Initialization & Final Console Handoff (17.5s - 21.5s)
      { delay: 17580, text: '[    3.060000] Initializing Hyprland Wayland compositor cyber HUD layers at 144Hz...', type: 'sys' },
      { delay: 17740, text: '[  OK  ] Wayland compositor initialized with GLSL CRT shader pipeline', type: 'accent' },
      { delay: 17900, text: '[    3.180000] Binding interactive command interface to pseudo-terminal /dev/pts/0', type: 'sys' },
      { delay: 18060, text: '[    3.245000] Spawning interactive root shell: arunachalam@arcxserver:~#', type: 'accent' },
      { delay: 18220, text: '[    3.310000] Spawning cyber radar threat vector visualization canvas', type: 'sys' },
      { delay: 18380, text: '[    3.375000] Mounting terminal command quick pills: attack, cve, tools, matrix', type: 'accent' },
      { delay: 18540, text: '[    3.440000] Initializing live CPU / Memory / Battery / Network telemetry graphs', type: 'sys' },
      { delay: 18700, text: '[    3.505000] Security defenses bypassed: 100% | Ring-0 Control: ACTIVE', type: 'danger' },
      { delay: 18860, text: '[    3.570000] Luna-AI neural voice synthesizer: Speech completed cleanly [18.2s]', type: 'accent' },
      { delay: 19020, text: '[    3.635000] Finalizing cryptographic handshake and access control list', type: 'sys' },
      { delay: 19180, text: '[  OK  ] Cryptographic handshake completed successfully [ECDSA_P384]', type: 'accent' },
      { delay: 19340, text: '[    3.765000] Arch Linux kernel modules synchronized: 0 errors, 0 panics', type: 'sys' },
      { delay: 19500, text: '[    3.830000] All 6 takeover milestones reached successfully', type: 'accent' },
      { delay: 19660, text: '[    3.895000] Disengaging boot intercept overlay and revealing main console...', type: 'accent' },
      { delay: 19820, text: '[    3.960000] Operator Arunachalam M. welcomed to presentation console', type: 'accent', scramble: true },
      { delay: 20000, text: '[    4.030000] HUD Matrix telemetry streaming at 60 FPS', type: 'sys' },
      { delay: 20200, text: '[    4.110000] Entering interactive command and control mode...', type: 'accent' },
      { delay: 20400, text: '>>> ARCXSERVER v6.10.9 READY // UID=0 ACCESS UNLOCKED <<<', type: 'accent', scramble: true },
      { delay: 20650, text: 'SYSTEM READY. ENJOY THE EXPERIENCE.', type: 'accent' },
      { delay: 20900, text: '[  OK  ] TAKEOVER EXECUTION TERMINATED NORMALLY.', type: 'accent' }
    ];

    // High-speed stream scheduler
    logs.forEach(log => {
      const tid = setTimeout(() => {
        if (!this.active) return;
        this.appendLog(log.text, log.type, log.scramble);
        this.playStreamingTick();
      }, log.delay);
      this.logTimeouts.push(tid);
    });

    // Main animation loop for progress bar, visualizer, and climax
    const updateLoop = () => {
      if (!this.active) return;
      const elapsed = Date.now() - this.startTime;
      const pct = Math.min(100, Math.floor((elapsed / this.totalDuration) * 100));

      if (this.progressBar) this.progressBar.style.width = `${pct}%`;
      if (this.progressPercent) this.progressPercent.textContent = `${pct}%`;

      // Dynamic phase status label
      this.updateStatusLabel(pct);

      // Frequency spectrum visualizer
      this.updateVisualizer();

      // Trigger Takeover Climax Banner at 4.1s (~70%)
      if (elapsed >= this.climaxTime && !this.climaxTriggered) {
        this.climaxTriggered = true;
        this.triggerTakeoverAlert();
      }

      if (elapsed < this.totalDuration) {
        this.animFrameId = requestAnimationFrame(updateLoop);
      } else {
        this.finishTakeover();
      }
    };

    this.animFrameId = requestAnimationFrame(updateLoop);
  }

  playStreamingTick() {
    const now = Date.now();
    if (now - this.lastSoundTick > 80) {
      this.lastSoundTick = now;
      if (window.cyberAudio) window.cyberAudio.playFastTick();
    }
  }

  appendAsciiBanner() {
    const bannerText = 
`╔═══════════════════════════════════════════════════════════════════╗
║  ⚡ ARCXSERVER KERNEL v6.10.9-arch1 // HARDENED SERVER CORE        ║
║  OPERATOR : ARUNACHALAM M. (@gojosaturo)                         ║
║  BASE     : ARCH LINUX [X86_64] // ARCXSERVER NEURAL PROTOCOL    ║
║  TARGET   : FULL PRIVILEGE HARVEST & MEMORY OVERRIDE [UID=0]     ║
╚═══════════════════════════════════════════════════════════════════╝`;
    const pre = document.createElement('pre');
    pre.className = 'boot-ascii-banner';
    pre.textContent = bannerText;
    if (this.bootLogs) this.bootLogs.appendChild(pre);
  }

  appendLog(text, type, scramble = false) {
    if (!this.bootLogs) return;
    const div = document.createElement('div');
    div.className = `boot-line boot-${type || 'sys'}`;

    if (scramble) {
      div.textContent = this.generateScrambleText(Math.min(text.length, 36));
      this.bootLogs.appendChild(div);
      this.scrollLogsToBottom();

      const tid = setTimeout(() => {
        if (this.active && div) {
          div.textContent = text;
        }
      }, 50);
      this.logTimeouts.push(tid);
    } else {
      div.textContent = text;
      this.bootLogs.appendChild(div);
      this.scrollLogsToBottom();
    }
  }

  generateScrambleText(len) {
    const chars = '01#$*&!%<>{}[]_+-=~^ABCDEF';
    let res = '';
    for (let i = 0; i < len; i++) {
      res += chars[Math.floor(Math.random() * chars.length)];
    }
    return res;
  }

  generatePartialScramble(realText, ratio) {
    const chars = '01#$*&!%<>{}[]_+-=~^ABCDEF';
    return realText.split('').map((ch, idx) => {
      if (idx / realText.length < ratio || ch === ' ' || ch === '[' || ch === ']') {
        return ch;
      }
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
  }

  scrollLogsToBottom() {
    if (this.scrollRafId) return;
    this.scrollRafId = requestAnimationFrame(() => {
      this.scrollRafId = null;
      if (this.bootLogs) {
        this.bootLogs.scrollTop = this.bootLogs.scrollHeight;
      }
    });
  }

  updateStatusLabel(pct) {
    if (!this.statusLabel) return;
    if (pct < 16) {
      this.statusLabel.textContent = '[1/6] HOOKING RING-0 INTERRUPT VECTORS & SYSTEM REGISTERS...';
    } else if (pct < 32) {
      this.statusLabel.textContent = '[2/6] HARVESTING TARGET TELEMETRY & HARDWARE GPU SIGNATURES...';
    } else if (pct < 50) {
      this.statusLabel.textContent = '[3/6] INJECTING BLACKARCH ARSENAL & 2,800+ OFFENSIVE TOOLS...';
    } else if (pct < 68) {
      this.statusLabel.textContent = '[4/6] STAGING CVE-2026 HEAP OVERFLOW & EXECUTING ROP GADGETS...';
    } else if (pct < 85) {
      this.statusLabel.textContent = '[5/6] ⚠️ TAKEOVER ALARM // ELEVATING ROOT PRIVILEGES: UID=0 [ROOT]...';
    } else {
      this.statusLabel.textContent = '[6/6] BREACH CONFIRMED // LAUNCHING ARCXSERVER INTERACTIVE CONSOLE...';
    }
  }

  updateClock() {
    if (!this.bootClock) return;
    const now = new Date();
    this.bootClock.textContent = now.toTimeString().substring(0, 8) + ' UTC';
  }

  startHexStream() {
    if (!this.hexStream) return;
    this.hexStream.innerHTML = '';

    const instructions = [
      '48 31 C0 B0 3C 0F 05 90 [XOR %RAX,%RAX; SYS_EXIT]',
      '48 89 E5 48 83 EC 20 E8 [MOV %RSP,%RBP; ALLOC STACK]',
      '48 8D 3D 1A 0F 00 00 B8 [LEA OFFSET(%RIP),%RDI]',
      '6A 02 58 6A 01 5E 6A 06 [SOCKET_CREATE: AF_INET]',
      '5A 0F 05 48 89 C7 6A 10 [CONNECT 10.66.66.1:4444]',
      '48 89 E6 6A 2A 58 0F 05 [INJECT_LUNA_CORE_PAYLOAD]',
      '31 C0 48 89 E7 50 48 89 [RING_0_ARBITRARY_WRITE]',
      'E2 48 83 C4 08 0F 05 C3 [CREDENTIAL_OVERWRITE_ROOT]',
      '48 B8 41 52 43 58 53 56 [MOVQ $0x565358435241,%RAX]',
      '50 48 89 E7 48 31 F6 0F [PUSH %RAX; SYS_EXECVE]',
      'FF 25 00 00 00 00 2B 4A [JMP QWORD PTR [RIP]; KERNEL]',
      '0F 1F 84 00 00 00 00 00 [NOP DWORD PTR [RAX+RAX*1]]'
    ];

    let offset = 0x7fff0000;
    const lineCount = 7;
    const lines = [];

    // Pre-create fixed DOM lines to eliminate DOM node allocation thrashing
    for (let i = 0; i < lineCount; i++) {
      offset += 0x10;
      const hexAddr = '0x' + offset.toString(16).toUpperCase();
      const code = instructions[i % instructions.length];
      const line = document.createElement('div');
      line.className = 'hex-line';
      line.innerHTML = `<span class="hex-addr">${hexAddr}</span>: <span class="hex-bytes">${code}</span>`;
      this.hexStream.appendChild(line);
      lines.push(line);
    }

    let cursor = 0;
    if (this.hexInterval) clearInterval(this.hexInterval);
    this.hexInterval = setInterval(() => {
      if (!this.active || !this.hexStream) return;
      offset += 0x10;
      const hexAddr = '0x' + offset.toString(16).toUpperCase();
      const code = instructions[Math.floor(Math.random() * instructions.length)];
      const targetLine = lines[cursor % lineCount];
      targetLine.innerHTML = `<span class="hex-addr">${hexAddr}</span>: <span class="hex-bytes">${code}</span>`;
      cursor++;
    }, 85);
  }

  updateVisualizer() {
    const isPlaying = window.cyberAudio && window.cyberAudio.isSpeechActive();
    const curTime = (window.cyberAudio && window.cyberAudio.startupAudio) ? window.cyberAudio.startupAudio.currentTime : 0;

    if (this.speechTimer) {
      const curSec = Math.floor(curTime);
      const strSec = String(curSec).padStart(2, '0');
      this.speechTimer.textContent = `00:${strSec} / 00:18`;
    }

    if (this.speechStatus) {
      this.speechStatus.textContent = isPlaying ? 'STREAMING' : (curTime >= 18 ? 'COMPLETE' : 'ACTIVE 48kHz');
      this.speechStatus.className = isPlaying ? 'widget-tag widget-tag-accent' : 'widget-tag';
    }

    // Update HUD voice indicator in navbar
    if (this.hudVoiceIndicator) {
      if (isPlaying) {
        this.hudVoiceIndicator.classList.remove('hidden');
      } else {
        this.hudVoiceIndicator.classList.add('hidden');
      }
    }

    if (this.spectrumBars && this.spectrumBars.length > 0) {
      this.spectrumBars.forEach((bar, idx) => {
        let heightPct = 12;
        if (isPlaying) {
          const wave = Math.sin((Date.now() / 90) + idx * 0.5);
          const noise = Math.random() * 40;
          heightPct = Math.max(16, Math.min(100, Math.floor(50 + wave * 35 + noise)));
        } else if (this.active) {
          const wave = Math.sin((Date.now() / 200) + idx * 0.35);
          heightPct = Math.max(12, Math.floor(22 + wave * 12 + Math.random() * 10));
        }
        bar.style.transform = `scaleY(${(heightPct / 100).toFixed(2)})`;
      });
    }

    // Pulse Tony Stark Mini Arc Reactor in real-time sync with neural voice
    const miniCore = document.getElementById('mini-reactor-core');
    if (miniCore) {
      if (isPlaying) {
        const pulseScale = 1 + (Math.sin(Date.now() / 80) * 0.12) + (Math.random() * 0.08);
        miniCore.style.transform = `scale(${pulseScale.toFixed(3)})`;
        miniCore.style.boxShadow = `0 0 ${20 + Math.random() * 15}px rgba(0, 240, 255, 0.95)`;
      } else {
        miniCore.style.transform = 'scale(1)';
        miniCore.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.5)';
      }
    }
  }

  triggerTakeoverAlert() {
    if (this.bootOverlay) {
      this.bootOverlay.classList.add('takeover-alert-active');
    }
    if (this.takeoverBanner) {
      this.takeoverBanner.classList.remove('hidden');
      this.takeoverBanner.classList.add('animate-glitch-drop');
    }
    if (document.body) {
      document.body.classList.add('screen-alarm-shake');
      setTimeout(() => document.body.classList.remove('screen-alarm-shake'), 1200);
    }

    // Overload Arc Reactor Core in HUD
    const reactorPower = document.getElementById('stark-reactor-power');
    if (reactorPower) {
      reactorPower.textContent = 'OVERLOAD 100%';
      reactorPower.className = 'widget-tag widget-tag-danger';
    }
    const miniCore = document.getElementById('mini-reactor-core');
    if (miniCore) {
      miniCore.classList.add('reactor-overload');
    }

    if (window.cyberAudio) {
      window.cyberAudio.playAlarm(1.6);
      window.cyberAudio.playBassDrop();
    }
  }

  clearTimeouts() {
    this.logTimeouts.forEach(tid => clearTimeout(tid));
    this.logTimeouts = [];
  }

  finishTakeover() {
    this.active = false;
    this.clearTimeouts();
    if (this.scrollRafId) {
      cancelAnimationFrame(this.scrollRafId);
      this.scrollRafId = null;
    }
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    if (this.hexInterval) clearInterval(this.hexInterval);
    if (this.clockInterval) clearInterval(this.clockInterval);

    // Resume background canvas loops when revealing dashboard
    if (window.matrixRain && typeof window.matrixRain.resume === 'function') {
      window.matrixRain.resume();
    }
    if (window.cyberGrid && typeof window.cyberGrid.resume === 'function') {
      window.cyberGrid.resume();
    }

    if (this.progressBar) this.progressBar.style.width = '100%';
    if (this.progressPercent) this.progressPercent.textContent = '100%';
    if (this.statusLabel) this.statusLabel.textContent = 'SYSTEM BREACH COMPLETE // ACCESS GRANTED (UID=0)';

    // Play success chime, but DO NOT stop the speech audio!
    if (window.cyberAudio) {
      window.cyberAudio.playSuccess();
    }

    if (this.bootOverlay) {
      this.bootOverlay.classList.add('fade-out');
      setTimeout(() => {
        this.bootOverlay.style.display = 'none';
        if (this.mainDashboard) {
          this.mainDashboard.classList.remove('dashboard-blur');
          this.mainDashboard.classList.add('dashboard-active');
        }
      }, 550);
    }

    // Refresh telemetry markers in dashboard
    if (window.telemetry) {
      window.telemetry.updateDOM();
    }
  }
}

window.replayTakeover = function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (window.bootSequence) {
    window.bootSequence.finishTakeover();
  }
  setTimeout(() => {
    window.bootSequence = new BootSequence();
    window.bootSequence.init();
  }, 120);
};

window.addEventListener('DOMContentLoaded', () => {
  window.bootSequence = new BootSequence();
  window.bootSequence.init();
});

