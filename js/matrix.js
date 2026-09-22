/**
 * Matrix Rain & Cyber Grid Canvas Engine
 * High-performance 60FPS background visual effects.
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
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.drops = [];
    for (let i = 0; i < this.columns; i++) {
      this.drops[i] = Math.floor(Math.random() * -100);
    }
  }

  animate() {
    if (!this.active || !this.ctx) return;

    // Semi-transparent fade background for trailing effect
    this.ctx.fillStyle = 'rgba(5, 8, 12, 0.08)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = `${this.fontSize}px "Fira Code", monospace`;

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
 */
class CyberNetworkGrid {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.maxNodes = 35;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.createNodes();
    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    this.canvas.width = parent ? parent.clientWidth : window.innerWidth;
    this.canvas.height = parent ? parent.clientHeight : 320;
  }

  createNodes() {
    this.nodes = [];
    for (let i = 0; i < this.maxNodes; i++) {
      this.nodes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2.5 + 1.5,
        compromised: Math.random() > 0.65,
        pulse: Math.random() * Math.PI
      });
    }
  }

  animate() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw links between close nodes
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const dx = this.nodes[i].x - this.nodes[j].x;
        const dy = this.nodes[i].y - this.nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const alpha = 1 - dist / 110;
          this.ctx.beginPath();
          this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
          this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
          this.ctx.strokeStyle = this.nodes[i].compromised || this.nodes[j].compromised
            ? `rgba(255, 0, 60, ${alpha * 0.4})`
            : `rgba(0, 255, 157, ${alpha * 0.25})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }

    // Draw and update nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      node.x += node.vx;
      node.y += node.vy;
      node.pulse += 0.05;

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

    requestAnimationFrame(() => this.animate());
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.matrixRain = new MatrixRain('matrix-canvas');
  window.cyberGrid = new CyberNetworkGrid('threat-map-canvas');
});
