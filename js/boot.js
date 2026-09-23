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
    this.totalDuration = 5800; // Ultra-fast, intense 5.8s hacker takeover
    this.climaxTime = 4100;    // Climax alert trigger at 4.1s
    this.climaxTriggered = false;

    this.spectrumBars = [];
    this.hexInterval = null;
    this.clockInterval = null;
    this.animFrameId = null;
    this.logTimeouts = [];
    this.lastSoundTick = 0;
  }

  init() {
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
    this.start();
  }

  setupVisualizer() {
    if (!this.spectrumContainer) return;
    this.spectrumContainer.innerHTML = '';
    this.spectrumBars = [];
    const barCount = 20;
    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement('div');
      bar.className = 'spectrum-bar';
      bar.style.height = '15%';
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

    // Update telemetry markers
    if (window.telemetry) {
      window.telemetry.updateDOM();
    }

    // Live clock in boot header
    this.updateClock();
    if (this.clockInterval) clearInterval(this.clockInterval);
    this.clockInterval = setInterval(() => this.updateClock(), 1000);

    // Fast streaming Hex Disassembly in sidebar (45ms interval)
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

    // Authentic, high-density Linux kernel & offensive exploit log stream
    const logs = [
      { delay: 40,   text: '[    0.000000] Linux version 6.10.9-arch1-arcxos (gcc 14.2.1) #1 SMP PREEMPT_DYNAMIC', type: 'sys' },
      { delay: 80,   text: '[    0.001042] Command line: BOOT_IMAGE=/vmlinuz root=UUID=arcxos-sec ro quiet loglevel=3 mitigations=off', type: 'sys' },
      { delay: 120,  text: '[    0.003190] x86/fpu: Supporting XSAVE feature 0x001: \'x87 floating point registers\'', type: 'sys' },
      { delay: 160,  text: '[    0.008412] ArcXOS UEFI Hook: Intercept vector installed at Ring 0 [OK]', type: 'accent', scramble: true },
      { delay: 200,  text: `[    0.012891] smp: Brought up 1 node, ${t.cores} logical CPUs [SMP ACTIVE]`, type: 'sys' },
      { delay: 250,  text: `[    0.021000] TARGET HOST LOCATED: ${t.os} | DISPLAY: ${t.resolution}`, type: 'accent', scramble: true },
      { delay: 290,  text: `[    0.035040] GPU ENGINE ACCELERATOR: ${t.gpu}`, type: 'sys' },
      { delay: 330,  text: `[    0.048120] INTERCEPTING HOST GATEWAY: ${t.ip} (SNIFFER_ATTACHED)`, type: 'warn' },
      { delay: 370,  text: '[    0.062000] ACPI: Core revision 20240322, DSDT 0x7BAFD000 table verified', type: 'sys' },
      { delay: 410,  text: '[    0.075410] systemd 256.4-1-arch: Initializing system slice target.slice', type: 'sys' },
      { delay: 450,  text: '[  OK  ] Started Journal Service.', type: 'accent' },
      { delay: 490,  text: '[  OK  ] Applied Kernel Variables & Security Bypass Policies.', type: 'accent' },
      { delay: 530,  text: '[  OK  ] Mounted Huge Pages & Shared Memory IPC Subsystem.', type: 'sys' },
      { delay: 570,  text: '>>> INJECTING BLACKARCH OFFENSIVE SECURITY REPOSITORIES (2,800+ TOOLS)...', type: 'warn' },
      { delay: 620,  text: '[  OK  ] Loaded metasploit-framework v6.4.19-dev core primitives', type: 'accent' },
      { delay: 660,  text: '[  OK  ] Loaded nmap 7.95 raw TCP/SYN socket scanner', type: 'sys' },
      { delay: 700,  text: '[  OK  ] Loaded wireshark-cli packet dissect engine', type: 'sys' },
      { delay: 740,  text: '[  OK  ] Loaded radare2 5.9.4 & ghidra binary reverse tools', type: 'accent' },
      { delay: 780,  text: '[  OK  ] Loaded hydra, john-the-ripper, hashcat high-speed modules', type: 'sys' },
      { delay: 820,  text: '[  OK  ] Loaded burpsuite-pro & sqlmap penetration hooks', type: 'accent' },
      { delay: 870,  text: '[    0.142091] Starting Arunachalam ArcXOS Kernel Security Daemon...', type: 'sys' },
      { delay: 920,  text: '[    0.180290] Probing virtual memory mapped registers for zero-day privilege vector...', type: 'sys' },
      { delay: 970,  text: '[!] EXPLOIT STAGED: CVE-ARCXOS-2026-HEAP-OVERFLOW (Ring-0 Buffer Alignment)', type: 'danger', scramble: true },
      { delay: 1020, text: '[    0.220199] Spraying ROP chain gadgets across memory space at 0x7FFF004B2A...', type: 'warn' },
      { delay: 1070, text: '[    0.260492] ASLR Defeated: Kernel base slide calculated at 0x1f000000', type: 'sys' },
      { delay: 1120, text: '[    0.301200] Stack Canary protection nullified: Canary=0x4a18f230 matched', type: 'accent' },
      { delay: 1170, text: '[    0.345000] Disarming security modules: AppArmor [OFF], SELinux [DISABLED], PAM [BYPASSED]', type: 'warn' },
      { delay: 1220, text: '[    0.389201] [LUNA-AI] Initializing Neural Speech Synthesizer & Offensive AI Coprocessor...', type: 'accent' },
      { delay: 1280, text: '[    0.435012] [VOICE FEED 01] >> "Attention: This device has been accessed by Arc & Luna AI"', type: 'accent' },
      { delay: 1340, text: '[    0.481020] [VOICE FEED 02] >> "Don\'t panic, this is a controlled ethical hacking & cybersecurity test"', type: 'sys' },
      { delay: 1400, text: '[    0.530120] [ETHICAL DIRECTIVE] Academic and educational demonstration. Zero data destruction.', type: 'accent' },
      { delay: 1460, text: '[    0.580210] Overriding shadow passwords: Root hash synchronized with ArcXOS keyring', type: 'sys' },
      { delay: 1520, text: '[    0.630490] Allocating arbitrary kernel write primitive via copy_from_user() hook...', type: 'warn' },
      { delay: 1580, text: '[    0.680120] Overwriting process credentials: current->cred->uid: 1000 -> 0 [ROOT]', type: 'danger', scramble: true },
      { delay: 1640, text: '[    0.730490] Overwriting process credentials: current->cred->gid: 1000 -> 0 [WHEEL/ROOT]', type: 'danger' },
      { delay: 1700, text: '[  OK  ] Ring-3 (User space) to Ring-0 (Kernel space) elevation confirmed', type: 'accent' },
      { delay: 1760, text: '[    0.810291] Initializing Hyprland Wayland compositor cyber HUD layers at 144Hz...', type: 'sys' },
      { delay: 1820, text: '[  OK  ] Wayland compositor initialized with GLSL CRT shader pipeline', type: 'accent' },
      { delay: 1880, text: '[    0.890120] Establishing encrypted reverse C2 tunnel to operator node [PORT 4444]...', type: 'warn' },
      { delay: 1940, text: '[  OK  ] C2 Beacon established: 10.66.66.1:4444 (ChaCha20-Poly1305 encrypted)', type: 'accent' },
      { delay: 2000, text: '[    0.950120] [VOICE FEED 03] >> "Operator Arunachalam, MCA student & Arch Linux Specialist"', type: 'danger', scramble: true },
      { delay: 2060, text: '[    1.010290] Intercepting network sockets: TCP/SYN, DNS, TLS 1.3, SSH keys harvested', type: 'warn' },
      { delay: 2120, text: '[    1.070192] Infiltrating local keyring & injecting master cryptographic token: 0x8F9C4A21', type: 'sys' },
      { delay: 2180, text: '[    1.130492] Netwatch IDS/IPS background packet analyzer hook installed', type: 'accent' },
      { delay: 2240, text: '[    1.190120] Cyberkit automated recon & vulnerability triage scanner deployed', type: 'sys' },
      { delay: 2300, text: '[    1.250490] Memory dump verification: Heap alignment stable, zero kernel panics', type: 'accent' },
      { delay: 2360, text: '[    1.310120] Arch Linux User Repository (AUR) packages synchronized: luna-llm, hyprland-git', type: 'sys' },
      { delay: 2420, text: '[    1.370290] Kernel ring buffer: 0 warnings, 0 denials, 100% privilege override', type: 'accent' },
      { delay: 2480, text: '[    1.430190] Target host memory pages mapped to virtual display buffer: 0x00007FFF_SHARED', type: 'sys' },
      { delay: 2540, text: '[    1.490210] Telemetry extraction complete: CPU, GPU, Network, Display synchronized', type: 'accent' },
      { delay: 2600, text: '[    1.550120] Binding interactive command interface to pseudo-terminal /dev/pts/0', type: 'sys' },
      { delay: 2660, text: '[    1.610490] Luna-AI autonomous neural guidance stream: ACTIVE [48kHz]', type: 'accent' },
      { delay: 2720, text: '[    1.670120] Synchronizing Google verification node: "Arunachalam archlinux"', type: 'warn' },
      { delay: 2780, text: '[    1.730290] Operator authorization verified: Arunachalam M. (@gojosaturo)', type: 'danger' },
      { delay: 2840, text: '[    1.790190] Spawning interactive root shell: arunachalam@arcxos:~#', type: 'accent' },
      { delay: 2900, text: '[    1.850490] Security defenses bypassed: 100% | Ring-0 Control: ACTIVE', type: 'danger' },
      { delay: 2960, text: '[    1.910120] All subsystems operational. Finalizing cryptographic lock...', type: 'sys' },
      { delay: 3020, text: '[  OK  ] Cryptographic handshake completed successfully [ECDSA_P384]', type: 'accent' },
      { delay: 3080, text: '[  OK  ] Terminal pipe established. Preparing full breach notification...', type: 'warn' },
      { delay: 3150, text: '>>> INITIALIZING FULL TAKEOVER CLIMAX PROTOCOL <<<', type: 'danger', scramble: true }
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
    if (now - this.lastSoundTick > 55) {
      this.lastSoundTick = now;
      if (window.cyberAudio) window.cyberAudio.playFastTick();
    }
  }

  appendAsciiBanner() {
    const bannerText = 
`╔═══════════════════════════════════════════════════════════════════╗
║  ⚡ ARCXOS KERNEL v6.10.9-arch1 // HARDENED PENETRATION SYSTEM   ║
║  OPERATOR : ARUNACHALAM M. (@gojosaturo)                         ║
║  BASE     : ARCH LINUX [X86_64] // LUNA-AI NEURAL PROTOCOL       ║
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
      div.textContent = this.generateScrambleText(text.length);
      this.bootLogs.appendChild(div);
      this.scrollLogsToBottom();

      // Scramble resolve effect
      let iterations = 0;
      const interval = setInterval(() => {
        iterations++;
        if (iterations >= 3 || !this.active) {
          clearInterval(interval);
          div.textContent = text;
        } else {
          div.textContent = this.generatePartialScramble(text, iterations / 3);
        }
      }, 35);
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
    if (this.bootLogs) {
      this.bootLogs.scrollTop = this.bootLogs.scrollHeight;
    }
  }

  updateStatusLabel(pct) {
    if (!this.statusLabel) return;
    if (pct < 18) {
      this.statusLabel.textContent = '[1/6] HOOKING RING-0 INTERRUPT VECTORS & MEMORY REGISTERS...';
    } else if (pct < 38) {
      this.statusLabel.textContent = '[2/6] EXTRACTING TARGET TELEMETRY & HARDWARE SIGNATURES...';
    } else if (pct < 55) {
      this.statusLabel.textContent = '[3/6] INJECTING BLACKARCH ARSENAL & LUNA-AI NEURAL DAEMON...';
    } else if (pct < 72) {
      this.statusLabel.textContent = '[4/6] STAGING CVE HEAP OVERFLOW & EXECUTING ROP CHAIN...';
    } else if (pct < 88) {
      this.statusLabel.textContent = '[5/6] ⚠️ ELEVATING ROOT PRIVILEGES: UID=1000 -> UID=0 [ROOT]...';
    } else {
      this.statusLabel.textContent = '[6/6] TAKEOVER CONFIRMED // LAUNCHING ARCXOS CONSOLE...';
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
      '48 B8 41 52 43 58 4F 53 [MOVQ $0x534F58435241,%RAX]',
      '50 48 89 E7 48 31 F6 0F [PUSH %RAX; SYS_EXECVE]',
      'FF 25 00 00 00 00 2B 4A [JMP QWORD PTR [RIP]; KERNEL]',
      '0F 1F 84 00 00 00 00 00 [NOP DWORD PTR [RAX+RAX*1]]'
    ];

    let offset = 0x7fff0000;

    const pushLine = () => {
      if (!this.active || !this.hexStream) return;
      offset += 0x10;
      const hexAddr = '0x' + offset.toString(16).toUpperCase();
      const code = instructions[Math.floor(Math.random() * instructions.length)];
      const line = document.createElement('div');
      line.className = 'hex-line';
      line.innerHTML = `<span class="hex-addr">${hexAddr}</span>: <span class="hex-bytes">${code}</span>`;

      this.hexStream.appendChild(line);
      if (this.hexStream.children.length > 9) {
        this.hexStream.removeChild(this.hexStream.firstChild);
      }
    };

    // Pre-populate
    for (let i = 0; i < 6; i++) pushLine();

    if (this.hexInterval) clearInterval(this.hexInterval);
    this.hexInterval = setInterval(pushLine, 45); // Fast 45ms stream
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
        bar.style.height = `${heightPct}%`;
      });
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
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    if (this.hexInterval) clearInterval(this.hexInterval);
    if (this.clockInterval) clearInterval(this.clockInterval);

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

