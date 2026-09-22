/**
 * Hacker Booting & Device Takeover Sequence Engine
 * Cinematic 12-15 second takeover sequence with dynamic hardware telemetry.
 * Strictly adheres to non-simulation realistic threat presentation.
 */
class BootSequence {
  constructor() {
    this.bootOverlay = document.getElementById('boot-overlay');
    this.bootLogs = document.getElementById('boot-logs');
    this.progressBar = document.getElementById('boot-progress-bar');
    this.progressPercent = document.getElementById('boot-progress-percent');
    this.takeoverBanner = document.getElementById('takeover-banner');
    this.skipBtn = document.getElementById('skip-boot-btn');
    this.mainDashboard = document.getElementById('main-dashboard');
    this.targetTelemetryEl = document.getElementById('boot-telemetry-badge');

    this.timer = null;
    this.active = false;
    this.startTime = 0;
    this.totalDuration = 14000; // 14 seconds sweet spot
  }

  init() {
    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.finishTakeover();
      });
    }

    // Unmute / interact trigger on click
    if (this.bootOverlay) {
      this.bootOverlay.addEventListener('click', () => {
        if (window.cyberAudio) window.cyberAudio.resume();
      });
    }

    this.start();
  }

  start() {
    this.active = true;
    this.startTime = Date.now();
    if (this.bootLogs) this.bootLogs.innerHTML = '';
    if (this.takeoverBanner) this.takeoverBanner.classList.add('hidden');
    if (this.bootOverlay) {
      this.bootOverlay.style.display = 'flex';
      this.bootOverlay.classList.remove('fade-out');
      this.bootOverlay.classList.remove('takeover-alert-active');
    }
    if (this.mainDashboard) {
      this.mainDashboard.classList.add('dashboard-blur');
    }

    const t = window.telemetry ? window.telemetry.data : {
      os: 'LINUX X86_64',
      cores: 8,
      gpu: 'HARDWARE ACCELERATOR',
      resolution: '1920x1080',
      ip: '192.168.1.104'
    };

    const logStages = [
      { delay: 100, text: '[    0.000000] ArcXOS UEFI SecureBoot: Hooking interrupt vector 0x80...', type: 'sys' },
      { delay: 400, text: '[    0.012891] Linux version 6.10.9-arch1-arcxos (gcc 14.2.1) x86_64 SMP PREEMPT', type: 'sys' },
      { delay: 900, text: `[    0.084120] TARGET HARDWARE LOCATED: ${t.os} | CORES: ${t.cores} | DISPLAY: ${t.resolution}`, type: 'accent' },
      { delay: 1500, text: `[    0.194812] GPU ENGINE ACCELERATION: ${t.gpu}`, type: 'sys' },
      { delay: 2100, text: `[    0.312044] INTERCEPTING HOST GATEWAY: ${t.ip}`, type: 'warn' },
      { delay: 2800, text: '[    0.540192] Probing local memory mapped registers for zero-day vector...', type: 'sys' },
      { delay: 3500, text: '[    0.820199] [!] EXPLOIT STAGED: CVE-ARCXOS-2026-ROOTKIT (Buffer Alignment Bypass)', type: 'accent' },
      { delay: 4300, text: '[    1.210492] Overwriting kernel memory space at 0x7FFF004B2A...', type: 'sys' },
      { delay: 5200, text: '[    1.890120] Nullifying security modules: AppArmor, SELinux, PAM auth... [COMPROMISED]', type: 'warn' },
      { delay: 6100, text: '[    2.410948] ESCALATING PRIVILEGES: UID=1000 -> UID=0 (ROOT SHELL GRANTED)', type: 'danger' },
      { delay: 7000, text: '[    3.102914] Deploying Arunachalam ArcXOS Payload & Luna-AI Neural Daemon...', type: 'accent' },
      { delay: 8000, text: '[    3.892019] Establishing high-speed encrypted C2 tunnel [PORT 4444]... LOCKED', type: 'danger' },
      { delay: 9000, text: '[    4.401921] HARDWARE CONTROL OVERRIDE: 100% EXECUTED', type: 'danger' }
    ];

    // Play initial glitch sound
    if (window.cyberAudio) window.cyberAudio.playGlitch(0.2);

    logStages.forEach(stage => {
      setTimeout(() => {
        if (!this.active) return;
        this.appendLog(stage.text, stage.type);
        if (window.cyberAudio) window.cyberAudio.playKeyClick();
      }, stage.delay);
    });

    // Progress bar runner
    const updateProgress = () => {
      if (!this.active) return;
      const elapsed = Date.now() - this.startTime;
      const pct = Math.min(100, Math.floor((elapsed / this.totalDuration) * 100));

      if (this.progressBar) this.progressBar.style.width = `${pct}%`;
      if (this.progressPercent) this.progressPercent.textContent = `${pct}%`;

      // Trigger takeover alert at 65% (~9.2s)
      if (pct >= 65 && this.takeoverBanner && this.takeoverBanner.classList.contains('hidden')) {
        this.triggerTakeoverAlert();
      }

      if (elapsed < this.totalDuration) {
        requestAnimationFrame(updateProgress);
      } else {
        this.finishTakeover();
      }
    };

    requestAnimationFrame(updateProgress);
  }

  appendLog(text, type) {
    if (!this.bootLogs) return;
    const div = document.createElement('div');
    div.className = `boot-line boot-${type || 'sys'}`;
    div.textContent = text;
    this.bootLogs.appendChild(div);
    this.bootLogs.scrollTop = this.bootLogs.scrollHeight;
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
      window.cyberAudio.playAlarm(2.0);
      window.cyberAudio.playBassDrop();
    }
  }

  finishTakeover() {
    this.active = false;
    if (this.progressBar) this.progressBar.style.width = '100%';
    if (this.progressPercent) this.progressPercent.textContent = '100%';

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
  const bootSeq = new BootSequence();
  bootSeq.init();
};

window.addEventListener('DOMContentLoaded', () => {
  window.bootSequence = new BootSequence();
  window.bootSequence.init();
});
