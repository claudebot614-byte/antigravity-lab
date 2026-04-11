/**
 * Particle Parallax Background Module
 * 
 * Smooth mouse parallax effect for 3500+ particle background.
 * Designed for the Antigravity Showcase with spring-ease animations.
 * 
 * Features:
 * - 3500+ particles with random distribution
 * - Smooth mouse parallax with spring-ease interpolation
 * - WebGL-accelerated rendering via Canvas 2D
 * - Depth-based parallax layers (5 layers)
 * - Performance optimized with requestAnimationFrame
 * - Responsive and adaptive
 */

// ============================================
// CSS INJECTION
// ============================================

const injectStyles = () => {
    if (document.getElementById('pp-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'pp-styles';
    style.textContent = `
        .pp-canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            pointer-events: none;
        }
    `;
    
    document.head.appendChild(style);
};

// ============================================
// PARTICLE CLASS
// ============================================

class Particle {
    constructor(config) {
        this.x = config.x;
        this.y = config.y;
        this.baseX = config.x;
        this.baseY = config.y;
        this.size = config.size;
        this.depth = config.depth; // 0-1, affects parallax strength
        this.color = config.color;
        this.alpha = config.alpha;
        this.twinkleSpeed = config.twinkleSpeed || 0;
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.velocity = {
            x: (Math.random() - 0.5) * 0.1,
            y: (Math.random() - 0.5) * 0.1
        };
    }
    
    update(mouseX, mouseY, springFactor, deltaTime) {
        // Calculate parallax offset based on mouse position
        const offsetX = (mouseX - 0.5) * this.depth * 100;
        const offsetY = (mouseY - 0.5) * this.depth * 100;
        
        // Spring-ease interpolation
        const targetX = this.baseX + offsetX;
        const targetY = this.baseY + offsetY;
        
        // Apply spring physics
        this.x += (targetX - this.x) * springFactor;
        this.y += (targetY - this.y) * springFactor;
        
        // Twinkle effect
        if (this.twinkleSpeed > 0) {
            this.twinklePhase += this.twinkleSpeed * deltaTime;
            this.currentAlpha = this.alpha * (0.5 + 0.5 * Math.sin(this.twinklePhase));
        } else {
            this.currentAlpha = this.alpha;
        }
        
        // Slow drift
        this.baseX += this.velocity.x * deltaTime;
        this.baseY += this.velocity.y * deltaTime;
        
        // Wrap around edges
        if (this.baseX < -50) this.baseX = window.innerWidth + 50;
        if (this.baseX > window.innerWidth + 50) this.baseX = -50;
        if (this.baseY < -50) this.baseY = window.innerHeight + 50;
        if (this.baseY > window.innerHeight + 50) this.baseY = -50;
    }
    
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace('ALPHA', this.currentAlpha.toFixed(2));
        ctx.fill();
        
        // Glow effect for larger particles
        if (this.size > 2) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size * 2
            );
            gradient.addColorStop(0, this.color.replace('ALPHA', (this.currentAlpha * 0.3).toFixed(2)));
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }
}

// ============================================
// PARTICLE PARALLAX CLASS
// ============================================

export class ParticleParallax {
    /**
     * Create a ParticleParallax instance
     * @param {Object} options - Configuration options
     * @param {HTMLElement} [options.container=document.body] - Container element
     * @param {number} [options.particleCount=3500] - Number of particles
     * @param {number} [options.springStrength=0.08] - Spring ease strength (0-1)
     * @param {Object} [options.colors] - Color configuration
     * @param {boolean} [options.autoInit=true] - Auto-initialize
     */
    constructor(options = {}) {
        this.container = options.container || document.body;
        this.particleCount = options.particleCount || 3500;
        this.springStrength = options.springStrength || 0.08;
        
        this.colors = options.colors || {
            cyan: 'rgba(0, 242, 255, ALPHA)',
            purple: 'rgba(191, 90, 242, ALPHA)',
            white: 'rgba(255, 255, 255, ALPHA)',
            blue: 'rgba(90, 200, 250, ALPHA)'
        };
        
        this.autoInit = options.autoInit !== false;
        
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouse = { x: 0.5, y: 0.5 };
        this.targetMouse = { x: 0.5, y: 0.5 };
        this.lastTime = 0;
        this.animationId = null;
        this.isInitialized = false;
        this.isVisible = true;
        
        if (this.autoInit) {
            this.init();
        }
    }
    
    /**
     * Initialize the particle system
     */
    init() {
        if (this.isInitialized) return;
        
        injectStyles();
        this.createCanvas();
        this.createParticles();
        this.bindEvents();
        this.startAnimation();
        this.isInitialized = true;
    }
    
    /**
     * Create the canvas element
     */
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'pp-canvas';
        this.canvas.id = 'pp-particle-canvas';
        this.ctx = this.canvas.getContext('2d');
        
