/**
 * Global Fullscreen Presentation Controller
 * Mirrors audio triggers: when audio is unlocked or site launches,
 * fullscreen presentation mode is engaged on the same trigger.
 */
window.triggerPresentationFullscreen = function() {
  const doc = document;
  const docEl = doc.documentElement;
  const isFs = !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement);
  if (!isFs) {
    const req = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
    if (req) {
      try {
        const p = req.call(docEl);
        if (p && typeof p.then === 'function') {
          p.then(() => {
            if (window.syncFullscreenUI) window.syncFullscreenUI(true);
          }).catch(() => {
            // Browser restricted ungestured fullscreen; will grant on first user touch/click
          });
        } else {
          if (window.syncFullscreenUI) window.syncFullscreenUI(true);
        }
      } catch (e) {}
    }
  }
};

window.exitPresentationFullscreen = function() {
  const doc = document;
  const isFs = !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement);
  if (isFs) {
    const exit = doc.exitFullscreen || doc.webkitExitFullscreen || doc.mozCancelFullScreen || doc.msExitFullscreen;
    if (exit) {
      try {
        const p = exit.call(doc);
        if (p && typeof p.then === 'function') {
          p.then(() => {
            if (window.syncFullscreenUI) window.syncFullscreenUI(false);
          }).catch(() => {});
        } else {
          if (window.syncFullscreenUI) window.syncFullscreenUI(false);
        }
      } catch (e) {}
    }
  }
};

window.togglePresentationFullscreen = function() {
  const doc = document;
  const isFs = !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement);
  if (isFs) {
    window.exitPresentationFullscreen();
  } else {
    window.triggerPresentationFullscreen();
  }
};

window.syncFullscreenUI = function(active) {
  const isFs = active !== undefined ? active : !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
  const fsBtn = document.getElementById('toggle-fullscreen-btn');
  if (fsBtn) {
    fsBtn.innerHTML = isFs ? '<span>📺 EXIT FULLSCREEN</span>' : '<span>📺 PRESENTATION MODE</span>';
    fsBtn.classList.toggle('btn-active', isFs);
  }
  const bootFsBtn = document.getElementById('boot-fs-indicator');
  if (bootFsBtn) {
    bootFsBtn.textContent = isFs ? '📺 FULLSCREEN: ON' : '📺 FULLSCREEN MODE';
    bootFsBtn.classList.toggle('boot-fs-active', isFs);
  }
};

['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(evt => {
  document.addEventListener(evt, () => {
    if (window.syncFullscreenUI) window.syncFullscreenUI();
  });
});

/**
 * Cyber Synthesizer Audio Engine (Web Audio API & HTML5 Audio)
 * Provides automatic audio launch, synthetic hacker keystrokes, alarm sirens,
 * bass impact drops, glitch static, radar pings, and exploit chimes.
 */
