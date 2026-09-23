/**
 * Matrix Rain & Cyber Threat Network Canvas Engine
 * High-performance 60FPS background visual effects with
 * interactive node linkages, traveling data packets, and mobile-stable scaling.
 */
class MatrixRain {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF$#@*&!><[]{}%=+:';
    this.fontSize = 14;
    this.columns = 0;
    this.drops = [];
    this.active = true;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    const cols = Math.floor(newWidth / this.fontSize);
    if (this.columns !== cols || !this.drops || this.drops.length === 0) {
      this.canvas.width = newWidth;
      this.canvas.height = newHeight;
      this.columns = cols;
      this.drops = [];
      for (let i = 0; i < this.columns; i++) {
        this.drops[i] = Math.floor(Math.random() * -60);
      }
    } else {
      this.canvas.height = newHeight;
    }
  }

  animate() {
    if (!this.active || !this.ctx) return;

    // Semi-transparent fade background for trailing effect
    this.ctx.fillStyle = 'rgba(5, 8, 12, 0.085)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = `${this.fontSize}px "Share Tech Mono", monospace`;

    for (let i = 0; i < this.drops.length; i++) {
      const char = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;

      // Glowing head of stream
      if (Math.random() > 0.88) {
        this.ctx.fillStyle = '#ffffff';
      } else if (Math.random() > 0.5) {
        this.ctx.fillStyle = '#00ff9d';
      } else {
        this.ctx.fillStyle = '#00aa55';
      }

      this.ctx.fillText(char, x, y);

      if (y > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      this.drops[i]++;
    }

    requestAnimationFrame(() => this.animate());
  }

  pause() {
    this.active = false;
  }

  resume() {
    if (!this.active) {
      this.active = true;
      this.animate();
    }
  }

  toggle() {
    this.active = !this.active;
    if (this.active) {
      this.animate();
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    return this.active;
  }
}

/**
 * Cyber Network Threat Particle Map Canvas
 * Interactive topology with animated nodes, threat links, and traveling packet tracers.
 */
class CyberNetworkGrid {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.packets = [];
    this.maxNodes = 36;
    this.mouse = { x: -1000, y: -1000 };
    this.active = true;
    this.rafId = null;
    this.init();
  }

  pause() {
    this.active = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  resume() {
    if (!this.active) {
      this.active = true;
      this.animate();
    }
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Mouse / touch interaction
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    this.createNodes();
    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    this.canvas.width = parent ? parent.clientWidth : window.innerWidth;
    this.canvas.height = parent ? parent.clientHeight : 300;
  }

  createNodes() {
    this.nodes = [];
    for (let i = 0; i < this.maxNodes; i++) {
      this.nodes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2.2 + 1.6,
        compromised: Math.random() > 0.62,
        pulse: Math.random() * Math.PI
      });
    }

    // Initialize traveling data packets
    this.packets = [];
    for (let i = 0; i < 6; i++) {
      this.packets.push({
        from: Math.floor(Math.random() * this.maxNodes),
        to: Math.floor(Math.random() * this.maxNodes),
        progress: Math.random()
      });
    }
  }

  animate() {
    if (!this.active || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw links between close nodes
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const dx = this.nodes[i].x - this.nodes[j].x;
        const dy = this.nodes[i].y - this.nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 115) {
          const alpha = 1 - dist / 115;
          this.ctx.beginPath();
          this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
          this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
          this.ctx.strokeStyle = this.nodes[i].compromised || this.nodes[j].compromised
            ? `rgba(255, 0, 60, ${alpha * 0.45})`
            : `rgba(0, 255, 157, ${alpha * 0.3})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }

    // Draw traveling data packets along links
    this.packets.forEach(p => {
      p.progress += 0.015;
      if (p.progress >= 1) {
        p.from = Math.floor(Math.random() * this.nodes.length);
        p.to = Math.floor(Math.random() * this.nodes.length);
        p.progress = 0;
      }

      const n1 = this.nodes[p.from];
      const n2 = this.nodes[p.to];
      if (n1 && n2) {
        const px = n1.x + (n2.x - n1.x) * p.progress;
        const py = n1.y + (n2.y - n1.y) * p.progress;

        this.ctx.beginPath();
        this.ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        this.ctx.fillStyle = n1.compromised || n2.compromised ? '#ff003c' : '#00f0ff';
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = '#00f0ff';
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      }
    });

    // Draw and update nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      node.x += node.vx;
      node.y += node.vy;
      node.pulse += 0.05;

      // Mouse attraction / bounce
      const mdx = node.x - this.mouse.x;
      const mdy = node.y - this.mouse.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 70) {
        node.x += (mdx / mdist) * 1.5;
        node.y += (mdy / mdist) * 1.5;
      }

      if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;

      const currentRadius = node.radius + Math.sin(node.pulse) * 0.8;

      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, Math.max(1, currentRadius), 0, Math.PI * 2);
      this.ctx.fillStyle = node.compromised ? '#ff003c' : '#00ff9d';
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = node.compromised ? '#ff003c' : '#00ff9d';
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    this.rafId = requestAnimationFrame(() => this.animate());
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.matrixRain = new MatrixRain('matrix-canvas');
  window.cyberGrid = new CyberNetworkGrid('threat-map-canvas');
});
