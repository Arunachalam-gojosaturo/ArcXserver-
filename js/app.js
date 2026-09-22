/**
 * Main Application Orchestrator
 * Fullscreen presentation controller, clock, modal viewer, audio sync.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Live Clock & Session Uptime
  const clockEl = document.getElementById('live-clock');
  const sessionEl = document.getElementById('session-uptime');
  const startTime = Date.now();

  function updateTimers() {
    const now = new Date();
    if (clockEl) {
      const utc = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
      clockEl.textContent = utc;
    }

    if (sessionEl) {
      const elapsedSec = Math.floor((Date.now() - startTime) / 1000);
      const hrs = String(Math.floor(elapsedSec / 3600)).padStart(2, '0');
      const mins = String(Math.floor((elapsedSec % 3600) / 60)).padStart(2, '0');
      const secs = String(elapsedSec % 60).padStart(2, '0');
      sessionEl.textContent = `${hrs}:${mins}:${secs}`;
    }
  }
  setInterval(updateTimers, 1000);
  updateTimers();

  // Audio Toggle Button
  const audioBtn = document.getElementById('toggle-audio-btn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      if (window.cyberAudio) {
        const state = window.cyberAudio.toggle();
        audioBtn.innerHTML = state ? '<span>🔊 AUDIO: ON</span>' : '<span>🔇 AUDIO: OFF</span>';
        audioBtn.classList.toggle('btn-active', state);
      }
    });
  }

  // Matrix Rain Toggle Button
  const matrixBtn = document.getElementById('toggle-matrix-btn');
  if (matrixBtn) {
    matrixBtn.addEventListener('click', () => {
      if (window.matrixRain) {
        const state = window.matrixRain.toggle();
        matrixBtn.classList.toggle('btn-active', state);
        matrixBtn.innerHTML = state ? '<span>⚡ MATRIX: ON</span>' : '<span>⚡ MATRIX: OFF</span>';
        if (window.cyberAudio) window.cyberAudio.playPing();
      }
    });
  }

  // Fullscreen Presentation Mode Button
  const fsBtn = document.getElementById('toggle-fullscreen-btn');
  if (fsBtn) {
    fsBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
          fsBtn.innerHTML = '<span>📺 EXIT PRESENTATION</span>';
          fsBtn.classList.add('btn-active');
          if (window.cyberAudio) window.cyberAudio.playSuccess();
        }).catch(() => {});
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().then(() => {
            fsBtn.innerHTML = '<span>📺 PRESENTATION MODE</span>';
            fsBtn.classList.remove('btn-active');
          }).catch(() => {});
        }
      }
    });
  }

  // Replay Takeover Button
  const replayBtn = document.getElementById('replay-takeover-btn');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      if (window.replayTakeover) window.replayTakeover();
    });
  }

  // Lightbox Modal for Gallery Images
  const modal = document.getElementById('image-lightbox');
  const modalImg = document.getElementById('lightbox-img');
  const modalCaption = document.getElementById('lightbox-caption');
  const modalClose = document.getElementById('lightbox-close');

  document.querySelectorAll('.gallery-card img').forEach(img => {
    img.addEventListener('click', () => {
      if (modal && modalImg) {
        modalImg.src = img.src;
        if (modalCaption) {
          modalCaption.textContent = img.getAttribute('alt') || 'OPERATIONAL CYBER ASSET';
        }
        modal.classList.remove('hidden');
        if (window.cyberAudio) window.cyberAudio.playPing(750);
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      if (modal) modal.classList.add('hidden');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  }

  // Continuous Threat Telemetry Stream Ticker
  const streamTicker = document.getElementById('packet-stream-ticker');
  if (streamTicker) {
    const protocols = ['TCP/SYN', 'TLS_AES_256', 'ARC_TUNNEL', 'SSH_PAYLOAD', 'DNS_QUERY', 'RAW_SOCKET'];
    const nodes = ['192.168.1.1', '10.0.0.45', '172.16.4.22', 'node-c2.arcxos.net', 'target-host.local'];

    setInterval(() => {
      const proto = protocols[Math.floor(Math.random() * protocols.length)];
      const node = nodes[Math.floor(Math.random() * nodes.length)];
      const bytes = Math.floor(Math.random() * 8192) + 64;
      const status = Math.random() > 0.3 ? 'EXFILTRATED' : 'INTERCEPTED';

      const line = document.createElement('div');
      line.className = 'packet-line';
      line.innerHTML = `<span class="text-neon">[${proto}]</span> ${node} &rarr; <span class="text-accent">${bytes}B</span> [<span class="text-danger">${status}</span>]`;

      streamTicker.prepend(line);
      if (streamTicker.children.length > 8) {
        streamTicker.removeChild(streamTicker.lastChild);
      }
    }, 1400);
  }
});
