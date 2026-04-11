/**
 * Spring-Ease Hotspot UI Module
 * 
 * Interactive hotspot markers with glassmorphic info cards for Antigravity Showcase.
 * Designed for integration with a fixed Three.js center model.
 * 
 * Features:
 * - 5 interactive hotspot markers (Divs/Spheres)
 * - 1.5x scale on hover with spring-ease transition
 * - Glassmorphic info card with backdrop-filter blur(20px)
 * - Animated telemetry bars with gradient filling
 * - Detail bullet points
 */

// ============================================
// CSS INJECTION - Spring-Ease Hotspot Styles
// ============================================
const injectStyles = () => {
    if (document.getElementById('seh-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'seh-styles';
    style.textContent = `
        /* ═══════════════════════════════════════════════════════════
           SPRING-EASE HOTSPOT - Glassmorphic Design System
           ═══════════════════════════════════════════════════════════ */
        
        :root {
            --seh-bg: #030303;
            --seh-cyan: #00f2ff;
            --seh-red: #ff2d55;
            --seh-purple: #bf5af2;
            --seh-green: #30d158;
            --seh-orange: #ff9f0a;
            --seh-glass: rgba(15, 15, 20, 0.75);
            --seh-glass-border: rgba(255, 255, 255, 0.12);
            --seh-glow: rgba(0, 242, 255, 0.4);
            --seh-white: #ffffff;
            --seh-dim: rgba(255, 255, 255, 0.5);
            --seh-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        /* ═══════════════════════════════════════════════════════════
           HOTSPOT CONTAINER
           ═══════════════════════════════════════════════════════════ */
        
        .seh-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        }
        
        /* ═══════════════════════════════════════════════════════════
           HOTSPOT MARKERS
           ═══════════════════════════════════════════════════════════ */
        
        .seh-hotspot {
            position: absolute;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            pointer-events: auto;
            cursor: pointer;
            transition: 
                transform 300ms var(--seh-spring),
                box-shadow 300ms ease;
            z-index: 10;
        }
        
        .seh-hotspot::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: radial-gradient(circle, var(--seh-cyan) 0%, transparent 70%);
            opacity: 0.6;
            animation: seh-pulse 2s ease-in-out infinite;
        }
        
        .seh-hotspot::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--seh-white);
            box-shadow: 0 0 12px var(--seh-cyan), 0 0 24px var(--seh-cyan);
        }
        
        .seh-hotspot:hover {
            transform: scale(1.5);
            box-shadow: 0 0 40px var(--seh-glow);
        }
        
        .seh-hotspot--active {
            transform: scale(1.5);
        }
        
        /* Hotspot color variants */
        .seh-hotspot[data-color="cyan"] { --hotspot-color: var(--seh-cyan); }
        .seh-hotspot[data-color="red"] { --hotspot-color: var(--seh-red); }
        .seh-hotspot[data-color="purple"] { --hotspot-color: var(--seh-purple); }
        .seh-hotspot[data-color="green"] { --hotspot-color: var(--seh-green); }
        .seh-hotspot[data-color="orange"] { --hotspot-color: var(--seh-orange); }
        
        .seh-hotspot::before {
            background: radial-gradient(circle, var(--hotspot-color, var(--seh-cyan)) 0%, transparent 70%);
        }
        
        .seh-hotspot::after {
            box-shadow: 0 0 12px var(--hotspot-color, var(--seh-cyan)), 
                        0 0 24px var(--hotspot-color, var(--seh-cyan));
        }
        
        @keyframes seh-pulse {
            0%, 100% { 
                transform: translate(-50%, -50%) scale(1); 
                opacity: 0.6; 
            }
            50% { 
                transform: translate(-50%, -50%) scale(1.8); 
                opacity: 0.2; 
            }
        }
        
        /* ═══════════════════════════════════════════════════════════
           GLASSMORPHIC INFO CARD
           ═══════════════════════════════════════════════════════════ */
        
        .seh-card {
            position: absolute;
            width: 320px;
            padding: 24px;
            background: var(--seh-glass);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--seh-glass-border);
            border-radius: 16px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(10px) scale(0.95);
            transition: 
                opacity 300ms var(--seh-spring),
                visibility 300ms,
                transform 300ms var(--seh-spring);
            z-index: 20;
            pointer-events: none;
            clip-path: polygon(
                0 0,
                calc(100% - 20px) 0,
                100% 20px,
                100% 100%,
                20px 100%,
                0 calc(100% - 20px)
            );
        }
        
        .seh-card--visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(0) scale(1);
            pointer-events: auto;
        }
        
        /* Card positioning relative to hotspot */
        .seh-card[data-position="right"] {
            left: calc(100% + 20px);
            top: 50%;
            transform: translateY(-50%) translateX(-10px) scale(0.95);
        }
        
        .seh-card[data-position="left"] {
            right: calc(100% + 20px);
            top: 50%;
            transform: translateY(-50%) translateX(10px) scale(0.95);
        }
        
        .seh-card[data-position="top"] {
            bottom: calc(100% + 20px);
            left: 50%;
            transform: translateX(-50%) translateY(10px) scale(0.95);
        }
        
        .seh-card[data-position="bottom"] {
            top: calc(100% + 20px);
            left: 50%;
            transform: translateX(-50%) translateY(-10px) scale(0.95);
        }
        
        .seh-card--visible[data-position="right"],
        .seh-card--visible[data-position="left"] {
            transform: translateY(-50%) translateX(0) scale(1);
        }
        
        .seh-card--visible[data-position="top"] {
            transform: translateX(-50%) translateY(0) scale(1);
        }
        
        .seh-card--visible[data-position="bottom"] {
            transform: translateX(-50%) translateY(0) scale(1);
        }
        
        /* ═══════════════════════════════════════════════════════════
           CARD HEADER
           ═══════════════════════════════════════════════════════════ */
        
        .seh-card__header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--seh-glass-border);
        }
        
        .seh-card__icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background: linear-gradient(135deg, var(--seh-cyan), var(--seh-purple));
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            flex-shrink: 0;
        }
        
        .seh-card__title {
            font-family: 'SF Mono', 'Fira Code', monospace;
            font-size: 16px;
            font-weight: 600;
            color: var(--seh-white);
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        
        .seh-card__label {
            font-size: 11px;
            color: var(--seh-dim);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 2px;
        }
        
        /* ═══════════════════════════════════════════════════════════
           TELEMETRY BAR (Animated Gradient)
           ═══════════════════════════════════════════════════════════ */
        
        .seh-card__telemetry {
            margin-bottom: 20px;
        }
        
        .seh-card__telemetry-label {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .seh-card__telemetry-name {
            font-size: 12px;
            color: var(--seh-dim);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .seh-card__telemetry-value {
            font-family: 'SF Mono', 'Fira Code', monospace;
            font-size: 13px;
            color: var(--seh-cyan);
            font-weight: 600;
        }
        
        .seh-card__telemetry-bar {
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            overflow: hidden;
            position: relative;
        }
        
        .seh-card__telemetry-fill {
            height: 100%;
            width: 0%;
            border-radius: 3px;
            background: linear-gradient(
                90deg,
                var(--seh-cyan) 0%,
                var(--seh-purple) 50%,
                var(--seh-red) 100%
            );
            background-size: 200% 100%;
            animation: seh-gradient-flow 3s ease infinite;
            transition: width 800ms var(--seh-spring);
            position: relative;
        }
        
        .seh-card__telemetry-fill::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
                90deg,
                transparent 0%,
                rgba(255, 255, 255, 0.4) 50%,
                transparent 100%
            );
            animation: seh-shimmer 2s ease-in-out infinite;
        }
        
        @keyframes seh-gradient-flow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        @keyframes seh-shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        /* ═══════════════════════════════════════════════════════════
           DETAIL BULLET POINTS
           ═══════════════════════════════════════════════════════════ */
        
        .seh-card__details {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .seh-card__detail {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            font-size: 13px;
            color: var(--seh-white);
            line-height: 1.5;
            opacity: 0;
            transform: translateX(-10px);
            animation: seh-detail-slide 300ms var(--seh-spring) forwards;
        }
        
        .seh-card__detail:nth-child(1) { animation-delay: 100ms; }
        .seh-card__detail:nth-child(2) { animation-delay: 150ms; }
        .seh-card__detail:nth-child(3) { animation-delay: 200ms; }
        .seh-card__detail:nth-child(4) { animation-delay: 250ms; }
        
        @keyframes seh-detail-slide {
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .seh-card__bullet {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--seh-cyan);
            flex-shrink: 0;
            margin-top: 6px;
            box-shadow: 0 0 8px var(--seh-cyan);
        }
        
        .seh-card__detail--highlight .seh-card__bullet {
            background: var(--seh-red);
            box-shadow: 0 0 8px var(--seh-red);
        }
        
        .seh-card__detail-text {
            flex: 1;
        }
        
        .seh-card__detail-value {
            color: var(--seh-cyan);
            font-family: 'SF Mono', 'Fira Code', monospace;
            font-weight: 500;
        }
        
        /* ═══════════════════════════════════════════════════════════
           STATUS INDICATOR
           ═══════════════════════════════════════════════════════════ */
        
        .seh-card__status {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid var(--seh-glass-border);
        }
        
        .seh-card__status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--seh-green);
            animation: seh-status-pulse 1.5s ease-in-out infinite;
        }
        
        @keyframes seh-status-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
        }
        
        .seh-card__status-dot--warning {
            background: var(--seh-orange);
        }
        
        .seh-card__status-dot--error {
            background: var(--seh-red);
        }
        
        .seh-card__status-text {
            font-size: 11px;
            color: var(--seh-dim);
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        /* ═══════════════════════════════════════════════════════════
           CONNECTOR LINE (Hotspot to Card)
           ═══════════════════════════════════════════════════════════ */
        
        .seh-connector {
            position: absolute;
            height: 1px;
            background: linear-gradient(90deg, var(--seh-cyan), transparent);
            opacity: 0;
            transition: opacity 300ms ease;
            pointer-events: none;
        }
        
        .seh-connector--visible {
            opacity: 0.6;
        }
    `;
    
    document.head.appendChild(style);
};

// ============================================
// HOTSPOT DATA INTERFACES
// ============================================

/**
 * @typedef {Object} HotspotData
 * @property {string} id - Unique identifier
 * @property {string} label - Data label for header
 * @property {string} icon - Emoji or icon string
 * @property {Object} position - { x, y } percentage position (0-100)
 * @property {string} color - Color variant (cyan, red, purple, green, orange)
 * @property {Object} telemetry - { name, value, percentage }
 * @property {Array<Object>} details - [{ text, value?, highlight? }]
 * @property {string} status - Status text
 * @property {string} statusType - 'active' | 'warning' | 'error'
 * @property {string} cardPosition - 'right' | 'left' | 'top' | 'bottom'
 */

// ============================================
// DEFAULT HOTSPOT DATA
// ============================================

const DEFAULT_HOTSPOTS = [
    {
        id: 'neural-core',
        label: 'Neural Core',
        icon: '🧠',
        position: { x: 20, y: 25 },
        color: 'cyan',
        telemetry: { name: 'Processing Power', value: '94.2%', percentage: 94 },
        details: [
            { text: 'Tensor Flow Rate', value: '1.2M/s' },
            { text: 'Memory Allocation', value: '8.4 GB' },
            { text: 'Neural Pathways Active', value: '2,847' },
            { text: 'Latency', value: '< 2ms' }
        ],
        status: 'ACTIVE',
        statusType: 'active',
        cardPosition: 'right'
    },
    {
        id: 'quantum-sync',
        label: 'Quantum Sync',
        icon: '⚛️',
        position: { x: 75, y: 20 },
        color: 'purple',
        telemetry: { name: 'Entanglement', value: '87.8%', percentage: 88 },
        details: [
            { text: 'Qubit Coherence', value: '99.7%' },
            { text: 'Quantum Gates', value: '4,294' },
            { text: 'Error Rate', value: '0.003%', highlight: true },
            { text: 'Superposition States', value: '512' }
        ],
        status: 'SYNCHRONIZED',
        statusType: 'active',
        cardPosition: 'left'
    },
    {
        id: 'data-stream',
        label: 'Data Stream',
        icon: '📊',
        position: { x: 15, y: 70 },
        color: 'green',
        telemetry: { name: 'Throughput', value: '12.4 GB/s', percentage: 78 },
        details: [
            { text: 'Inbound Rate', value: '6.2 GB/s' },
            { text: 'Outbound Rate', value: '6.2 GB/s' },
            { text: 'Buffer Usage', value: '34%' },
            { text: 'Compression Ratio', value: '4.2:1' }
        ],
        status: 'STREAMING',
        statusType: 'active',
        cardPosition: 'right'
    },
    {
        id: 'security-layer',
        label: 'Security Layer',
        icon: '🔒',
        position: { x: 80, y: 65 },
        color: 'red',
        telemetry: { name: 'Encryption', value: 'AES-256', percentage: 100 },
        details: [
            { text: 'Threats Blocked', value: '1,247' },
            { text: 'Active Sessions', value: '89' },
            { text: 'Firewall Rules', value: '412' },
            { text: 'Last Breach Attempt', value: 'Never' }
        ],
        status: 'SECURE',
        statusType: 'active',
        cardPosition: 'left'
    },
    {
        id: 'power-matrix',
        label: 'Power Matrix',
        icon: '⚡',
        position: { x: 50, y: 85 },
        color: 'orange',
        telemetry: { name: 'Efficiency', value: '98.1%', percentage: 98 },
        details: [
            { text: 'Input Voltage', value: '240V AC' },
            { text: 'Output Power', value: '850W' },
            { text: 'Temperature', value: '42°C' },
            { text: 'UPS Backup', value: '45 min' }
        ],
        status: 'OPTIMAL',
        statusType: 'active',
        cardPosition: 'top'
    }
];

// ============================================
// SPRING-EASE HOTSPOT CLASS
// ============================================

export class SpringEaseHotspot {
    /**
     * Create a SpringEaseHotspot instance
     * @param {Object} options - Configuration options
     * @param {HTMLElement} [options.container=document.body] - Container element
     * @param {Array<HotspotData>} [options.hotspots] - Hotspot configurations
     * @param {boolean} [options.autoInit=true] - Auto-initialize on creation
     */
    constructor(options = {}) {
        this.container = options.container || document.body;
        this.hotspots = options.hotspots || DEFAULT_HOTSPOTS;
        this.autoInit = options.autoInit !== false;
        
        this.elements = new Map();
        this.activeHotspot = null;
        this.isInitialized = false;
        
        if (this.autoInit) {
            this.init();
        }
    }
    
    /**
     * Initialize the hotspot UI
     */
    init() {
        if (this.isInitialized) return;
        
        injectStyles();
        this.createContainer();
        this.createHotspots();
        this.bindEvents();
        this.isInitialized = true;
    }
    
    /**
     * Create the main container element
     */
    createContainer() {
        this.containerEl = document.createElement('div');
        this.containerEl.className = 'seh-container';
        this.containerEl.id = 'seh-hotspot-container';
        this.container.appendChild(this.containerEl);
    }
    
    /**
     * Create all hotspot elements
     */
    createHotspots() {
        this.hotspots.forEach((hotspot, index) => {
            this.createHotspotElement(hotspot, index);
        });
    }
    
    /**
     * Create a single hotspot element with card
     * @param {HotspotData} hotspot - Hotspot configuration
     * @param {number} index - Index for animation delay
     */
    createHotspotElement(hotspot, index) {
        // Hotspot marker wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'seh-hotspot-wrapper';
        wrapper.style.cssText = `
            position: absolute;
            left: ${hotspot.position.x}%;
            top: ${hotspot.position.y}%;
            transform: translate(-50%, -50%);
        `;
        
        // Hotspot marker
        const marker = document.createElement('div');
        marker.className = 'seh-hotspot';
        marker.setAttribute('data-color', hotspot.color);
        marker.setAttribute('data-id', hotspot.id);
        marker.style.animationDelay = `${index * 100}ms`;
        
        // Info card
        const card = this.createInfoCard(hotspot);
        
        wrapper.appendChild(marker);
        wrapper.appendChild(card);
        this.containerEl.appendChild(wrapper);
        
        // Store reference
        this.elements.set(hotspot.id, { wrapper, marker, card, data: hotspot });
    }
    
    /**
     * Create glassmorphic info card
     * @param {HotspotData} hotspot - Hotspot configuration
     * @returns {HTMLElement} Card element
     */
    createInfoCard(hotspot) {
        const card = document.createElement('div');
        card.className = 'seh-card';
        card.setAttribute('data-position', hotspot.cardPosition);
        
        // Header
        const header = document.createElement('div');
        header.className = 'seh-card__header';
        header.innerHTML = `
            <div class="seh-card__icon">${hotspot.icon}</div>
            <div>
                <div class="seh-card__title">${hotspot.label}</div>
                <div class="seh-card__label">Data Label</div>
            </div>
        `;
        
        // Telemetry bar
        const telemetry = document.createElement('div');
        telemetry.className = 'seh-card__telemetry';
        telemetry.innerHTML = `
            <div class="seh-card__telemetry-label">
                <span class="seh-card__telemetry-name">${hotspot.telemetry.name}</span>
                <span class="seh-card__telemetry-value">${hotspot.telemetry.value}</span>
            </div>
            <div class="seh-card__telemetry-bar">
                <div class="seh-card__telemetry-fill" style="width: 0%"></div>
            </div>
        `;
        
        // Details
        const details = document.createElement('div');
        details.className = 'seh-card__details';
        hotspot.details.forEach(detail => {
            const detailEl = document.createElement('div');
            detailEl.className = `seh-card__detail${detail.highlight ? ' seh-card__detail--highlight' : ''}`;
            detailEl.innerHTML = `
                <div class="seh-card__bullet"></div>
                <div class="seh-card__detail-text">
                    ${detail.text}${detail.value ? `: <span class="seh-card__detail-value">${detail.value}</span>` : ''}
                </div>
            `;
            details.appendChild(detailEl);
        });
        
        // Status
        const status = document.createElement('div');
        status.className = 'seh-card__status';
        const statusDotClass = hotspot.statusType === 'warning' ? ' seh-card__status-dot--warning' :
                              hotspot.statusType === 'error' ? ' seh-card__status-dot--error' : '';
        status.innerHTML = `
            <div class="seh-card__status-dot${statusDotClass}"></div>
            <div class="seh-card__status-text">${hotspot.status}</div>
        `;
        
        card.appendChild(header);
        card.appendChild(telemetry);
        card.appendChild(details);
        card.appendChild(status);
        
        return card;
    }
    
    /**
     * Bind mouse events
     */
    bindEvents() {
        this.containerEl.addEventListener('mouseenter', this.handleMouseEnter.bind(this), true);
        this.containerEl.addEventListener('mouseleave', this.handleMouseLeave.bind(this), true);
    }
    
    /**
     * Handle mouse enter on hotspot
     * @param {MouseEvent} e
     */
    handleMouseEnter(e) {
        const hotspot = e.target.closest('.seh-hotspot');
        if (!hotspot) return;
        
        const id = hotspot.getAttribute('data-id');
        this.showCard(id);
    }
    
    /**
     * Handle mouse leave from hotspot
     * @param {MouseEvent} e
     */
    handleMouseLeave(e) {
        const hotspot = e.target.closest('.seh-hotspot');
        if (!hotspot) return;
        
        const id = hotspot.getAttribute('data-id');
        
        // Check if mouse moved to card
        setTimeout(() => {
            const element = this.elements.get(id);
            if (element && !element.card.matches(':hover')) {
                this.hideCard(id);
            }
        }, 100);
    }
    
    /**
     * Show info card with animation
     * @param {string} id - Hotspot ID
     */
    showCard(id) {
        const element = this.elements.get(id);
        if (!element) return;
        
        // Hide any other active cards
        if (this.activeHotspot && this.activeHotspot !== id) {
            this.hideCard(this.activeHotspot);
        }
        
        element.marker.classList.add('seh-hotspot--active');
        element.card.classList.add('seh-card--visible');
        
        // Animate telemetry bar
        const telemetryFill = element.card.querySelector('.seh-card__telemetry-fill');
        setTimeout(() => {
            telemetryFill.style.width = `${element.data.telemetry.percentage}%`;
        }, 50);
        
        this.activeHotspot = id;
        
        // Dispatch event
        this.containerEl.dispatchEvent(new CustomEvent('seh:show', {
            detail: { id, data: element.data }
        }));
    }
    
    /**
     * Hide info card
     * @param {string} id - Hotspot ID
     */
    hideCard(id) {
        const element = this.elements.get(id);
        if (!element) return;
        
        element.marker.classList.remove('seh-hotspot--active');
        element.card.classList.remove('seh-card--visible');
        
        // Reset telemetry bar
        const telemetryFill = element.card.querySelector('.seh-card__telemetry-fill');
        telemetryFill.style.width = '0%';
        
        if (this.activeHotspot === id) {
            this.activeHotspot = null;
        }
        
        // Dispatch event
        this.containerEl.dispatchEvent(new CustomEvent('seh:hide', {
            detail: { id, data: element.data }
        }));
    }
    
    /**
     * Update hotspot data
     * @param {string} id - Hotspot ID
     * @param {Partial<HotspotData>} updates - Data updates
     */
    updateHotspot(id, updates) {
        const element = this.elements.get(id);
        if (!element) return;
        
        // Merge updates
        element.data = { ...element.data, ...updates };
        
        // Recreate card with new data
        const newCard = this.createInfoCard(element.data);
        newCard.setAttribute('data-position', element.data.cardPosition);
        element.card.replaceWith(newCard);
        element.card = newCard;
        
        // If this card is active, show it again
        if (this.activeHotspot === id) {
            this.showCard(id);
        }
    }
    
    /**
     * Update telemetry value dynamically
     * @param {string} id - Hotspot ID
     * @param {number} percentage - New percentage (0-100)
     * @param {string} [value] - New display value
     */
    updateTelemetry(id, percentage, value) {
        const element = this.elements.get(id);
        if (!element) return;
        
        element.data.telemetry.percentage = percentage;
        if (value) element.data.telemetry.value = value;
        
        // Update display if card is visible
        if (this.activeHotspot === id) {
            const telemetryFill = element.card.querySelector('.seh-card__telemetry-fill');
            const telemetryValue = element.card.querySelector('.seh-card__telemetry-value');
            telemetryFill.style.width = `${percentage}%`;
            if (value) telemetryValue.textContent = value;
        }
    }
    
    /**
     * Get Three.js integration data
     * @returns {Array<Object>} Array of hotspot positions for Three.js
     */
    getThreePositions() {
        return Array.from(this.elements.values()).map(el => ({
            id: el.data.id,
            position: el.data.position,
            color: el.data.color
        }));
    }
    
    /**
     * Sync with Three.js model position
     * @param {string} id - Hotspot ID
     * @param {Object} screenPosition - { x, y } screen coordinates
     */
    syncWithThree(id, screenPosition) {
        const element = this.elements.get(id);
        if (!element) return;
        
        element.wrapper.style.left = `${screenPosition.x}%`;
        element.wrapper.style.top = `${screenPosition.y}%`;
        element.data.position = screenPosition;
    }
    
    /**
     * Destroy and cleanup
     */
    destroy() {
        if (this.containerEl) {
            this.containerEl.remove();
        }
        this.elements.clear();
        this.isInitialized = false;
    }
}

// ============================================
// FACTORY FUNCTION
// ============================================

/**
 * Create a SpringEaseHotspot instance
 * @param {Object} options - Configuration options
 * @returns {SpringEaseHotspot}
 */
export function createSpringEaseHotspot(options = {}) {
    return new SpringEaseHotspot(options);
}

// ============================================
// DEFAULT EXPORT
// ============================================

export default SpringEaseHotspot;
