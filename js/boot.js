/**
 * Hacker Booting & Device Takeover Sequence Engine
 * Cinematic 21-Second Takeover Sequence with Luna-AI Neural Speech Audio,
 * Real-time Hardware Telemetry, Memory Disassembly Stream, and Frequency Spectrum.
 * Strictly adheres to realistic cyber threat presentation.
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
    this.audioPrompt = document.getElementById('boot-audio-prompt');
    this.unmuteBtn = document.getElementById('unmute-voice-btn');
    this.spectrumContainer = document.getElementById('spectrum-visualizer');
    this.speechTimer = document.getElementById('speech-timer');
    this.speechStatus = document.getElementById('boot-speech-status');
    this.hexStream = document.getElementById('boot-hex-stream');
    this.bootClock = document.getElementById('boot-clock');

    this.active = false;
    this.startTime = 0;
    this.totalDuration = 21000; // 21 seconds (> 19 sec requirement)
    this.climaxTime = 16000;    // Climax alert synchronized with speech (16.0s)
    this.climaxTriggered = false;

    this.spectrumBars = [];
    this.hexInterval = null;
    this.clockInterval = null;
    this.animFrameId = null;
  }

  init() {
    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.finishTakeover();
      });
    }

    // Audio prompt unmute button
    if (this.unmuteBtn) {
      this.unmuteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.unlockAudio();
      });
    }

    // Click/tap anywhere on boot overlay to unmute if blocked
    if (this.bootOverlay) {
      this.bootOverlay.addEventListener('click', () => {
        this.unlockAudio();
      });
    }

    // Window gesture listeners to unlock audio seamlessly
    const handleFirstGesture = () => {
      this.unlockAudio();
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
    window.addEventListener('click', handleFirstGesture);
    window.addEventListener('touchstart', handleFirstGesture);
    window.addEventListener('keydown', handleFirstGesture);

    this.setupVisualizer();
    this.start();
  }

  unlockAudio() {
    if (window.cyberAudio) {
      window.cyberAudio.resume();
      window.cyberAudio.playStartupSpeech().then(() => {
        if (this.audioPrompt) this.audioPrompt.classList.add('hidden');
        if (this.speechStatus) this.speechStatus.textContent = 'TRANSMITTING';
      }).catch(() => {});
    }
    if (this.audioPrompt) {
      this.audioPrompt.classList.add('hidden');
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
      bar.style.height = '15%';
      this.spectrumContainer.appendChild(bar);
      this.spectrumBars.push(bar);
    }
  }

  start() {
    this.active = true;
    this.startTime = Date.now();
    this.climaxTriggered = false;

    if (this.bootLogs) this.bootLogs.innerHTML = '';
    if (this.takeoverBanner) this.takeoverBanner.classList.add('hidden');
    if (this.bootOverlay) {
      this.bootOverlay.style.display = 'flex';
      this.bootOverlay.classList.remove('fade-out');
      this.bootOverlay.classList.remove('takeover-alert-active');
    }
    if (this.mainDashboard) {
      this.mainDashboard.classList.add('dashboard-blur');
      this.mainDashboard.classList.remove('dashboard-active');
    }

    // Update telemetry markers in overlay
    if (window.telemetry) {
      window.telemetry.updateDOM();
    }

    // Live clock in boot header
    this.updateClock();
    if (this.clockInterval) clearInterval(this.clockInterval);
    this.clockInterval = setInterval(() => this.updateClock(), 1000);

    // Live streaming Hex Disassembly
    this.startHexStream();

    // Play startup speech audio with autoplay catch
    if (window.cyberAudio) {
      window.cyberAudio.playStartupSpeech().then(started => {
        if (!started && this.audioPrompt) {
          this.audioPrompt.classList.remove('hidden');
        }
      });
      window.cyberAudio.playGlitch(0.2);
    }

    // Append Cyber ASCII Logo Banner
    this.appendAsciiBanner();

    const t = window.telemetry ? window.telemetry.data : {
      os: 'LINUX X86_64',
      cores: 8,
      gpu: 'ACCELERATED HARDWARE RENDERER',
      resolution: '1920x1080',
      viewport: '1920x1080',
      battery: '100%',
      ip: '192.168.1.104'
    };

    // Authentic Linux Kernel & Offensive Exploit Stages (total 21.0s)
    const logStages = [
      { delay: 100,  text: '[    0.000000] ArcXOS UEFI SecureBoot: Hooking interrupt vector 0x80...', type: 'sys' },
      { delay: 400,  text: '[    0.012891] Linux version 6.10.9-arch1-arcxos (gcc 14.2.1) x86_64 SMP PREEMPT_DYNAMIC', type: 'sys' },
      { delay: 800,  text: '[    0.045120] ACPI: Core revision 20240322, DSDT 0x000000007BAFD000 table verified', type: 'sys' },
      { delay: 1200, text: `[    0.084120] TARGET HARDWARE LOCATED: ${t.os} | CORES: ${t.cores} | VIEWPORT: ${t.resolution}`, type: 'accent' },
      { delay: 1800, text: `[    0.194812] GPU ENGINE ACCELERATION: ${t.gpu}`, type: 'sys' },
      { delay: 2400, text: `[    0.312044] INTERCEPTING HOST GATEWAY: ${t.ip}`, type: 'warn' },
      { delay: 3100, text: '[    0.540192] Probing virtual memory mapped registers for zero-day vector...', type: 'sys' },
      { delay: 3900, text: '[    0.820199] [!] EXPLOIT STAGED: CVE-ARCXOS-2026-ROOTKIT (Heap Buffer Alignment)', type: 'accent' },
      { delay: 4800, text: '[    1.120492] Spraying ROP chain gadgets across memory space at 0x7FFF004B2A...', type: 'sys' },
      { delay: 5600, text: '[    1.489201] [VOICE 01] >> NEURAL SPEECH FEED: "Attention: This device has been accessed by Arc & Luna AI"', type: 'accent' },
      { delay: 6800, text: '[    1.890120] Disarming kernel security modules: AppArmor, SELinux, PAM auth... [BYPASS]', type: 'warn' },
      { delay: 7900, text: '[    2.410948] [VOICE 02] >> "Don\'t panic, this is a controlled ethical hacking & cybersecurity test"', type: 'sys' },
      { delay: 9000, text: '[    2.890120] [ETHICAL DIRECTIVE] Non-destructive penetration handshake confirmed. Zero data altered.', type: 'accent' },
      { delay: 10200, text: '[    3.240192] Telemetry extraction complete: Ring-0 execution primitive staged.', type: 'sys' },
      { delay: 11400, text: '[    3.789201] Deploying Arunachalam ArcXOS Kernel Payload & Luna-AI Neural Daemon...', type: 'accent' },
      { delay: 12500, text: '[    4.102914] Establishing high-speed encrypted C2 tunnel [PORT 4444]... LOCKED', type: 'warn' },
      { delay: 13600, text: '[    4.650120] Overwriting process credentials: UID=1000 -> UID=0 (ROOT SHELL GRANTED)', type: 'danger' },
      { delay: 14700, text: '[    5.120931] Loading BlackArch offensive toolset & Hyprland compositor modules...', type: 'sys' },
      { delay: 15800, text: '[    5.892019] [VOICE 03] >> "Operator Arunachalam, MCA student... Search Arunachalam Arch Linux to learn more"', type: 'danger' },
      { delay: 16000, text: '[    6.000000] [CRITICAL] ⚠️ TAKEOVER CLIMAX: HOST SUBSYSTEM CONTROL OVERRIDE 100% EXECUTED', type: 'danger' },
      { delay: 17300, text: '[    6.892019] Master cryptographic key injected into local keyring. Session authenticated.', type: 'accent' },
      { delay: 18221, text: '[    7.420192] Neural voice stream finalized (18.22s transmission complete).', type: 'sys' },
      { delay: 19200, text: '[    8.102914] Stabilizing C2 socket connection and terminal pipe channels...', type: 'accent' },
      { delay: 20100, text: '[    9.012891] Spawning interactive breach shell: arunachalam@arcxos:~#', type: 'sys' },
      { delay: 20800, text: '[   10.000000] Boot sequence finalized. Relinquishing display to presentation dashboard...', type: 'accent' }
    ];

    logStages.forEach(stage => {
      setTimeout(() => {
        if (!this.active) return;
        this.appendLog(stage.text, stage.type);
        if (window.cyberAudio && stage.delay % 800 < 300) {
          window.cyberAudio.playKeyClick();
        }
      }, stage.delay);
    });

    // Main animation loop for progress bar and visualizers
    const updateLoop = () => {
      if (!this.active) return;
      const elapsed = Date.now() - this.startTime;
      const pct = Math.min(100, Math.floor((elapsed / this.totalDuration) * 100));

      if (this.progressBar) this.progressBar.style.width = `${pct}%`;
      if (this.progressPercent) this.progressPercent.textContent = `${pct}%`;

      // Update Phase Status Label
      this.updateStatusLabel(pct);

      // Update Audio Spectrum Visualizer
      this.updateVisualizer();

      // Trigger takeover climax alert at 16.0s (~76%)
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

  appendLog(text, type) {
    if (!this.bootLogs) return;
    const div = document.createElement('div');
    div.className = `boot-line boot-${type || 'sys'}`;
    div.textContent = text;
    this.bootLogs.appendChild(div);
    this.bootLogs.scrollTop = this.bootLogs.scrollHeight;
  }

  updateStatusLabel(pct) {
    if (!this.statusLabel) return;
    if (pct < 15) {
      this.statusLabel.textContent = '[1/7] HOOKING UEFI INTERRUPTS & INITIALIZING RING-0 VECTORS...';
    } else if (pct < 30) {
      this.statusLabel.textContent = '[2/7] EXTRACTING TARGET TELEMETRY & HARDWARE SIGNATURES...';
    } else if (pct < 50) {
      this.statusLabel.textContent = '[3/7] STREAMING LUNA-AI NEURAL SPEECH & ETHICAL DIRECTIVE...';
    } else if (pct < 70) {
      this.statusLabel.textContent = '[4/7] STAGING ROP EXPLOIT CHAIN & MEMORY OVERWRITE...';
    } else if (pct < 85) {
      this.statusLabel.textContent = '[5/7] ⚠️ ELEVATING ROOT PRIVILEGES: UID=1000 -> UID=0 [ROOT]...';
    } else if (pct < 95) {
      this.statusLabel.textContent = '[6/7] TAKEOVER CONFIRMED // OPERATOR: ARUNACHALAM M...';
    } else {
      this.statusLabel.textContent = '[7/7] LAUNCHING ARCXOS INTERACTIVE COMMAND & CONTROL CONSOLE...';
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
    this.hexInterval = setInterval(pushLine, 140);
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

    if (this.spectrumBars && this.spectrumBars.length > 0) {
      this.spectrumBars.forEach((bar, idx) => {
        let heightPct = 12;
        if (isPlaying) {
          // Dynamic frequency oscillation
          const wave = Math.sin((Date.now() / 120) + idx * 0.45);
          const noise = Math.random() * 35;
          heightPct = Math.max(15, Math.min(100, Math.floor(45 + wave * 30 + noise)));
        } else if (this.active && curTime < 18) {
          // Subtle ambient idle oscillation
          const wave = Math.sin((Date.now() / 300) + idx * 0.3);
          heightPct = Math.max(10, Math.floor(18 + wave * 8));
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
      setTimeout(() => document.body.classList.remove('screen-alarm-shake'), 1400);
    }

    if (window.cyberAudio) {
      window.cyberAudio.playAlarm(2.2);
      window.cyberAudio.playBassDrop();
    }
  }

  finishTakeover() {
    this.active = false;
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    if (this.hexInterval) clearInterval(this.hexInterval);
    if (this.clockInterval) clearInterval(this.clockInterval);

    if (this.progressBar) this.progressBar.style.width = '100%';
    if (this.progressPercent) this.progressPercent.textContent = '100%';
    if (this.statusLabel) this.statusLabel.textContent = 'SYSTEM BREACH COMPLETE // ACCESS GRANTED (UID=0)';

    // Stop speech if user skipped early
    if (window.cyberAudio) {
      window.cyberAudio.stopStartupSpeech();
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
      }, 700);
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
  }, 150);
};

window.addEventListener('DOMContentLoaded', () => {
  window.bootSequence = new BootSequence();
  window.bootSequence.init();
});