class CyberAudio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.initialized = false;
    this.speechUnlocked = false;
    this._unlockHandler = null;

    // Connect to preloaded DOM audio element or create fallback
    this.startupAudio = document.getElementById('cyber-startup-audio');
    if (!this.startupAudio) {
      this.startupAudio = new Audio('assets/startup-speech.mp3');
      this.startupAudio.preload = 'auto';
    }
    this.startupAudio.playsInline = true;
    this.startupAudio.setAttribute('playsinline', '');
    this.startupAudio.setAttribute('webkit-playsinline', '');
    this.startupAudio.volume = 1.0;
    this.startupAudio.muted = false;

    this.startupAudio.onerror = () => {
      if (!this.startupAudio.src.includes('jaydrosi')) {
        this.startupAudio.src = 'assets/179010208433412148jaydrosi-voicemaker.in-speech.mp3';
        this.startupAudio.load();
      }
    };

    // Auto-initialize audio on load
    this.setupAutoPlay();
  }

  init() {
    if (this.initialized && this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initialized = true;
      }
    } catch (e) {
      console.warn("AudioContext initialization note:", e);
    }
  }

  resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * Automatically launches audio when site launches.
   * If browser autoplay restrictions block immediate unmuted playback,
   * a transparent listener unlocks it on ANY user touch/click/key/scroll
   * without requiring any manual prompt button in the UI.
   */
  setupAutoPlay() {
    const tryPlay = () => {
      if (!this.enabled || this.speechUnlocked) return;
      if (window.triggerPresentationFullscreen) window.triggerPresentationFullscreen();
      this.resume();
      if (!this.startupAudio) {
        this.startupAudio = document.getElementById('cyber-startup-audio') || new Audio('assets/startup-speech.mp3');
      }
      if (this.startupAudio) {
        this.startupAudio.muted = false;
        this.startupAudio.volume = 1.0;
        const playPromise = this.startupAudio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            this.speechUnlocked = true;
            this.playRepulsorBlast();
            this.updateStatusTag(true);
            this.removeUnlockListeners();
            const activator = document.getElementById('stark-activator');
            if (activator) activator.classList.add('activated');
          }).catch((err) => {
            // Autoplay blocked by browser policy without gesture;
            this.updateStatusTag(false);
            this.attachUnlockListeners();
          });
        }
      }
    };

    // Attempt immediately when script executes and across several lifecycle events
    tryPlay();
    setTimeout(tryPlay, 50);
    setTimeout(tryPlay, 150);
    requestAnimationFrame(tryPlay);
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(tryPlay, 80);
    } else {
      window.addEventListener('DOMContentLoaded', tryPlay, { once: true });
      window.addEventListener('load', tryPlay, { once: true });
    }
  }

  attachUnlockListeners() {
    if (this._unlockHandler) return;
    this._unlockHandler = () => {
      // Trigger Fullscreen Presentation Mode simultaneously with audio on user gesture
      if (window.triggerPresentationFullscreen) {
        window.triggerPresentationFullscreen();
      }
      this.resume();
      this.playRepulsorBlast();
      if (this.startupAudio) {
        this.startupAudio.muted = false;
        this.startupAudio.volume = 1.0;
        const p = this.startupAudio.play();
        if (p !== undefined) {
          p.then(() => {
            this.speechUnlocked = true;
            this.updateStatusTag(true);
            this.removeUnlockListeners();
            const activator = document.getElementById('stark-activator');
            if (activator) activator.classList.add('activated');
          }).catch(() => {});
        }
      }
    };

    const opts = { capture: true, passive: true };
    ['click', 'touchstart', 'touchend', 'pointerdown', 'pointerup', 'keydown', 'wheel', 'scroll'].forEach(evt => {
      window.addEventListener(evt, this._unlockHandler, opts);
      document.addEventListener(evt, this._unlockHandler, opts);
    });

    const overlay = document.getElementById('boot-overlay');
    if (overlay) {
      overlay.addEventListener('click', this._unlockHandler, opts);
      overlay.addEventListener('touchstart', this._unlockHandler, opts);
    }

    const activator = document.getElementById('stark-activator');
    if (activator) {
      activator.addEventListener('click', this._unlockHandler, opts);
      activator.addEventListener('touchstart', this._unlockHandler, opts);
    }
  }

  removeUnlockListeners() {
    if (this._unlockHandler) {
      const opts = { capture: true, passive: true };
      ['click', 'touchstart', 'touchend', 'pointerdown', 'pointerup', 'keydown', 'wheel', 'scroll'].forEach(evt => {
        window.removeEventListener(evt, this._unlockHandler, opts);
        document.removeEventListener(evt, this._unlockHandler, opts);
      });
      const overlay = document.getElementById('boot-overlay');
      if (overlay) {
        overlay.removeEventListener('click', this._unlockHandler, opts);
        overlay.removeEventListener('touchstart', this._unlockHandler, opts);
      }
      this._unlockHandler = null;
    }
  }

  updateStatusTag(active) {
    const tag = document.getElementById('boot-audio-status');
    if (tag) {
      if (active) {
        tag.textContent = '⚡ LUNA-AI // 48kHz STEREO ACTIVE';
        tag.classList.add('audio-active');
      } else {
        tag.textContent = '⚡ MARK-85 // NEURAL LINK STANDBY';
        tag.classList.remove('audio-active');
      }
    }
    const syncVal = document.getElementById('repulsor-sync-val');
    if (syncVal) {
      syncVal.textContent = active ? 'ONLINE 48kHz' : 'STANDBY';
      syncVal.style.color = active ? 'var(--neon-green)' : 'var(--neon-amber)';
    }
  }

  unlockAndPlay() {
    // Trigger Fullscreen Presentation Mode simultaneously with audio
    if (window.triggerPresentationFullscreen) {
      window.triggerPresentationFullscreen();
    }
    this.resume();
    this.playRepulsorBlast();
    const activator = document.getElementById('stark-activator');
    if (activator) activator.classList.add('activated');

    if (this.startupAudio) {
      this.startupAudio.muted = false;
      this.startupAudio.volume = 1.0;
      if (this.startupAudio.paused) {
        return this.startupAudio.play().then(() => {
          this.speechUnlocked = true;
          this.updateStatusTag(true);
          this.removeUnlockListeners();
          return true;
        }).catch(() => false);
      } else {
        this.speechUnlocked = true;
        this.updateStatusTag(true);
        this.removeUnlockListeners();
        return Promise.resolve(true);
      }
    }
    return Promise.resolve(true);
  }

  playStartupSpeech() {
    if (!this.enabled) return Promise.resolve(false);
    if (window.triggerPresentationFullscreen) {
      window.triggerPresentationFullscreen();
    }
    this.resume();
    if (!this.startupAudio) {
      this.startupAudio = document.getElementById('cyber-startup-audio') || new Audio('assets/startup-speech.mp3');
    }
    if (this.startupAudio) {
      this.startupAudio.currentTime = 0;
      this.startupAudio.muted = false;
      this.startupAudio.volume = 1.0;
      return this.startupAudio.play().then(() => {
        this.speechUnlocked = true;
        this.playRepulsorBlast();
        this.updateStatusTag(true);
        this.removeUnlockListeners();
        const activator = document.getElementById('stark-activator');
        if (activator) activator.classList.add('activated');
        return true;
      }).catch(err => {
        console.warn("Autoplay deferred awaiting gesture:", err);
        this.updateStatusTag(false);
        this.attachUnlockListeners();
        return false;
      });
    }
    return Promise.resolve(false);
  }

  // Authentic Iron Man / Tony Stark Repulsor Power-up & Plasma Pulse Sound
  playRepulsorBlast() {
    if (!this.enabled || !this.ctx) return;
    try {
      this.resume();
      const now = this.ctx.currentTime;

      // 1. Ascending repulsor charge sweep (80Hz -> 1400Hz)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.55);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(200, now);
      filter.frequency.exponentialRampToValueAtTime(2200, now + 0.55);
      filter.Q.setValueAtTime(5.0, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.6);

      // 2. Sub-bass reactor pulse
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(55, now);
      sub.frequency.exponentialRampToValueAtTime(32, now + 0.5);
      subGain.gain.setValueAtTime(0.25, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 0.5);

      // 3. High-tech harmonic discharge ping
      const ping = this.ctx.createOscillator();
      const pingGain = this.ctx.createGain();
      ping.type = 'sine';
      ping.frequency.setValueAtTime(1760, now + 0.42);
      ping.frequency.exponentialRampToValueAtTime(880, now + 0.68);
      pingGain.gain.setValueAtTime(0.001, now + 0.42);
      pingGain.gain.linearRampToValueAtTime(0.12, now + 0.45);
      pingGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

      ping.connect(pingGain);
      pingGain.connect(this.ctx.destination);
      ping.start(now + 0.42);
      ping.stop(now + 0.7);
    } catch (e) {}
  }

  stopStartupSpeech() {
    if (this.startupAudio) {
      this.startupAudio.pause();
      this.startupAudio.currentTime = 0;
    }
  }

  isSpeechActive() {
    return Boolean(this.startupAudio && !this.startupAudio.paused && !this.startupAudio.ended);
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.resume();
      if (this.startupAudio && this.startupAudio.paused && this.startupAudio.currentTime > 0 && this.startupAudio.currentTime < 18.2) {
        this.startupAudio.play().catch(() => {});
      }
      this.playSuccess();
    } else {
      if (this.startupAudio) {
        this.startupAudio.pause();
      }
    }
    return this.enabled;
  }

  // Realistic mechanical keystroke tick
  playKeyClick() {
    if (!this.enabled || !this.ctx) return;
    try {
      this.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400 + Math.random() * 800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.02);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch (e) {}
  }

  // Ultra-fast subtle click for rapid terminal streaming
  playFastTick() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(2200 + Math.random() * 1200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.008);

      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.009);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.01);
    } catch (e) {}
  }

  // Two-tone warning cyber siren
  playAlarm(duration = 1.4) {
    if (!this.enabled || !this.ctx) return;
    try {
      this.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(920, now);
      osc.frequency.linearRampToValueAtTime(460, now + duration * 0.4);
      osc.frequency.linearRampToValueAtTime(920, now + duration * 0.8);
      osc.frequency.linearRampToValueAtTime(460, now + duration);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.linearRampToValueAtTime(0.12, now + duration * 0.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {}
  }

  // Deep sub-bass impact drop for TAKEOVER event
  playBassDrop() {
    if (!this.enabled || !this.ctx) return;
    try {
      this.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.9);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.0);
    } catch (e) {}
  }

  // Glitch static noise burst
  playGlitch(duration = 0.12) {
    if (!this.enabled || !this.ctx) return;
    try {
      this.resume();
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.Q.setValueAtTime(3, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {}
  }

  // High-tech sci-fi ping / radar chime
  playPing(freq = 980) {
    if (!this.enabled || !this.ctx) return;
    try {
      this.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {}
  }

  // Successful auth / privilege escalation chord
  playSuccess() {
    if (!this.enabled || !this.ctx) return;
    try {
      this.resume();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.045, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.16);
      });
    } catch (e) {}
  }

  // Explosive cyber attack payload delivery sound
  playExploitSound() {
    if (!this.enabled || !this.ctx) return;
    try {
      this.playGlitch(0.18);
      setTimeout(() => this.playBassDrop(), 60);
    } catch (e) {}
  }
}

window.cyberAudio = new CyberAudio();
