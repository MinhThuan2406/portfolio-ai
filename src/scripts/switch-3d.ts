import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export interface Switch3DOptions {
  interactive?: boolean;
  onPress?: () => void;
  initialMode?: 'assembled' | 'exploded';
  initialColor?: 'blue' | 'red' | 'brown';
  showKeycap?: boolean;
}

export type SwitchColor = 'blue' | 'red' | 'brown';

const COLOR_MAP: Record<SwitchColor, { hex: number; name: string; sound: string; force: string; type: string; ledHex: number }> = {
  blue: {
    hex: 0x1d70b8,
    name: 'CHERRY MX BLUE',
    sound: '/sounds/blue-1.mp3',
    force: '60g',
    type: 'Clicky',
    ledHex: 0x38bdf8
  },
  red: {
    hex: 0xdc2626,
    name: 'CHERRY MX RED',
    sound: '/sounds/red-1.mp3',
    force: '45g',
    type: 'Linear',
    ledHex: 0xf87171
  },
  brown: {
    hex: 0x92400e,
    name: 'CHERRY MX BROWN',
    sound: '/sounds/brown-1.mp3',
    force: '55g',
    type: 'Tactile',
    ledHex: 0xfbbf24
  }
};

// Helical spring curve matching authentic switch dimensions
class SpringCurve extends THREE.Curve<THREE.Vector3> {
  turns: number;
  height: number;
  radius: number;
  constructor(turns = 8, height = 0.0076, radius = 0.0022) {
    super();
    this.turns = turns;
    this.height = height;
    this.radius = radius;
  }
  getPoint(t: number, optionalTarget = new THREE.Vector3()): THREE.Vector3 {
    const angle = t * Math.PI * 2 * this.turns;
    const x = Math.cos(angle) * this.radius;
    const y = Math.sin(angle) * this.radius;
    const z = (t - 0.5) * this.height;
    return optionalTarget.set(x, y, z);
  }
}

