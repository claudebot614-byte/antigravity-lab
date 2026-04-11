/**
 * TechSpecCard - Technical Specification Card Component
 * Antigravity Portfolio - Elite Brutalist Design System
 * 
 * Features:
 * - Blurred-glass vertical side-panel with high transparency
 * - NothingDot font for skill titles
 * - Red/Cyan gradient mastery bar
 * - Detailed specs grid
 * - 'Initialize Project' button with glitch effect
 * - Spring slide-in animation from right
 * - Responsive design
 */

export class TechSpecCard {
    constructor(container = document.body) {
        this.container = container;
        this.isVisible = false;
        this.currentSkill = null;
        this.panel = null;
        this.stylesInjected = false;
        
        this.init();
    }

    init() {
        this.injectStyles();
        this.createPanel();
        this.bindEvents();
    }

    injectStyles() {
        if (this.stylesInjected || document.getElementById('tech-spec-card-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'tech-spec-card-styles';
        styles.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100;400;700&display=swap');
            
            @font-face {
                font-family: 'NothingDot';
                src: url('https://raw.githubusercontent.com/manvisingla/Nothing-Dot-55/main/NothingDot.ttf');
            }

            :root {
                --tsc-bg: #020202;
                --tsc-cyan: #00f2ff;
                --tsc-red: #ff0000;
                --tsc-glass: rgba(10, 10, 10, 0.85);
                --tsc-glass-border: rgba(255, 255, 255, 0.08);
                --tsc-white: #ffffff;
                --tsc-dim: rgba(255, 255, 255, 0.4);
            }

            /* Panel Container */
            .tsc-panel {
                position: fixed;
                top: 0;
                right: 0;
                width: 420px;
                height: 100vh;
                background: var(--tsc-glass);
                border-left: 1px solid var(--tsc-glass-border);
                backdrop-filter: blur(40px) saturate(180%);
                -webkit-backdrop-filter: blur(40px) saturate(180%);
                z-index: 9999;
                transform: translateX(100%);
                padding: 3rem 2rem;
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                /* Brutalist clip-path - angular edges */
                clip-path: polygon(8% 0, 100% 0, 100% 100%, 0 100%);
                transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
                pointer-events: auto;
                overflow-y: auto;
                scrollbar-width: thin;
                scrollbar-color: var(--tsc-cyan) transparent;
            }

            .tsc-panel.visible {
                transform: translateX(0);
            }

            .tsc-panel::-webkit-scrollbar {
                width: 4px;
            }

            .tsc-panel::-webkit-scrollbar-thumb {
                background: var(--tsc-cyan);
                border-radius: 2px;
            }

            /* Header Section */
            .tsc-header-label {
                font-size: 0.55rem;
                color: var(--tsc-cyan);
                letter-spacing: 0.2em;
                text-transform: uppercase;
                opacity: 0.7;
            }

            .tsc-skill-title {
                font-family: 'NothingDot', 'JetBrains Mono', monospace;
                font-size: 2.5rem;
                color: var(--tsc-red);
                line-height: 1.1;
                margin-top: 0.5rem;
                word-break: break-word;
            }

            /* Mastery Bar */
            .tsc-mastery-container {
                margin: 1.5rem 0;
            }

            .tsc-mastery-label {
                display: flex;
                justify-content: space-between;
                font-size: 0.65rem;
                color: var(--tsc-dim);
                margin-bottom: 0.5rem;
                text-transform: uppercase;
                letter-spacing: 0.1em;
            }

            .tsc-mastery-track {
                width: 100%;
                height: 3px;
                background: var(--tsc-glass-border);
                position: relative;
                overflow: hidden;
            }

            .tsc-mastery-fill {
                position: absolute;
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, var(--tsc-cyan), var(--tsc-red));
                transition: width 1.2s cubic-bezier(0.23, 1, 0.32, 1);
                box-shadow: 0 0 20px var(--tsc-cyan), 0 0 40px var(--tsc-red);
            }

            .tsc-mastery-glow {
                position: absolute;
                right: 0;
                top: -4px;
                width: 12px;
                height: 12px;
                background: var(--tsc-red);
                border-radius: 50%;
                filter: blur(4px);
                opacity: 0;
                transition: opacity 0.5s 0.8s;
            }

            .tsc-panel.visible .tsc-mastery-glow {
                opacity: 1;
            }

            /* Description */
            .tsc-description {
                font-size: 0.75rem;
                line-height: 1.7;
                color: var(--tsc-dim);
                margin-bottom: 1rem;
            }

            /* Detail Grid */
            .tsc-detail-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 0.75rem;
                margin-top: 1rem;
            }

            .tsc-detail-item {
                border: 1px solid var(--tsc-glass-border);
                padding: 0.8rem 1rem;
                background: rgba(0, 242, 255, 0.03);
                font-size: 0.6rem;
                color: var(--tsc-cyan);
                transition: all 0.3s ease;
                clip-path: polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%);
            }

