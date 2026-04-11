/**
 * Volumetric Warp Tunnel - Three.js Scene for Antigravity Portfolio
 * 
 * Features:
 * - 2000+ volumetric particles
 * - 290+ floating data nodes with text sprites
 * - Camera scroll from Z=500 to Z=0
 * - Neural Core at tunnel end with pulsing light
 * - Bloom + Chromatic Aberration post-processing
 * - Sine wave floating animation
 * 
 * Materials: Emissive Cobalt Blue (#0066FF) and Pure White (#FFFFFF)
 */

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  tunnel: {
    startZ: 500,
    endZ: 0,
    radius: 80,
    length: 500
  },
  particles: {
    count: 2200,
    size: 1.5,
    color: 0x0066FF  // Electric Cobalt
  },
  dataNodes: {
    count: 300,
    color: 0x0066FF,
    white: 0xFFFFFF
  },
  neuralCore: {
    radius: 15,
    pulseSpeed: 1.2,
    color: 0x0066FF,
    glowIntensity: 2.5
  },
  bloom: {
    strength: 1.5,
    radius: 0.8,
    threshold: 0.2
  },
  chromaticAberration: {
    amount: 0.003
  },
  animation: {
    floatSpeed: 0.5,
    floatAmplitude: 2.0
  }
};

// ============================================================================
// CHROMATIC ABERRATION SHADER
// ============================================================================