function createKeycapTexture(text = 'INIT'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Smooth dark PBT material
  ctx.fillStyle = '#1e2430';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle keycap top dish inset gradient
  const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 240);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
  grad.addColorStop(0.65, 'rgba(255, 255, 255, 0.01)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Outer edge bevel
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 14;
  ctx.strokeRect(30, 30, 452, 452);

  // High-contrast clean legend
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 72px "JetBrains Mono", -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
  ctx.shadowBlur = 18;
  ctx.fillText(text, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export class Switch3DController {
  public container: HTMLElement;
  public canvas: HTMLCanvasElement;
  public renderer!: THREE.WebGLRenderer;
  public scene!: THREE.Scene;
  public camera!: THREE.PerspectiveCamera;
  public rootGroup!: THREE.Group;
  public modelGroup!: THREE.Group;

  // Layered groups
  public keycapGroup!: THREE.Group;
  public stemGroup!: THREE.Group;
  public topHousingGroup!: THREE.Group;
  public springGroup!: THREE.Group;
  public ledGroup!: THREE.Group;
  public leafGroup!: THREE.Group;
  public bottomHousingGroup!: THREE.Group;
  public pedestalMesh!: THREE.Mesh;

  public keycapMesh: THREE.Mesh | null = null;
  public stemMesh: THREE.Mesh | null = null;
  public topHousingMesh: THREE.Mesh | null = null;
  public leafMesh: THREE.Mesh | null = null;
  public bottomHousingMesh: THREE.Mesh | null = null;
  public springMesh: THREE.Mesh | null = null;
  public ledMesh: THREE.Mesh | null = null;
  public ledPointLight!: THREE.PointLight;

  public isExploded = false;
  public hasKeycap = false; // Default bare switch matching user reference photo
  public currentColor: SwitchColor = 'blue';
  public isPressed = false;
  public pressOffset = 0;
  public targetRotation = { x: 0.38, y: -0.55 };
  public currentRotation = { x: 0.38, y: -0.55 };
  public isDragging = false;
  public previousMousePosition = { x: 0, y: 0 };
  public animationFrameId: number | null = null;
  public options: Switch3DOptions;

  private targetCameraZ = 0.40;
  private currentCameraZ = 0.40;
  private audioElements: Record<string, HTMLAudioElement> = {};

  constructor(container: HTMLElement, options: Switch3DOptions = {}) {
    this.container = container;
    this.options = options;
    this.currentColor = options.initialColor || 'blue';
    this.isExploded = options.initialMode === 'exploded';
    this.hasKeycap = options.showKeycap ?? false;

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'switch-3d-canvas';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.display = 'block';
    this.canvas.style.cursor = 'grab';
    this.container.appendChild(this.canvas);

    this.initPreloadAudio();
    this.initThree();
    this.loadModels();
    this.setupEventListeners();
  }

  private initPreloadAudio(): void {
    Object.values(COLOR_MAP).forEach((info) => {
      const audio = new Audio(info.sound);
      audio.volume = 0.65;
      this.audioElements[info.sound] = audio;
    });
  }

  private initThree(): void {
    // Verify WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const hasWebGL = !!(
        window.WebGLRenderingContext &&
        (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
      );
      if (!hasWebGL) {
        throw new Error('WebGL is not available');
      }
    } catch {
      throw new Error('WebGL is not supported or disabled in this environment');
    }

    const width = this.container.clientWidth || 400;
    const height = this.container.clientHeight || 340;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(30, width / height, 0.01, 100);
    this.camera.position.set(0, 0.035, this.currentCameraZ);
    this.camera.lookAt(0, 0.002, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;

    // Multi-angle Studio Lighting for crisp bevels and specular highlights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(ambientLight);

    // Primary Key Light (Top-right front)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(3, 5, 4);
    this.scene.add(keyLight);

    // Fill Light (Left side)
    const fillLight = new THREE.DirectionalLight(0xa5b4fc, 1.6);
    fillLight.position.set(-4, 2, 2);
    this.scene.add(fillLight);

    // Rim / Backlight for edge silhouette definition
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    rimLight.position.set(0, 4, -4);
    this.scene.add(rimLight);

    // Upward bounce light to illuminate internal spring & leaf
    const bounceLight = new THREE.DirectionalLight(0xffedd5, 1.2);
    bounceLight.position.set(0, -3, 2);
    this.scene.add(bounceLight);

    // Root container
    this.rootGroup = new THREE.Group();
    this.scene.add(this.rootGroup);

    // Aluminum Switch-Tester Base Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(0.108, 0.116, 0.016, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x181f2a,
      metalness: 0.88,
      roughness: 0.26
    });
    this.pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
    this.pedestalMesh.position.set(0, -0.076, 0);
    this.rootGroup.add(this.pedestalMesh);

    // Glowing LED halo track ring
    const ringGeo = new THREE.RingGeometry(0.098, 0.106, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: COLOR_MAP[this.currentColor].ledHex,
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.set(0, -0.067, 0);
    this.rootGroup.add(ringMesh);

    this.modelGroup = new THREE.Group();
    this.modelGroup.scale.set(8.5, 8.5, 8.5);
    this.modelGroup.rotation.x = Math.PI / 2;
    this.modelGroup.position.set(0, -0.008, 0);
    this.rootGroup.add(this.modelGroup);

    // Exploded sub-groups
    this.bottomHousingGroup = new THREE.Group();
    this.leafGroup = new THREE.Group();
    this.springGroup = new THREE.Group();
    this.ledGroup = new THREE.Group();
    this.topHousingGroup = new THREE.Group();
    this.stemGroup = new THREE.Group();
    this.keycapGroup = new THREE.Group();

    this.modelGroup.add(
      this.bottomHousingGroup,
      this.leafGroup,
      this.springGroup,
      this.ledGroup,
      this.topHousingGroup,
      this.stemGroup,
      this.keycapGroup
    );

    // Helical Coil Spring (Polished stainless steel)
    const springGeo = new THREE.TubeGeometry(new SpringCurve(8, 0.0076, 0.0022), 96, 0.00038, 8, false);
    const springMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.98,
      roughness: 0.10
    });
    this.springMesh = new THREE.Mesh(springGeo, springMat);
    this.springMesh.position.set(0, 0, 0);
    this.springGroup.add(this.springMesh);

    // 3mm Through-Hole Dome LED in front slot (matches user reference photo)
    this.initLedComponent();

    this.startLoop();
  }

  private initLedComponent(): void {
    const ledHolder = new THREE.Group();

    // 3mm Cylindrical Dome Bulb
    const bulbGeo = new THREE.CylinderGeometry(0.0015, 0.0015, 0.0035, 16);
    const domeGeo = new THREE.SphereGeometry(0.0015, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    domeGeo.translate(0, 0.00175, 0);

    const bulbMat = new THREE.MeshStandardMaterial({
      color: COLOR_MAP[this.currentColor].ledHex,
      emissive: COLOR_MAP[this.currentColor].ledHex,
      emissiveIntensity: 0.8,
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.92
    });

    const bulbMesh = new THREE.Mesh(bulbGeo, bulbMat);
    const domeMesh = new THREE.Mesh(domeGeo, bulbMat);
    ledHolder.add(bulbMesh, domeMesh);

    // Two silver wire pins poking through bottom housing
    const pinGeo = new THREE.CylinderGeometry(0.00028, 0.00028, 0.009, 8);
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      metalness: 0.98,
      roughness: 0.1
    });

    const pin1 = new THREE.Mesh(pinGeo, pinMat);
    pin1.position.set(-0.0008, -0.0055, 0);
    const pin2 = new THREE.Mesh(pinGeo, pinMat);
    pin2.position.set(0.0008, -0.0055, 0);
    ledHolder.add(pin1, pin2);

    // Position in front cutout of Cherry switch (along Y in local space)
    ledHolder.rotation.x = -Math.PI / 2;
    ledHolder.position.set(0, -0.0052, -0.0028);

    this.ledMesh = bulbMesh;
    this.ledGroup.add(ledHolder);

    // Glow light from the LED
    this.ledPointLight = new THREE.PointLight(COLOR_MAP[this.currentColor].ledHex, 1.8, 0.15);
    this.ledPointLight.position.set(0, -0.005, -0.003);
    this.modelGroup.add(this.ledPointLight);
  }

  private loadModels(): void {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    // 1. Load Switch components
    gltfLoader.load(
      '/models/switch.glb',
      (gltf) => {
        const meshes: THREE.Mesh[] = [];
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            meshes.push(child as THREE.Mesh);
          }
        });

        // Exact verified Cherry MX mapping:
        // meshes[0]: Bottom Housing (Base)
        // meshes[1]: Metal Contact Leaf (Gold/copper)
        // meshes[2]: Stem (Cruciform cross)
        // meshes[3]: Top Housing (Cover with clips)
        if (meshes.length >= 4) {
          this.bottomHousingMesh = meshes[0];
          this.leafMesh = meshes[1];
          this.stemMesh = meshes[2];
          this.topHousingMesh = meshes[3];

          // Top Housing: Solid matte graphite PA66 nylon with crisp bevels (user reference)
          this.topHousingMesh.material = new THREE.MeshStandardMaterial({
            color: 0x1e242c,
            roughness: 0.38,
            metalness: 0.18
          });

          // Bottom Housing: Charcoal matte PA66 nylon base
          this.bottomHousingMesh.material = new THREE.MeshStandardMaterial({
            color: 0x161a20,
            roughness: 0.45,
            metalness: 0.12
          });

          // Contact Leaf: Gleaming Polished Brass / Copper Alloy
          this.leafMesh.material = new THREE.MeshStandardMaterial({
            color: 0xd97706,
            metalness: 0.96,
            roughness: 0.16
          });

          // Stem: Vibrant colored POM (Cherry Blue, Red, or Brown)
          this.stemMesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(COLOR_MAP[this.currentColor].hex),
            roughness: 0.32,
            metalness: 0.05
          });

          this.topHousingGroup.add(this.topHousingMesh);
          this.leafGroup.add(this.leafMesh);
          this.stemGroup.add(this.stemMesh);
          this.bottomHousingGroup.add(this.bottomHousingMesh);
        }
      },
      undefined,
      () => console.warn('Failed to load switch.glb')
    );

    // 2. Load Keycap
    gltfLoader.load(
      '/models/keycap.glb',
      (gltf) => {
        gltf.scene.traverse((c) => {
          if ((c as THREE.Mesh).isMesh) {
            this.keycapMesh = c as THREE.Mesh;
          }
        });

        if (this.keycapMesh) {
          const keycapTexture = createKeycapTexture('INIT');
          this.keycapMesh.material = new THREE.MeshStandardMaterial({
            map: keycapTexture,
            color: 0xffffff,
            roughness: 0.50,
            metalness: 0.08
          });

          // Align keycap upright with stem cruciform cross
          this.keycapMesh.rotation.set(0, 0, 0);
          this.keycapMesh.position.set(0, 0, -0.0070);

          this.keycapGroup.add(this.keycapMesh);
          this.keycapGroup.visible = this.hasKeycap;
        }
      },
      undefined,
      () => console.warn('Failed to load keycap.glb')
    );
  }

  private setupEventListeners(): void {
    const canvas = this.canvas;

    canvas.addEventListener('pointerdown', (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = 'grabbing';
    });

    window.addEventListener('pointermove', (e) => {
      if (this.isDragging) {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;

        this.targetRotation.y += deltaX * 0.012;
        this.targetRotation.x = Math.max(-0.55, Math.min(0.85, this.targetRotation.x + deltaY * 0.012));

        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    window.addEventListener('pointerup', () => {
      this.isDragging = false;
      canvas.style.cursor = 'grab';
    });

    canvas.addEventListener('click', () => {
      this.pressSwitch();
    });

    const ro = new ResizeObserver(() => {
      this.handleResize();
    });
    ro.observe(this.container);
  }

  public pressSwitch(): void {
    if (this.isPressed) return;
    this.isPressed = true;

    this.playSound();

    // Stem depression along Z (moving downwards into switch)
    this.pressOffset = 0.0035;

    // Power flare: LED and underglow light surge
    if (this.ledPointLight) {
      this.ledPointLight.intensity = 4.8;
    }
    // Micro push-in
    this.targetCameraZ = 0.36;

    if (this.options.onPress) {
      this.options.onPress();
    }

    setTimeout(() => {
      this.pressOffset = 0;
      this.isPressed = false;
      if (this.ledPointLight) {
        this.ledPointLight.intensity = 1.8;
      }
    }, 220);
  }

  public setColor(color: SwitchColor): void {
    if (!Object.prototype.hasOwnProperty.call(COLOR_MAP, color)) return;
    this.currentColor = color;
    const info = COLOR_MAP[color];
    if (this.stemMesh) {
      (this.stemMesh.material as THREE.MeshStandardMaterial).color.set(info.hex);
    }
    if (this.ledMesh) {
      const mat = this.ledMesh.material as THREE.MeshStandardMaterial;
      mat.color.set(info.ledHex);
      mat.emissive.set(info.ledHex);
    }
    if (this.ledPointLight) {
      this.ledPointLight.color.set(info.ledHex);
    }
  }

  public setExploded(exploded: boolean): void {
    this.isExploded = exploded;
    this.targetCameraZ = this.isExploded ? 0.46 : 0.40;
  }

  public toggleExploded(): boolean {
    this.isExploded = !this.isExploded;
    this.targetCameraZ = this.isExploded ? 0.46 : 0.40;
    return this.isExploded;
  }

  public toggleKeycap(): boolean {
    this.hasKeycap = !this.hasKeycap;
    if (this.keycapGroup) {
      this.keycapGroup.visible = this.hasKeycap;
    }
    return this.hasKeycap;
  }

  public getColorInfo() {
    return COLOR_MAP[this.currentColor];
  }

  private playSound(): void {
    const soundUrl = COLOR_MAP[this.currentColor].sound;
    const audio = this.audioElements[soundUrl] || new Audio(soundUrl);
    try {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch {}
  }

  private handleResize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private startLoop(): void {
    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);

      // Smooth inertia rotation
      this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.1;
      this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.1;

      // Subtle breathing float
      const time = performance.now() * 0.0015;
      const idleFloat = Math.sin(time) * 0.002;

      this.rootGroup.rotation.x = this.currentRotation.x;
      this.rootGroup.rotation.y = this.currentRotation.y;
      this.rootGroup.position.y = idleFloat;

      // Camera dolly zoom for exploded vs assembled framing
      this.currentCameraZ += (this.targetCameraZ - this.currentCameraZ) * 0.08;
      this.camera.position.z = this.currentCameraZ;

      // Exploded targets along local Z:
      // Keycap floats highest, then Stem, then Top Housing, Spring & LED in center, Leaf, and Base
      const targetKeycapZ = (this.isExploded ? -0.0160 : -0.0068) + this.pressOffset;
      const targetStemZ = (this.isExploded ? -0.0092 : 0) + this.pressOffset;
      const targetTopHousingZ = this.isExploded ? -0.0048 : 0;
      const targetSpringZ = this.isExploded ? -0.0006 : 0;
      const targetLedZ = this.isExploded ? -0.0018 : 0;
      const targetLeafZ = this.isExploded ? 0.0024 : 0;
      const targetBottomZ = this.isExploded ? 0.0055 : 0;

      const targetSpringScaleZ = this.isExploded ? 1.4 : this.isPressed ? 0.6 : 1.0;

      // Smooth lerp
      this.keycapGroup.position.z += (targetKeycapZ - this.keycapGroup.position.z) * 0.14;
      this.stemGroup.position.z += (targetStemZ - this.stemGroup.position.z) * 0.14;
      this.topHousingGroup.position.z += (targetTopHousingZ - this.topHousingGroup.position.z) * 0.14;
      this.springGroup.position.z += (targetSpringZ - this.springGroup.position.z) * 0.14;
      this.ledGroup.position.z += (targetLedZ - this.ledGroup.position.z) * 0.14;
      this.leafGroup.position.z += (targetLeafZ - this.leafGroup.position.z) * 0.14;
      this.bottomHousingGroup.position.z += (targetBottomZ - this.bottomHousingGroup.position.z) * 0.14;

      if (this.springMesh) {
        this.springMesh.scale.z += (targetSpringScaleZ - this.springMesh.scale.z) * 0.14;
      }

      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }

  public destroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.renderer.dispose();
    if (this.canvas.parentElement) {
      this.canvas.parentElement.removeChild(this.canvas);
    }
  }
}