            .tsc-detail-item:hover {
                background: rgba(0, 242, 255, 0.1);
                border-color: var(--tsc-cyan);
                transform: translateX(-4px);
            }

            .tsc-detail-label {
                opacity: 0.5;
                margin-bottom: 0.25rem;
            }

            .tsc-detail-value {
                font-weight: 700;
                text-transform: uppercase;
            }

            /* Sub-skills Section */
            .tsc-subskills {
                margin-top: 1.5rem;
            }

            .tsc-subskills-title {
                font-size: 0.6rem;
                color: var(--tsc-dim);
                text-transform: uppercase;
                letter-spacing: 0.15em;
                margin-bottom: 0.75rem;
            }

            .tsc-subskills-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
            }

            .tsc-subskill-tag {
                font-size: 0.55rem;
                padding: 0.4rem 0.8rem;
                border: 1px solid var(--tsc-glass-border);
                color: var(--tsc-white);
                opacity: 0.6;
                transition: all 0.3s ease;
            }

            .tsc-subskill-tag:hover {
                opacity: 1;
                border-color: var(--tsc-cyan);
                color: var(--tsc-cyan);
            }

            /* Initialize Button */
            .tsc-spacer {
                flex: 1;
            }

            .tsc-init-btn {
                position: relative;
                padding: 1rem 2rem;
                border: 1px solid var(--tsc-red);
                color: var(--tsc-red);
                text-transform: uppercase;
                font-weight: 700;
                font-size: 0.75rem;
                letter-spacing: 0.15em;
                background: rgba(255, 0, 0, 0.05);
                cursor: pointer;
                overflow: hidden;
                transition: all 0.3s ease;
                font-family: 'JetBrains Mono', monospace;
                margin-top: auto;
                clip-path: polygon(0 0, 100% 0, 100% 85%, 95% 100%, 0 100%);
            }

            .tsc-init-btn::before {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(45deg, transparent 25%, rgba(255, 0, 0, 0.3) 50%, transparent 75%);
                transform: translateX(-100%);
                transition: transform 0.6s ease;
            }

            .tsc-init-btn:hover {
                color: var(--tsc-white);
                background: var(--tsc-red);
                box-shadow: 0 0 30px rgba(255, 0, 0, 0.5), inset 0 0 20px rgba(0, 242, 255, 0.2);
            }

            .tsc-init-btn:hover::before {
                transform: translateX(100%);
            }

            /* Glitch Effect */
            .tsc-init-btn.glitch-active {
                animation: tsc-glitch 0.4s steps(2) forwards;
            }

            @keyframes tsc-glitch {
                0% { transform: translate(0); }
                20% { transform: translate(-3px, 3px); filter: hue-rotate(90deg); }
                40% { transform: translate(3px, -3px); filter: hue-rotate(-90deg); }
                60% { transform: translate(-3px, -3px); filter: hue-rotate(180deg); }
                80% { transform: translate(3px, 3px); }
                100% { transform: translate(0); }
            }

            /* Close Button */
            .tsc-close {
                position: absolute;
                top: 1.5rem;
                right: 1.5rem;
                width: 32px;
                height: 32px;
                border: 1px solid var(--tsc-glass-border);
                background: transparent;
                color: var(--tsc-dim);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1rem;
                transition: all 0.3s ease;
                clip-path: polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%);
            }

            .tsc-close:hover {
                border-color: var(--tsc-red);
                color: var(--tsc-red);
            }

            /* Overlay */
            .tsc-overlay {
                position: fixed;
                inset: 0;
                background: rgba(2, 2, 2, 0.6);
                z-index: 9998;
                opacity: 0;
                visibility: hidden;
                transition: all 0.4s ease;
                backdrop-filter: blur(2px);
            }

            .tsc-overlay.visible {
                opacity: 1;
                visibility: visible;
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .tsc-panel {
                    width: 100%;
                    clip-path: polygon(0 5%, 100% 0, 100% 100%, 0 100%);
                    padding: 2rem 1.5rem;
                }

                .tsc-skill-title {
                    font-size: 2rem;
                }

                .tsc-detail-grid {
                    grid-template-columns: 1fr;
                }

                .tsc-init-btn {
                    padding: 1.2rem 1.5rem;
                }
            }

            @media (max-width: 480px) {
                .tsc-panel {
                    padding: 1.5rem 1rem;
                }

                .tsc-skill-title {
                    font-size: 1.5rem;
                }

                .tsc-mastery-container {
                    margin: 1rem 0;
                }

                .tsc-detail-item {
                    padding: 0.6rem 0.8rem;
                }
            }

            /* Animation States */
            .tsc-panel.visible .tsc-skill-title,
            .tsc-panel.visible .tsc-mastery-container,
            .tsc-panel.visible .tsc-description,
            .tsc-panel.visible .tsc-detail-grid,
            .tsc-panel.visible .tsc-subskills,
            .tsc-panel.visible .tsc-init-btn {
                animation: tsc-fadeSlideIn 0.5s ease forwards;
                animation-delay: var(--delay, 0.1s);
            }

            @keyframes tsc-fadeSlideIn {
                from {
                    opacity: 0;
                    transform: translateX(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            .tsc-panel.visible .tsc-skill-title { --delay: 0.15s; }
            .tsc-panel.visible .tsc-mastery-container { --delay: 0.25s; }
            .tsc-panel.visible .tsc-description { --delay: 0.35s; }
            .tsc-panel.visible .tsc-detail-grid { --delay: 0.45s; }
            .tsc-panel.visible .tsc-subskills { --delay: 0.55s; }
            .tsc-panel.visible .tsc-init-btn { --delay: 0.65s; }
        `;

        document.head.appendChild(styles);
        this.stylesInjected = true;
    }

    createPanel() {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'tsc-overlay';
        this.container.appendChild(this.overlay);

        // Create panel
        this.panel = document.createElement('div');
        this.panel.className = 'tsc-panel';
        this.panel.setAttribute('role', 'dialog');
        this.panel.setAttribute('aria-label', 'Technical Specification Card');
        this.panel.innerHTML = `
            <button class="tsc-close" aria-label="Close panel">&times;</button>
            <div class="tsc-header-label">//_TECHNICAL_SPEC_ARCHIVE</div>
            <div class="tsc-skill-title" id="tsc-title">SKILL_NAME</div>
            
            <div class="tsc-mastery-container">
                <div class="tsc-mastery-label">
                    <span>Neural Mastery</span>
                    <span id="tsc-mastery-percent">0%</span>
                </div>
                <div class="tsc-mastery-track">
                    <div class="tsc-mastery-fill" id="tsc-mastery-fill"></div>
                    <div class="tsc-mastery-glow"></div>
                </div>
            </div>
            
            <p class="tsc-description" id="tsc-description">
                Loading technical specification data...
            </p>
            
            <div class="tsc-detail-grid" id="tsc-details"></div>
            
            <div class="tsc-subskills">
                <div class="tsc-subskills-title">Sub-Skills Matrix</div>
                <div class="tsc-subskills-grid" id="tsc-subskills"></div>
            </div>
            
            <div class="tsc-spacer"></div>
            
            <button class="tsc-init-btn" id="tsc-init-btn">
                Initialize Project
            </button>
        `;

        this.container.appendChild(this.panel);

        // Cache DOM references
        this.titleEl = this.panel.querySelector('#tsc-title');
        this.masteryFill = this.panel.querySelector('#tsc-mastery-fill');
        this.masteryPercent = this.panel.querySelector('#tsc-mastery-percent');
        this.descriptionEl = this.panel.querySelector('#tsc-description');
        this.detailsEl = this.panel.querySelector('#tsc-details');
        this.subskillsEl = this.panel.querySelector('#tsc-subskills');
        this.initBtn = this.panel.querySelector('#tsc-init-btn');
        this.closeBtn = this.panel.querySelector('.tsc-close');
    }

    bindEvents() {
        // Close on overlay click
        this.overlay.addEventListener('click', () => this.hide());

        // Close button
        this.closeBtn.addEventListener('click', () => this.hide());

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });

        // Initialize button glitch effect
        this.initBtn.addEventListener('mouseenter', () => {
            this.initBtn.classList.add('glitch-active');
        });

        this.initBtn.addEventListener('mouseleave', () => {
            setTimeout(() => {
                this.initBtn.classList.remove('glitch-active');
            }, 100);
        });

        // Initialize button click
        this.initBtn.addEventListener('click', () => {
            this.handleInit();
        });
    }

    /**
     * Show the specification panel with skill data
     * Slides in from right with spring animation
     * @param {Object} skillData - Skill specification object
     */
    show(skillData) {
        if (!skillData) {
            console.warn('TechSpecCard.show() called without skill data');
            return;
        }

        this.currentSkill = skillData;
        this.render(skillData);
        
        // Trigger spring animation
        requestAnimationFrame(() => {
            this.panel.classList.add('visible');
            this.overlay.classList.add('visible');
        });

        this.isVisible = true;

        // Animate mastery bar after panel is visible
        setTimeout(() => {
            this.animateMastery(skillData.mastery || 85);
        }, 200);
    }

    /**
     * Hide the specification panel
     */
    hide() {
        this.panel.classList.remove('visible');
        this.overlay.classList.remove('visible');
        this.isVisible = false;

        // Reset mastery bar
        this.masteryFill.style.width = '0%';
    }

    /**
     * Render skill data into the panel
     */
    render(skillData) {
        // Title
        this.titleEl.textContent = skillData.title || 'Unknown Skill';

        // Description
        this.descriptionEl.textContent = skillData.description || 
            'Accessing neural-mastery data for this technical domain. Advanced algorithms engaged for autonomous execution.';

        // Details grid
        const details = skillData.details || {
            'Sync Status': 'ACTIVE',
            'Log ID': 'A-' + Math.floor(Math.random() * 900 + 100),
            'Domain': 'Elite',
            'Priority': 'High'
        };

        this.detailsEl.innerHTML = Object.entries(details)
            .map(([label, value]) => `
                <div class="tsc-detail-item">
                    <div class="tsc-detail-label">${label}</div>
                    <div class="tsc-detail-value">${value}</div>
                </div>
            `).join('');

        // Sub-skills
        const subskills = skillData.subskills || [];
        this.subskillsEl.innerHTML = subskills.length > 0
            ? subskills.map(skill => `<span class="tsc-subskill-tag">${skill}</span>`).join('')
            : '<span class="tsc-subskill-tag" style="opacity: 0.3;">No sub-skills mapped</span>';
    }

    /**
     * Animate mastery bar fill
     */
    animateMastery(percent) {
        this.masteryFill.style.width = '0%';
        this.masteryPercent.textContent = '0%';

        requestAnimationFrame(() => {
            this.masteryFill.style.width = `${percent}%`;
            
            // Animate percentage counter
            let current = 0;
            const duration = 1200;
            const start = performance.now();

            const animate = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                current = Math.floor(progress * percent);
                this.masteryPercent.textContent = `${current}%`;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        });
    }

    /**
     * Handle initialize button click
     */
    handleInit() {
        if (this.currentSkill && this.currentSkill.onInit) {
            this.currentSkill.onInit(this.currentSkill);
        } else {
            // Default behavior - emit custom event
            const event = new CustomEvent('tsc:init', {
                detail: { skill: this.currentSkill }
            });
            document.dispatchEvent(event);
            
            // Visual feedback
            this.initBtn.textContent = 'Initializing...';
            this.initBtn.style.background = 'var(--tsc-cyan)';
            this.initBtn.style.color = 'var(--tsc-bg)';
            
            setTimeout(() => {
                this.initBtn.textContent = 'Initialize Project';
                this.initBtn.style.background = '';
                this.initBtn.style.color = '';
            }, 2000);
        }
    }

    /**
     * Update panel with new data without re-animating
     */
    update(skillData) {
        if (!this.isVisible) {
            this.show(skillData);
            return;
        }

        this.currentSkill = skillData;
        this.render(skillData);
        this.masteryFill.style.width = `${skillData.mastery || 85}%`;
        this.masteryPercent.textContent = `${skillData.mastery || 85}%`;
    }

    /**
     * Toggle panel visibility
     */
    toggle(skillData) {
        if (this.isVisible) {
            this.hide();
        } else if (skillData) {
            this.show(skillData);
        }
    }

    /**
     * Destroy the component
     */
    destroy() {
        this.panel?.remove();
        this.overlay?.remove();
        document.getElementById('tech-spec-card-styles')?.remove();
        this.stylesInjected = false;
    }
}

// Default export for module usage
export default TechSpecCard;

// Named export for convenience
export function createTechSpecCard(container) {
    return new TechSpecCard(container);
}
