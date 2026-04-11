/**
 * Antigravity Portfolio - Components Index
 * 
 * Elite brutalist design system components for the Antigravity Portfolio.
 */

// Technical Specification Card Component
export { TechSpecCard, createTechSpecCard } from './TechSpecCard.js';

// Spring-Ease Hotspot UI Component
export { SpringEaseHotspot, createSpringEaseHotspot } from './SpringEaseHotspot.js';

// Particle Parallax Background
export { ParticleParallax, createParticleParallax } from './ParticleParallax.js';

// Volumetric Warp Tunnel
export { VolumetricWarpTunnel, createVolumetricWarpTunnel } from './VolumetricWarpTunnel.js';

// Default export - SpringEaseHotspot (primary showcase component)
export { SpringEaseHotspot as default } from './SpringEaseHotspot.js';

/**
 * Quick Usage Example:
 * 
 * import { SpringEaseHotspot, ParticleParallax } from './components/index.js';
 * 
 * // Initialize particle background
 * const particles = new ParticleParallax({ particleCount: 3500 });
 * 
 * // Initialize hotspots
 * const hotspots = new SpringEaseHotspot();
 * 
 * // Three.js Integration:
 * const positions = hotspots.getThreePositions();
 * // Use positions to sync with your Three.js model
 */