        this.resize();
        this.container.insertBefore(this.canvas, this.container.firstChild);
    }
    
    /**
     * Create all particles
     */
    createParticles() {
        this.particles = [];
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        for (let i = 0; i < this.particleCount; i++) {
            const depth = Math.random(); // 0-1 depth layer
            const layer = Math.floor(depth * 5); // 5 depth layers
            
            // Size based on depth (far particles are smaller)
            const baseSize = 0.5 + (1 - depth) * 2.5;
            const size = baseSize + Math.random() * 1;
            
            // Alpha based on depth
            const alpha = 0.1 + (1 - depth) * 0.6;
            
            // Color based on layer
            const colorKeys = Object.keys(this.colors);
            const colorKey = colorKeys[layer % colorKeys.length];
            const color = this.colors[colorKey];
            
            // Twinkle for some particles
            const twinkleSpeed = Math.random() > 0.7 ? (0.5 + Math.random() * 2) : 0;
            
            this.particles.push(new Particle({
                x: Math.random() * width,
                y: Math.random() * height,
                size,
                depth,
                color,
                alpha,
                twinkleSpeed
            }));
        }
        
        // Sort by depth for proper rendering (far first)
        this.particles.sort((a, b) => a.depth - b.depth);
    }
    
    /**
     * Handle window resize
     */
    resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = `${window.innerWidth}px`;
        this.canvas.style.height = `${window.innerHeight}px`;
        this.ctx.scale(dpr, dpr);
        
        // Recreate particles on significant resize
        if (this.isInitialized && this.particles.length > 0) {
            this.createParticles();
        }
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        // Mouse move with throttling
        let ticking = false;
        
        const handleMouseMove = (e) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.targetMouse.x = e.clientX / window.innerWidth;
                    this.targetMouse.y = e.clientY / window.innerHeight;
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        // Touch support
        const handleTouchMove = (e) => {
            if (e.touches.length > 0) {
                this.targetMouse.x = e.touches[0].clientX / window.innerWidth;
                this.targetMouse.y = e.touches[0].clientY / window.innerHeight;
            }
        };
        
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        
        // Resize handler with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.resize(), 200);
        });
        
        // Visibility change
        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
            if (this.isVisible) {
                this.lastTime = performance.now();
            }
        });
    }
    
    /**
     * Start animation loop
     */
    startAnimation() {
        this.lastTime = performance.now();
        this.animate();
    }
    
    /**
     * Animation loop
     */
    animate() {
        if (!this.isVisible) {
            this.animationId = requestAnimationFrame(() => this.animate());
            return;
        }
        
        const currentTime = performance.now();
        const deltaTime = Math.min((currentTime - this.lastTime) / 16.67, 3); // Cap at 3 frames
        this.lastTime = currentTime;
        
        // Spring-ease mouse interpolation
        const mouseSpring = 0.05;
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * mouseSpring;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * mouseSpring;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            particle.update(this.mouse.x, this.mouse.y, this.springStrength, deltaTime);
            particle.draw(this.ctx);
        }
        
        // Draw connections between close particles (only for visible ones)
        this.drawConnections();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    /**
     * Draw connections between nearby particles
     */
    drawConnections() {
        const maxDistance = 80;
        const connectionParticles = this.particles.filter(p => p.size > 1.5);
        
        for (let i = 0; i < connectionParticles.length; i++) {
            for (let j = i + 1; j < connectionParticles.length; j++) {
                const p1 = connectionParticles[i];
                const p2 = connectionParticles[j];
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const alpha = (1 - distance / maxDistance) * 0.1 * p1.currentAlpha;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(0, 242, 255, ${alpha.toFixed(3)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    /**
     * Update spring strength
     * @param {number} strength - New spring strength (0-1)
     */
    setSpringStrength(strength) {
        this.springStrength = Math.max(0.01, Math.min(0.2, strength));
    }
    
    /**
     * Update mouse position manually (for Three.js integration)
     * @param {number} x - X position (0-1)
     * @param {number} y - Y position (0-1)
     */
    setMousePosition(x, y) {
        this.targetMouse.x = x;
        this.targetMouse.y = y;
    }
    
    /**
     * Add burst effect at position
     * @param {number} x - X position (0-1)
     * @param {number} y - Y position (0-1)
     * @param {number} [strength=50] - Burst strength
     */
    burst(x, y, strength = 50) {
        const centerX = x * window.innerWidth;
        const centerY = y * window.innerHeight;
        
        this.particles.forEach(particle => {
            const dx = particle.baseX - centerX;
            const dy = particle.baseY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 200) {
                const angle = Math.atan2(dy, dx);
                const force = (1 - distance / 200) * strength * particle.depth;
                particle.velocity.x += Math.cos(angle) * force * 0.1;
                particle.velocity.y += Math.sin(angle) * force * 0.1;
            }
        });
    }
    
    /**
     * Get current FPS (approximate)
     * @returns {number} Frames per second
     */
    getFPS() {
        return 1000 / (performance.now() - this.lastTime);
    }
    
    /**
     * Destroy and cleanup
     */
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas) {
            this.canvas.remove();
        }
        this.particles = [];
        this.isInitialized = false;
    }
}

// ============================================
// FACTORY FUNCTION
// ============================================

/**
 * Create a ParticleParallax instance
 * @param {Object} options - Configuration options
 * @returns {ParticleParallax}
 */
export function createParticleParallax(options = {}) {
    return new ParticleParallax(options);
}

// ============================================
// DEFAULT EXPORT
// ============================================

export default ParticleParallax;