const ChromaticAberrationShader = {
  uniforms: {
    tDiffuse: { value: null },
    amount: { value: CONFIG.chromaticAberration.amount },
    time: { value: 0 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float amount;
    uniform float time;
    varying vec2 vUv;
    
    void main() {
      vec2 center = vec2(0.5, 0.5);
      vec2 dir = vUv - center;
      float dist = length(dir);
      
      // Dynamic aberration based on distance from center
      float dynamicAmount = amount * (0.5 + 0.5 * sin(time * 0.5)) * dist * 2.0;
      
      float r = texture2D(tDiffuse, vUv + dir * dynamicAmount).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - dir * dynamicAmount).b;
      
      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `
};

// ============================================================================
// MAIN CLASS
// ============================================================================

export class VolumetricWarpTunnel {
  constructor(container) {
    this.container = container || document.body;
    this.progress = 0;
    this.time = 0;
    this.isPlaying = true;
    
    // Bind methods
    this.animate = this.animate.bind(this);
    this.onResize = this.onResize.bind(this);
    
    this.init();
  }

  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createParticles();
    this.createDataNodes();
    this.createNeuralCore();
    this.createTunnelGeometry();
    this.setupPostProcessing();
    this.setupLights();
    this.setupEventListeners();
    this.animate();
  }

  // --------------------------------------------------------------------------
  // SCENE SETUP
  // --------------------------------------------------------------------------

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000508);
    this.scene.fog = new THREE.FogExp2(0x000508, 0.002);
  }

  createCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, CONFIG.tunnel.startZ);
    this.camera.lookAt(0, 0, CONFIG.tunnel.endZ);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);
  }

  // --------------------------------------------------------------------------
  // PARTICLES SYSTEM
  // --------------------------------------------------------------------------

  createParticles() {
    const count = CONFIG.particles.count;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    const colorCobalt = new THREE.Color(0x0066FF);
    const colorWhite = new THREE.Color(0xFFFFFF);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Distribute along tunnel Z-axis
      const z = Math.random() * CONFIG.tunnel.length;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * CONFIG.tunnel.radius;
      
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = Math.sin(angle) * radius;
      positions[i3 + 2] = z;
      
      // Color variation - mostly cobalt with white sparkles
      const mixRatio = Math.random() < 0.15 ? 1 : 0;
      const color = mixRatio ? colorWhite : colorCobalt;
      
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      sizes[i] = Math.random() * CONFIG.particles.size + 0.5;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Custom shader for glowing particles
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: this.renderer.getPixelRatio() }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        uniform float pixelRatio;
        
        void main() {
          vColor = color;
          vec3 pos = position;
          
          // Floating animation
          pos.x += sin(time * 0.5 + position.z * 0.05) * 1.5;
          pos.y += cos(time * 0.4 + position.z * 0.03) * 1.5;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * pixelRatio * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          float glow = exp(-dist * 4.0) * 0.5;
          
          vec3 finalColor = vColor + glow;
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    this.particles = new THREE.Points(geometry, particleMaterial);
    this.scene.add(this.particles);
  }

  // --------------------------------------------------------------------------
  // DATA NODES (Floating Text Shards)
  // --------------------------------------------------------------------------

  createDataNodes() {
    this.dataNodesGroup = new THREE.Group();
    
    const nodeTexts = [
      '0x', '1x', 'FF', '00', 'AI', '01', '10', 'AB',
      '>', '<', '=', '+', '*', '/', '%', '&', '|', '^',
      'λ', 'Σ', 'π', 'Δ', 'Ω', '∞', '◆', '◇', '○', '●',
      'DATA', 'NODE', 'SYNC', 'WARP', 'FLOW', 'CORE',
      '{ }', '[ ]', '( )', '< >', '" "', "' '"
    ];
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 128;
    canvas.height = 64;
    
    for (let i = 0; i < CONFIG.dataNodes.count; i++) {
      const node = this.createDataNode(ctx, canvas, nodeTexts);
      
      // Position along tunnel
      const z = Math.random() * CONFIG.tunnel.length;
      const angle = Math.random() * Math.PI * 2;
      const radius = 10 + Math.random() * (CONFIG.tunnel.radius - 15);
      
      node.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        z
      );
      
      // Random rotation
      node.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      
      // Store initial position for animation
      node.userData.initialY = node.position.y;
      node.userData.initialX = node.position.x;
      node.userData.phase = Math.random() * Math.PI * 2;
      
      this.dataNodesGroup.add(node);
    }
    
    this.scene.add(this.dataNodesGroup);
  }

  createDataNode(ctx, canvas, texts) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw text
    const text = texts[Math.floor(Math.random() * texts.length)];
    ctx.fillStyle = Math.random() < 0.3 ? '#FFFFFF' : '#0066FF';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    
    // Add glow effect
    ctx.shadowColor = '#0066FF';
    ctx.shadowBlur = 10;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.8
    });
    
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(4, 2, 1);
    
    return sprite;
  }

  // --------------------------------------------------------------------------
  // NEURAL CORE (Pulsing Light at Z=0)
  // --------------------------------------------------------------------------

  createNeuralCore() {
    this.neuralCoreGroup = new THREE.Group();
    
    // Core sphere
    const coreGeometry = new THREE.IcosahedronGeometry(CONFIG.neuralCore.radius, 3);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: CONFIG.neuralCore.color,
      transparent: true,
      opacity: 0.9,
      wireframe: true
    });
    this.neuralCore = new THREE.Mesh(coreGeometry, coreMaterial);
    
    // Inner glow sphere
    const innerGeometry = new THREE.IcosahedronGeometry(CONFIG.neuralCore.radius * 0.7, 2);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x0066FF,
      transparent: true,
      opacity: 0.6
    });
    this.innerCore = new THREE.Mesh(innerGeometry, innerMaterial);
    
    // Outer glow shell
    const outerGeometry = new THREE.IcosahedronGeometry(CONFIG.neuralCore.radius * 1.3, 1);
    const outerMaterial = new THREE.MeshBasicMaterial({
      color: 0x0066FF,
      transparent: true,
      opacity: 0.2,
      wireframe: true
    });
    this.outerCore = new THREE.Mesh(outerGeometry, outerMaterial);
    
    // Point light at core
    this.coreLight = new THREE.PointLight(0x0066FF, CONFIG.neuralCore.glowIntensity * 50, 200);
    
    // Position at Z=0
    this.neuralCoreGroup.position.z = CONFIG.tunnel.endZ;
    this.neuralCoreGroup.add(this.neuralCore);
    this.neuralCoreGroup.add(this.innerCore);
    this.neuralCoreGroup.add(this.outerCore);
    this.neuralCoreGroup.add(this.coreLight);
    
    this.scene.add(this.neuralCoreGroup);
  }

  // --------------------------------------------------------------------------
  // TUNNEL GEOMETRY (Visual Guide Rings)
  // --------------------------------------------------------------------------

  createTunnelGeometry() {
    const ringCount = 50;
    const tunnelGroup = new THREE.Group();
    
    for (let i = 0; i < ringCount; i++) {
      const z = (i / ringCount) * CONFIG.tunnel.length;
      const radius = CONFIG.tunnel.radius;
      
      const ringGeometry = new THREE.RingGeometry(radius - 1, radius, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x0066FF,
        transparent: true,
        opacity: 0.05,
        side: THREE.DoubleSide
      });
      
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.z = z;
      ring.rotation.x = Math.PI / 2;
      
      tunnelGroup.add(ring);
    }
    
    this.scene.add(tunnelGroup);
  }

  // --------------------------------------------------------------------------
  // POST-PROCESSING
  // --------------------------------------------------------------------------

  setupPostProcessing() {
    this.composer = new EffectComposer(this.renderer);
    
    // Render pass
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    
    // Bloom pass
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      CONFIG.bloom.strength,
      CONFIG.bloom.radius,
      CONFIG.bloom.threshold
    );
    this.composer.addPass(this.bloomPass);
    
    // Chromatic Aberration pass
    this.chromaticPass = new ShaderPass(ChromaticAberrationShader);
    this.composer.addPass(this.chromaticPass);
  }

  // --------------------------------------------------------------------------
  // LIGHTING
  // --------------------------------------------------------------------------

  setupLights() {
    // Ambient light (very dim)
    const ambient = new THREE.AmbientLight(0x001122, 0.2);
    this.scene.add(ambient);
    
    // Directional light from behind camera
    const directional = new THREE.DirectionalLight(0x0066FF, 0.5);
    directional.position.set(0, 0, CONFIG.tunnel.startZ);
    this.scene.add(directional);
  }

  // --------------------------------------------------------------------------
  // SCROLL FUNCTIONALITY
  // --------------------------------------------------------------------------

  /**
   * Move camera through tunnel based on progress (0-1)
   * @param {number} progress - 0 = start (Z=500), 1 = end (Z=0)
   */
  scrollTo(progress) {
    this.progress = Math.max(0, Math.min(1, progress));
    const targetZ = CONFIG.tunnel.startZ - (this.progress * CONFIG.tunnel.length);
    this.camera.position.z = targetZ;
    
    // Update chromatic aberration intensity based on progress
    if (this.chromaticPass) {
      this.chromaticPass.uniforms.amount.value = 
        CONFIG.chromaticAberration.amount * (1 + this.progress * 2);
    }
    
    // Increase bloom intensity near core
    if (this.bloomPass && this.progress > 0.7) {
      this.bloomPass.strength = CONFIG.bloom.strength * (1 + (this.progress - 0.7) * 2);
    }
  }

  // --------------------------------------------------------------------------
  // ANIMATION
  // --------------------------------------------------------------------------

  animate() {
    if (!this.isPlaying) return;
    
    requestAnimationFrame(this.animate);
    
    this.time += 0.016; // ~60fps
    
    // Update particle shader time
    if (this.particles && this.particles.material.uniforms) {
      this.particles.material.uniforms.time.value = this.time;
    }
    
    // Update chromatic aberration time
    if (this.chromaticPass) {
      this.chromaticPass.uniforms.time.value = this.time;
    }
    
    // Animate data nodes (sine wave floating)
    if (this.dataNodesGroup) {
      this.dataNodesGroup.children.forEach((node, i) => {
        const phase = node.userData.phase || 0;
        node.position.y = node.userData.initialY + 
          Math.sin(this.time * CONFIG.animation.floatSpeed + phase) * 
          CONFIG.animation.floatAmplitude;
        node.position.x = node.userData.initialX + 
          Math.cos(this.time * CONFIG.animation.floatSpeed * 0.7 + phase) * 
          CONFIG.animation.floatAmplitude * 0.5;
        
        // Gentle rotation
        node.rotation.z += 0.002;
      });
    }
    
    // Animate Neural Core (pulsing)
    if (this.neuralCoreGroup) {
      const pulse = Math.sin(this.time * CONFIG.neuralCore.pulseSpeed) * 0.3 + 1;
      
      this.neuralCore.scale.setScalar(pulse);
      this.innerCore.scale.setScalar(pulse * 0.9);
      this.outerCore.scale.setScalar(pulse * 1.1);
      
      // Rotate core elements
      this.neuralCore.rotation.x += 0.005;
      this.neuralCore.rotation.y += 0.007;
      this.outerCore.rotation.z -= 0.003;
      
      // Pulse light intensity
      this.coreLight.intensity = 
        CONFIG.neuralCore.glowIntensity * 50 * (0.7 + pulse * 0.3);
    }
    
    // Render
    this.composer.render();
  }

  // --------------------------------------------------------------------------
  // EVENT HANDLERS
  // --------------------------------------------------------------------------

  setupEventListeners() {
    window.addEventListener('resize', this.onResize);
    
    // Mouse scroll for demo
    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY * 0.0005;
      this.scrollTo(this.progress + delta);
    }, { passive: false });
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
    
    if (this.bloomPass) {
      this.bloomPass.resolution.set(width, height);
    }
  }

  // --------------------------------------------------------------------------
  // PUBLIC API
  // --------------------------------------------------------------------------

  play() {
    this.isPlaying = true;
    this.animate();
  }

  pause() {
    this.isPlaying = false;
  }

  dispose() {
    this.isPlaying = false;
    
    // Dispose geometries and materials
    this.scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(m => m.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
    
    // Remove renderer
    this.renderer.dispose();
    this.container.removeChild(this.renderer.domElement);
    
    // Remove event listeners
    window.removeEventListener('resize', this.onResize);
  }
}

// Export for ES module usage
export default VolumetricWarpTunnel;
