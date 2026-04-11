# Antigravity Components

Elite brutalist design system components for the Antigravity Portfolio.

## Features

- **Blurred-Glass Background**: High-transparency glass effect using `backdrop-filter`
- **NothingDot Font**: Distinctive typography for skill titles
- **Red/Cyan Gradient Mastery Bar**: Animated progress indicator with glow effects
- **Detailed Specs Grid**: Organized display of sync status, domain, and priority
- **Sub-Skills Matrix**: Tag-based display of related technologies
- **Initialize Project Button**: Interactive glitch effect on hover
- **Spring Animation**: Smooth slide-in from right with cubic-bezier easing
- **Brutalist Edges**: Angular clip-path for aggressive, modern aesthetic
- **Fully Responsive**: Adapts to mobile, tablet, and desktop viewports

## Installation

```javascript
import { TechSpecCard } from './TechSpecCard.js';
```

Or use the index:

```javascript
import { TechSpecCard } from './components/index.js';
```

## Usage

### Basic Setup

```javascript
const specCard = new TechSpecCard();
```

### Show Panel with Skill Data

```javascript
specCard.show({
    title: 'PyTorch',
    description: 'Elite-tier mastery of deep learning frameworks...',
    mastery: 94, // 0-100 percentage
    details: {
        'Sync Status': 'ACTIVE',
        'Log ID': 'PY-7842',
        'Domain': 'Deep Learning',
        'Priority': 'CRITICAL'
    },
    subskills: ['Tensor Operations', 'Autograd', 'nn.Module', 'Distributed Training'],
    onInit: (skill) => {
        console.log('Initializing:', skill.title);
        // Custom initialization logic
    }
});
```

### Hide Panel

```javascript
specCard.hide();
```

### Toggle Panel

```javascript
specCard.toggle(skillData);
```

### Update Panel Without Re-animating

```javascript
specCard.update(newSkillData);
```

### Destroy Component

```javascript
specCard.destroy();
```

## API Reference

### Constructor

```javascript
new TechSpecCard(container = document.body)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| container | HTMLElement | document.body | DOM element to append the panel to |

### Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `show(skillData)` | Object | Display panel with skill data and spring animation |
| `hide()` | - | Hide panel with transition |
| `toggle(skillData)` | Object | Toggle panel visibility |
| `update(skillData)` | Object | Update content without re-animating |
| `destroy()` | - | Remove component and cleanup |

### Skill Data Structure

```typescript
interface SkillData {
    title: string;           // Skill name displayed in NothingDot font
    description?: string;    // Optional description text
    mastery?: number;        // 0-100 percentage for mastery bar
    details?: Object;        // Key-value pairs for detail grid
    subskills?: string[];    // Array of sub-skill tags
    onInit?: Function;       // Callback for initialize button click
}
```

## Events

The component dispatches a custom event when the Initialize button is clicked (if no `onInit` callback is provided):

```javascript
document.addEventListener('tsc:init', (e) => {
    console.log('Skill initialized:', e.detail.skill);
});
```

## Styling

The component injects its own styles automatically. CSS variables can be overridden:

```css
:root {
    --tsc-bg: #020202;
    --tsc-cyan: #00f2ff;
    --tsc-red: #ff0000;
    --tsc-glass: rgba(10, 10, 10, 0.85);
    --tsc-glass-border: rgba(255, 255, 255, 0.08);
    --tsc-white: #ffffff;
    --tsc-dim: rgba(255, 255, 255, 0.4);
}
```

## Demo

Open `tech-spec-card-demo.html` in a browser to see the component in action.

## Browser Support

- Chrome 76+
- Firefox 103+
- Safari 9+
- Edge 79+

Note: `backdrop-filter` may have limited support in older browsers. Fallback styling is minimal.

---

# Spring-Ease Hotspot UI

Interactive hotspot markers with glassmorphic info cards for the Antigravity Showcase.

## Features

- **5 Interactive Hotspot Markers**: Div/Sphere elements with 1.5x scale on hover
- **Glassmorphic Info Cards**: `backdrop-filter: blur(20px)` with spring-ease transition
- **300ms Spring-Ease Animation**: `cubic-bezier(0.34, 1.56, 0.64, 1)` for bouncy feel
- **Animated Telemetry Bars**: Gradient filling with shimmer effect
- **Detail Bullet Points**: Staggered slide-in animation
- **Three.js Integration**: Export positions and sync with center model
- **Color Variants**: Cyan, Red, Purple, Green, Orange

## Usage

```javascript
import { SpringEaseHotspot } from './components/index.js';

// Initialize with default hotspots
const hotspots = new SpringEaseHotspot();

// Or with custom configuration
const hotspots = new SpringEaseHotspot({
    container: document.body,
    hotspots: [
        {
            id: 'my-hotspot',
            label: 'Custom Hotspot',
            icon: '🔧',
            position: { x: 50, y: 50 }, // Percentage
            color: 'cyan',
            telemetry: { name: 'Power', value: '85%', percentage: 85 },
            details: [
                { text: 'Status', value: 'Active' },
                { text: 'Load', value: '42%' }
            ],
            status: 'ONLINE',
            statusType: 'active',
            cardPosition: 'right'
        }
    ]
});
```

## API Reference

| Method | Description |
|--------|-------------|
| `showCard(id)` | Show card with animation |
| `hideCard(id)` | Hide card |
| `updateHotspot(id, updates)` | Update hotspot data |
| `updateTelemetry(id, percentage, value)` | Update telemetry bar |
| `getThreePositions()` | Get positions for Three.js integration |
| `syncWithThree(id, screenPosition)` | Sync position with Three.js model |
| `destroy()` | Cleanup component |

---

# Particle Parallax Background

Smooth mouse parallax effect for 3500+ particle background.

## Features

- **3500+ Particles**: Random distribution with depth layers
- **Spring-Ease Parallax**: Smooth interpolation with configurable strength
- **WebGL-Optimized**: Canvas 2D rendering with requestAnimationFrame
- **5 Depth Layers**: Particles move at different speeds based on depth
- **Twinkle Effect**: Some particles twinkle for star-like appearance
- **Touch Support**: Works on mobile devices

## Usage

```javascript
import { ParticleParallax } from './components/index.js';

const particles = new ParticleParallax({
    particleCount: 3500,
    springStrength: 0.08,
    colors: {
        cyan: 'rgba(0, 242, 255, ALPHA)',
        purple: 'rgba(191, 90, 242, ALPHA)',
        white: 'rgba(255, 255, 255, ALPHA)'
    }
});
```

## API Reference

| Method | Description |
|--------|-------------|
| `setSpringStrength(strength)` | Update parallax spring strength (0-1) |
| `setMousePosition(x, y)` | Manual mouse position (0-1 normalized) |
| `burst(x, y, strength)` | Trigger burst effect at position |
| `destroy()` | Cleanup component |

---

## Combined Usage

```javascript
import { SpringEaseHotspot, ParticleParallax } from './components/index.js';

// Initialize particle background
const particles = new ParticleParallax({ particleCount: 3500 });

// Initialize hotspots
const hotspots = new SpringEaseHotspot();

// Three.js Integration
const positions = hotspots.getThreePositions();
// Use positions to place markers around your Three.js model
```

## Demo

Open `spring-ease-hotspot-demo.html` in a browser to see the full system in action.

---

## License

MIT - Antigravity Portfolio
