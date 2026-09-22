/**
 * Target Telemetry & Hardware Fingerprinting Engine
 * Extracts real hardware, display, GPU, browser, and network markers.
 */
class TelemetryEngine {
  constructor() {
    this.data = {
      os: 'ARCH LINUX [X86_64]',
      browser: 'CYBER-TERMINAL',
      cores: 8,
      memory: '16.0 GB',
      gpu: 'GENERIC GRAPHICS ADAPTER',
      resolution: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      touch: 'NO',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      language: navigator.language || 'en-US',
      network: 'ETHERNET / FIBER [GIGABIT]',
      battery: '100% [EXTERNAL_POWER]',
      ip: '192.168.1.104 (LOCAL_GATEWAY)',
      targetId: 'ARC-TARGET-' + Math.floor(100000 + Math.random() * 900000),
      sessionHash: '0x' + Array.from({length: 16}, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase()
    };
    this.gather();
  }

  gather() {
    // Detect OS & Platform
    const ua = navigator.userAgent;
    if (/Android/i.test(ua)) this.data.os = 'ANDROID KERNEL [ARM64]';
    else if (/iPhone|iPad|iPod/i.test(ua)) this.data.os = 'APPLE DARWIN [IOS/ARM64]';
    else if (/Macintosh|Mac OS X/i.test(ua)) this.data.os = 'DARWIN MACOS [POSIX]';
    else if (/Windows/i.test(ua)) this.data.os = 'WINDOWS NT 10.0 [X86_64]';
    else if (/Linux/i.test(ua)) this.data.os = 'LINUX KERNEL [X86_64]';

    // Detect Browser
    if (/Chrome|CriOS/i.test(ua) && !/Edg/i.test(ua)) this.data.browser = 'CHROME CORE ENGINE';
    else if (/Edg/i.test(ua)) this.data.browser = 'MICROSOFT EDGE';
    else if (/Firefox/i.test(ua)) this.data.browser = 'MOZILLA FIREFOX GECKO';
    else if (/Safari/i.test(ua)) this.data.browser = 'APPLE WEBKIT SAFARI';

    // CPU Cores
    if (navigator.hardwareConcurrency) {
      this.data.cores = navigator.hardwareConcurrency;
    }

    // Memory
    if (navigator.deviceMemory) {
      this.data.memory = `${navigator.deviceMemory} GB RAM`;
    }

    // Touch
    this.data.touch = (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ? 'YES (MULTITOUCH)' : 'DISABLED';

    // GPU Renderer via WebGL
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          if (renderer) {
            this.data.gpu = renderer.replace(/ANGLE \(|\)|vs_[\d_]+|ps_[\d_]+/g, '').trim();
          }
        }
      }
    } catch (e) {
      this.data.gpu = 'ACCELERATED HARDWARE RENDERER';
    }

    // Connection
    if (navigator.connection) {
      const conn = navigator.connection;
      const type = conn.effectiveType ? conn.effectiveType.toUpperCase() : 'LAN';
      const speed = conn.downlink ? ` ~${conn.downlink} Mbps` : '';
      this.data.network = `${type}${speed} (RTT: ${conn.rtt || 20}ms)`;
    }

    // Battery API
    if (navigator.getBattery) {
      navigator.getBattery().then(bat => {
        const lvl = Math.round(bat.level * 100);
        const chg = bat.charging ? 'CHARGING' : 'BATTERY';
        this.data.battery = `${lvl}% [${chg}]`;
        this.updateDOM();
      }).catch(() => {});
    }

    // Generate pseudo target IP if real IP is masked
    const octet3 = Math.floor(Math.random() * 200) + 1;
    const octet4 = Math.floor(Math.random() * 250) + 2;
    this.data.ip = `192.168.${octet3}.${octet4} (INTERCEPTED)`;
  }

  updateDOM() {
    this.data.resolution = `${window.screen.width}x${window.screen.height}`;
    this.data.viewport = `${window.innerWidth}x${window.innerHeight}`;

    document.querySelectorAll('[data-telemetry]').forEach(el => {
      const key = el.getAttribute('data-telemetry');
      if (this.data[key] !== undefined) {
        el.textContent = this.data[key];
      }
    });
  }
}

window.telemetry = new TelemetryEngine();
window.addEventListener('resize', () => window.telemetry.updateDOM());
