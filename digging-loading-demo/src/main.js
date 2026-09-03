import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

let canvas;
let depthValueEl;
let replayButton;
let hudTopline;
let loadingWordEl;
let loadingDotsEl;

let scene;
let camera;
let renderer;
let rockGroup;
let particleGroup;
let gem;
let gemInner;
let gemKeyLight;
let gemRimLight;
let gemFillLight;
let gemPointLight;
let gemVioletLight;
let streakGroup;
let streaks = [];
let composer;
let bloomPass;
let gemNormalTarget;
let gemBackMesh;
let gemNormalScene;
let gemNormalCamera;
let gemResolution;
let pointer = new THREE.Vector2(0, 0);
let rocks = [];
let particles = [];
let dotTimer = null;
let dotIndex = 0;
let introMode = false;
let introCompleteCallback = null;
let introComplete = false;
let animationRunning = false;
const dotStates = ['', '.', '..', '...'];

const LOADING_DURATION = 8000;

const config = {
  startDepth: 0,
  endDepth: 1000,
  gemRevealStart: 0.33,
  gemRevealEnd: 1,
};

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function getDepthForProgress(progress) {
  if (progress < 0.1333) {
    return 50 * easeOutCubic(progress / 0.1333);
  }

  if (progress < 0.6) {
    const localT = (progress - 0.1333) / (0.6 - 0.1333);
    return 50 + (750 - 50) * easeInOutCubic(localT);
  }

  if (progress < 0.8) {
    const localT = (progress - 0.6) / (0.8 - 0.6);
    return 750 + (950 - 750) * easeInOutCubic(localT);
  }

  if (progress < 0.9333) {
    const localT = (progress - 0.8) / (0.9333 - 0.8);
    return 950 + (999 - 950) * easeInOutCubic(localT);
  }

  const localT = (progress - 0.9333) / (1 - 0.9333);
  return 999 + (1000 - 999) * easeOutCubic(localT);
}

function getMovementStrength(progress) {
  if (progress < 0.1333) return 0.12;
  if (progress < 0.6) return 1.25;
  if (progress < 0.8) return 0.85;
  if (progress < 0.9333) return 0.45;
  return 0.12;
}

function init() {
  createScene();
  createRocks();
  createParticles();
  createGem();
  bindEvents();
  resetLoading();
  animate();
}

export function startDiggingIntro({ onComplete } = {}) {
  canvas = document.querySelector('#scene');
  depthValueEl = document.querySelector('#depth-value');
  replayButton = document.querySelector('#replay-btn');
  hudTopline = document.querySelector('.hud-topline');
  loadingWordEl = document.querySelector('.loading-word');
  loadingDotsEl = document.querySelector('.loading-dots');
  introMode = true;
  introCompleteCallback = onComplete;
  introComplete = false;
  animationRunning = true;
  init();
  return cleanupDiggingIntro;
}

// Scene and renderer setup.
function createScene() {
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 10, 26);

  camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0.6, 8.8);

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.35,
    0.2,
    0.85,
  );
  bloomPass.enabled = true;
  composer.addPass(bloomPass);

  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambient);

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;
  pmremGenerator.dispose();

  const keyLight = new THREE.DirectionalLight(0xf4f8ff, 0.9);
  keyLight.position.set(4, 5, 6);
  scene.add(keyLight);

  const blueAccentLight = new THREE.PointLight(0x6aa8ff, 0.2, 12, 2);
  blueAccentLight.position.set(-2, 1.8, 3.2);
  scene.add(blueAccentLight);

  const cyanAccentLight = new THREE.PointLight(0x4fe3ff, 0.15, 12, 2);
  cyanAccentLight.position.set(1.6, -1.8, 3.4);
  scene.add(cyanAccentLight);

  rockGroup = new THREE.Group();
  particleGroup = new THREE.Group();
  scene.add(rockGroup);
  scene.add(particleGroup);
}

// Create irregular stone clusters around the center.
function resolveRockPosition(candidate, radius, placedRocks, avoidCrystal = true, gap = 0.22) {
  const resolved = candidate.clone();
  const crystalCenterY = 0.18;
  const crystalRadiusX = 1.08 + radius + 0.24;
  const crystalRadiusY = 2.6 + radius + 0.24;

  for (let iteration = 0; iteration < 12; iteration += 1) {
    let changed = false;
    const crystalX = resolved.x / crystalRadiusX;
    const crystalY = (resolved.y - crystalCenterY) / crystalRadiusY;
    if (avoidCrystal && crystalX * crystalX + crystalY * crystalY < 1) {
      const push = new THREE.Vector2(resolved.x, resolved.y - crystalCenterY);
      if (push.lengthSq() < 0.01) push.set(1, 0);
      push.normalize().multiplyScalar(0.5);
      resolved.x += push.x;
      resolved.y += push.y;
      changed = true;
    }

    placedRocks.forEach((placed) => {
      const delta = resolved.clone().sub(placed.position);
      const minimumDistance = Math.max(radius + placed.radius + gap, radius * 0.78, placed.radius * 0.78);
      if (delta.lengthSq() < minimumDistance * minimumDistance) {
        if (delta.lengthSq() < 0.01) delta.set(Math.cos(placedRocks.indexOf(placed) * 1.7), Math.sin(placedRocks.indexOf(placed) * 1.7), 0.35);
        const currentDistance = delta.length();
        delta.normalize().multiplyScalar(minimumDistance - currentDistance + 0.08);
        resolved.add(delta);
        changed = true;
      }
    });

    if (!changed) break;
  }

  return resolved;
}

function createRocks() {
  const rockMaterial = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a,
    emissive: 0x070707,
    roughness: 0.92,
    metalness: 0.1,
    flatShading: true,
  });

  const rockGeometryList = [
    new THREE.IcosahedronGeometry(0.86, 0),
    new THREE.DodecahedronGeometry(1.06, 0),
    new THREE.IcosahedronGeometry(1.34, 1),
  ];

  const rockCount = window.innerWidth < 768 ? 18 : 26;
  const placedStartRocks = [];
  const placedTargetRocks = [];

  for (let i = 0; i < rockCount; i += 1) {
    const geometry = rockGeometryList[i % rockGeometryList.length].clone();
    const mesh = new THREE.Mesh(geometry, rockMaterial);

    const categoryRoll = Math.random();
    const category = categoryRoll < 0.25 ? 'large' : categoryRoll < 0.75 ? 'medium' : 'small';

    const ringAngle = (i / rockCount) * Math.PI * 2 + Math.random() * 0.8;
    const radialBias = category === 'large' ? 0.8 : category === 'medium' ? 1.2 : 1.7;
    const centerSpreadX = (Math.random() - 0.5) * 2.2;
    const centerSpreadY = (Math.random() - 0.5) * 2.8;

    const startX = Math.cos(ringAngle) * (0.9 + Math.random() * 1.8) * radialBias + centerSpreadX;
    const startY = Math.sin(ringAngle) * (0.7 + Math.random() * 2.2) * radialBias + centerSpreadY;
    const startZ = -2.8 + Math.random() * 4.8;

    const scaleBase = category === 'large' ? 1.3 + Math.random() * 1.8 : category === 'medium' ? 0.9 + Math.random() * 1.2 : 0.5 + Math.random() * 0.9;
    geometry.computeBoundingSphere();
    const collisionRadius = geometry.boundingSphere.radius * scaleBase;
    const startPosition = resolveRockPosition(new THREE.Vector3(startX, startY, startZ), collisionRadius, placedStartRocks, false, -0.12);

    mesh.position.copy(startPosition);
    mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI,
    );
    mesh.scale.setScalar(scaleBase);

    const direction = new THREE.Vector2(startPosition.x, startPosition.y);
    if (direction.lengthSq() < 0.08) {
      direction.set(Math.cos(ringAngle + 1.8), Math.sin(ringAngle + 1.8));
    }
    direction.normalize();

    const distance = category === 'large' ? 2.8 + Math.random() * 3.8 : category === 'medium' ? 2.2 + Math.random() * 3.2 : 1.5 + Math.random() * 2.4;
    const targetX = startPosition.x + direction.x * distance;
    const targetY = startPosition.y + direction.y * distance;
    const targetZ = startPosition.z + (Math.random() - 0.5) * 2.8 + (category === 'large' ? 1.3 : 0.6);
    const clearZoneX = category === 'large' ? 4.6 : category === 'medium' ? 3.7 : 3.1;
    const clearZoneY = category === 'large' ? 6.0 : category === 'medium' ? 4.8 : 4.2;
    const clearZoneScale = Math.max(
      1,
      Math.abs(targetX) / clearZoneX,
      Math.abs(targetY) / clearZoneY,
    );

    const targetPosition = resolveRockPosition(new THREE.Vector3(targetX * clearZoneScale, targetY * clearZoneScale, targetZ), collisionRadius, placedTargetRocks);

    placedStartRocks.push({ position: startPosition.clone(), radius: collisionRadius });
    placedTargetRocks.push({ position: targetPosition.clone(), radius: collisionRadius });

    mesh.userData = {
      category,
      collisionRadius,
      startPosition,
      targetPosition,
      startRotation: mesh.rotation.clone(),
      targetRotation: new THREE.Euler(
        (Math.random() - 0.5) * 0.9,
        (Math.random() - 0.5) * 1.2,
        (Math.random() - 0.5) * 1.1,
      ),
      moveDelay: Math.random() * 0.12,
      moveStrength: 0.75 + Math.random() * 0.9,
      phase: Math.random() * Math.PI * 2,
      baseScale: scaleBase,
      drift: (Math.random() - 0.5) * 0.25,
    };

    rockGroup.add(mesh);
    rocks.push(mesh);
  }
}

// Create dust particles that move upward to imply downward travel.
function createParticles() {
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xdddddd,
    size: 0.05,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  });

  const particleCount = window.innerWidth < 768 ? 150 : 240;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i += 1) {
    const idx = i * 3;
    positions[idx] = (Math.random() - 0.5) * 15;
    positions[idx + 1] = -6 + Math.random() * 10;
    positions[idx + 2] = (Math.random() - 0.5) * 10;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const points = new THREE.Points(geometry, particleMaterial);
  particleGroup.add(points);
  particles.push(points);
}

function createCrystalGeometry() {
  const segments = 20;
  const rings = [
    { y: 2.6, r: 0.0, offset: 0 },
    { y: 2.28, r: 0.25, offset: Math.PI / (segments * 2) },
    { y: 1.9, r: 0.48, offset: Math.PI / (segments * 4) },
    { y: 1.35, r: 0.76, offset: 0 },
    { y: 0.72, r: 0.96, offset: Math.PI / (segments * 2) },
    { y: 0.0, r: 1.08, offset: 0 },
    { y: -0.58, r: 0.92, offset: Math.PI / (segments * 4) },
    { y: -1.15, r: 0.76, offset: 0 },
    { y: -1.72, r: 0.5, offset: Math.PI / (segments * 2) },
    { y: -2.22, r: 0.25, offset: Math.PI / (segments * 4) },
    { y: -2.6, r: 0.0, offset: 0 },
  ];

  const vertexSets = rings.map((ring) => {
    const points = [];
    for (let i = 0; i < segments; i += 1) {
      const angle = (i / segments) * Math.PI * 2 + ring.offset;
      const x = Math.cos(angle) * ring.r;
      const z = Math.sin(angle) * ring.r;
      points.push(new THREE.Vector3(x, ring.y, z));
    }
    return points;
  });

  const positions = [];

  const addFace = (a, b, c) => {
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  };

  for (let ringIndex = 0; ringIndex < vertexSets.length - 1; ringIndex += 1) {
    const current = vertexSets[ringIndex];
    const next = vertexSets[ringIndex + 1];

    for (let i = 0; i < segments; i += 1) {
      const a = current[i];
      const b = current[(i + 1) % segments];
      const c = next[i];
      const d = next[(i + 1) % segments];

      addFace(a, b, d);
      addFace(a, d, c);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const uvs = [];
  const maxRadius = 1.08;
  const maxHeight = 5.2;

  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    const u = 0.5 + (x / (maxRadius * 2.2));
    const v = 0.5 + (y / maxHeight);
    uvs.push(u, v);
  }

  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();
  geometry.center();
  return geometry;
}

function createGem() {
  const gemGeometry = createCrystalGeometry();

  gemNormalTarget = new THREE.WebGLRenderTarget(renderer.domElement.width, renderer.domElement.height, {
    type: THREE.HalfFloatType,
    depthBuffer: false,
  });

  gemNormalScene = new THREE.Scene();
  gemNormalCamera = camera.clone();
  gemResolution = new THREE.Vector2(renderer.domElement.width, renderer.domElement.height);

  const normalShader = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        vec3 normal = normalize(vNormal);
        gl_FragColor = vec4(normal * 0.5 + 0.5, 1.0);
      }
    `,
    side: THREE.BackSide,
  });

  gemBackMesh = new THREE.Mesh(gemGeometry, normalShader);
  gemBackMesh.visible = false;
  gemNormalScene.add(gemBackMesh);

  const envTexture = scene.environment;
  const environmentHeight = envTexture.image?.height || 256;
  const environmentMaxMip = Math.log2(environmentHeight) - 2;
  const environmentTexelWidth = 1 / (3 * Math.max(2 ** environmentMaxMip, 7 * 16));
  const gemMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uBackface: { value: gemNormalTarget.texture },
      uEnvironment: { value: envTexture },
      uResolution: { value: gemResolution },
      uIor: { value: 2.42 },
      uDispersion: { value: 0.021 },
      uTint: { value: 0.22 },
      uExposure: { value: 0.9 },
      uLightStrength: { value: 0 },
    },
    defines: {
      ENVMAP_TYPE_CUBE_UV: '',
      CUBEUV_TEXEL_WIDTH: environmentTexelWidth.toFixed(8),
      CUBEUV_TEXEL_HEIGHT: (1 / environmentHeight).toFixed(8),
      CUBEUV_MAX_MIP: environmentMaxMip.toFixed(1),
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      varying vec2 vUv;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        vNormal = normalize(normalMatrix * normal);
        vViewDir = normalize(cameraPosition - worldPosition.xyz);
        vUv = uv;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: `
      #include <cube_uv_reflection_fragment>

      uniform sampler2D uBackface;
      uniform sampler2D uEnvironment;
      uniform vec2 uResolution;
      uniform float uTime;
      uniform float uIor;
      uniform float uDispersion;
      uniform float uTint;
      uniform float uExposure;
      uniform float uLightStrength;
      varying vec3 vWorldPosition;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      varying vec2 vUv;

      vec3 envSample(vec3 dir) {
        return textureCubeUV(uEnvironment, normalize(dir), 0.0).rgb * 0.42;
      }

      float fresnelSchlick(vec3 ray, vec3 normal, float ior) {
        float r0 = (1.0 - ior) / (1.0 + ior);
        r0 *= r0;
        return clamp(r0 + (1.0 - r0) * pow(1.0 - max(dot(-ray, normal), 0.0), 5.0), 0.0, 0.94);
      }

      vec3 internalTrace(vec3 incident, vec3 frontNormal, vec3 rearNormal, float ior) {
        vec3 result = vec3(0.0);
        vec3 ray = refract(incident, frontNormal, 1.0 / ior);
        vec3 exitRay = refract(ray, -rearNormal, ior);
        if (length(exitRay) > 0.001) result = envSample(exitRay);
        if (length(result) > 0.001) return result;

        ray = reflect(ray, -rearNormal);
        exitRay = refract(ray, -frontNormal, ior);
        if (length(exitRay) > 0.001) result = envSample(exitRay) * 0.94;
        if (length(result) > 0.001) return result;

        ray = reflect(ray, -frontNormal);
        exitRay = refract(ray, -rearNormal, ior);
        if (length(exitRay) > 0.001) result = envSample(exitRay) * 0.88;
        if (length(result) > 0.001) return result;

        ray = reflect(ray, -rearNormal);
        exitRay = refract(ray, -frontNormal, ior);
        if (length(exitRay) > 0.001) result = envSample(exitRay) * 0.82;
        if (length(result) > 0.001) return result;

        return envSample(reflect(ray, -frontNormal)) * 0.76;
      }

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 incident = normalize(vWorldPosition - cameraPosition);
        vec2 screenUv = gl_FragCoord.xy / uResolution;
        vec3 rearNormal = normalize(texture2D(uBackface, screenUv).rgb * 2.0 - 1.0);

        float dispersion = uDispersion * 1.35;
        vec3 transmitted;
        transmitted.r = internalTrace(incident, normal, rearNormal, max(1.01, uIor - dispersion)).r;
        transmitted.g = internalTrace(incident, normal, rearNormal, uIor).g;
        transmitted.b = internalTrace(incident, normal, rearNormal, max(1.01, uIor + dispersion)).b;

        vec3 reflected = envSample(reflect(incident, normal));
        float fresnel = fresnelSchlick(incident, normal, uIor);

        vec3 tint = mix(vec3(0.70, 0.82, 0.92), vec3(0.62, 0.78, 1.0), 0.55 + normal.y * 0.25);
        tint = mix(tint, vec3(0.74, 0.58, 1.0), smoothstep(0.25, 1.0, normal.z * 0.7 + 0.3));

        vec3 refractedGlass = mix(vec3(0.02, 0.045, 0.08), transmitted, 0.88);
        vec3 reflectedGlass = mix(vec3(0.045, 0.075, 0.12), reflected, 0.86);
        vec3 base = mix(refractedGlass * 1.32, reflectedGlass * 0.7, fresnel) * mix(vec3(0.72), tint, 0.62);

        float facetLight = 0.5 + 0.5 * dot(normal, normalize(vec3(-0.35, 0.78, 0.48)));
        base *= 0.72 + facetLight * 0.5;

        float facet = pow(1.0 - abs(dot(normal, rearNormal)), 2.8);
        float innerFacet = 0.5 + 0.5 * dot(rearNormal, normalize(vec3(0.42, -0.58, 0.7)));
        innerFacet *= 0.72 + 0.28 * smoothstep(0.08, 0.9, abs(normal.y));
        base *= 0.72 + innerFacet * 0.42;

        vec3 reflectedRay = reflect(incident, normal);
        float crownSpark = pow(max(dot(reflectedRay, normalize(vec3(-0.5, 0.72, 0.46))), 0.0), 72.0);
        float centerSpark = pow(max(dot(reflectedRay, normalize(vec3(0.22, 0.42, 0.88))), 0.0), 96.0);
        float pavilionSpark = pow(max(dot(reflectedRay, normalize(vec3(0.62, -0.48, 0.62))), 0.0), 84.0);
        vec3 silverSpark = vec3(0.92, 0.96, 1.0) * (crownSpark + centerSpark * 0.72 + pavilionSpark * 0.62) * 0.25;
        vec3 colorSpark = vec3(0.32, 0.7, 1.0) * centerSpark * 0.26
          + vec3(0.58, 0.42, 1.0) * pavilionSpark * 0.22
          + vec3(1.0, 0.72, 0.38) * crownSpark * 0.12;

        float cyanFacet = smoothstep(0.18, 0.88, dot(rearNormal, normalize(vec3(-0.52, 0.28, 0.8))));
        float violetFacet = smoothstep(0.12, 0.86, dot(rearNormal, normalize(vec3(0.62, 0.2, 0.76))));
        float warmFacet = smoothstep(0.35, 0.92, dot(rearNormal, normalize(vec3(0.18, 0.84, -0.52))));
        float pinkFacet = smoothstep(0.5, 0.96, dot(normal, normalize(vec3(-0.72, -0.18, 0.66))));
        vec3 internalSpectrum = vec3(0.18, 0.7, 0.92) * cyanFacet * (0.035 + facet * 0.11)
          + vec3(0.52, 0.32, 1.0) * violetFacet * (0.04 + facet * 0.13)
          + vec3(1.0, 0.68, 0.32) * warmFacet * (0.018 + facet * 0.06)
          + vec3(1.0, 0.38, 0.62) * pinkFacet * (0.01 + facet * 0.035);
        internalSpectrum *= 0.9 + length(transmitted) * 1.1;

        float whiteEdge = pow(max(dot(reflect(incident, normal), normalize(vec3(-0.35, 0.75, 0.25))), 0.0), 80.0);
        vec3 accent = vec3(0.85, 0.92, 1.0) * whiteEdge * 0.1;
        base += facet * mix(vec3(0.04, 0.1, 0.17), transmitted, 0.82) * 0.38;
        base += silverSpark + colorSpark + internalSpectrum + accent;

        vec3 finalColor = base * (0.85 + uLightStrength * 0.45);
        finalColor *= uExposure;
        finalColor = finalColor / (1.0 + max(finalColor, vec3(0.0)));
        finalColor = pow(max(finalColor, 0.0), vec3(0.9));

        float alpha = 0.78 + fresnel * 0.12;
        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  gem = new THREE.Mesh(gemGeometry, gemMaterial);
  gem.position.set(0, 0, 0);
  gem.scale.setScalar(0.18);
  gem.visible = false;
  scene.add(gem);

  streakGroup = new THREE.Group();
  streakGroup.position.z = -0.22;
  streakGroup.renderOrder = -1;
  gem.add(streakGroup);
  createLightStreaks();

  gemInner = new THREE.Mesh(gemGeometry, new THREE.MeshPhysicalMaterial({
    color: 0xb9d8ff,
    emissive: 0x10274c,
    emissiveIntensity: 0.01,
    roughness: 0.12,
    metalness: 0,
    transmission: 0.8,
    thickness: 1.0,
    ior: 1.9,
    transparent: true,
    opacity: 0.3,
    flatShading: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  }));
  gemInner.scale.setScalar(0.72);
  gemInner.position.set(0, 0, 0.12);
  gemInner.rotation.set(0.2, 0.1, 0.15);
  gemInner.visible = true;
  gem.add(gemInner);

  gemKeyLight = new THREE.DirectionalLight(0xf2f7ff, 0);
  gemKeyLight.position.set(2.2, 2.2, 2.6);
  scene.add(gemKeyLight);

  gemRimLight = new THREE.DirectionalLight(0x6d82ff, 0);
  gemRimLight.position.set(-2.5, 0.8, -2.8);
  scene.add(gemRimLight);

  gemFillLight = new THREE.PointLight(0x6fe9ff, 0, 16, 2);
  gemFillLight.position.set(0.8, -1.6, 2.5);
  scene.add(gemFillLight);

  gemPointLight = new THREE.PointLight(0xeaf4ff, 0, 16, 2);
  gemPointLight.position.set(0.2, -0.7, 2.8);
  scene.add(gemPointLight);

  gemVioletLight = new THREE.PointLight(0x896fff, 0, 5.5, 2);
  gemVioletLight.position.set(-0.15, 0.05, 1.65);
  scene.add(gemVioletLight);
}

function createLightStreaks() {
  const streakMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uIntensity: { value: 0 },
      uColor: { value: new THREE.Color(0xffffff) },
      uTint: { value: new THREE.Color(0xdce8ff) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uIntensity;
      uniform vec3 uColor;
      uniform vec3 uTint;
      varying vec2 vUv;
      void main() {
        float along = 1.0 - abs(vUv.x * 2.0 - 1.0);
        float width = 1.0 - smoothstep(0.0, 0.5, abs(vUv.y - 0.5) * 2.0);
        float core = pow(along, 1.65) * pow(width, 2.2);
        float tipFade = smoothstep(0.0, 0.08, along);
        vec3 streakColor = mix(uTint, uColor, pow(along, 0.65));
        gl_FragColor = vec4(streakColor * core * tipFade * uIntensity, core * tipFade * uIntensity);
      }
    `,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    side: THREE.DoubleSide,
  });

  const directions = [0, Math.PI / 4, Math.PI / 2, (Math.PI * 3) / 4, Math.PI, (Math.PI * 5) / 4, (Math.PI * 3) / 2, (Math.PI * 7) / 4];
  const colors = [0xffffff, 0xffffff, 0xf7fbff, 0xffffff, 0xffffff, 0xffffff, 0xf7fbff, 0xffffff];
  const tints = [0xd6e7ff, 0xbccfff, 0xd4f7ff, 0xd8c8ff, 0xd7e6ff, 0xc4d5ff, 0xcaf2ff, 0xd9c9ff];
  directions.forEach((angle, index) => {
    const streak = new THREE.Mesh(new THREE.PlaneGeometry(26, 0.1), streakMaterial.clone());
    streak.rotation.z = angle;
    streak.position.z = 0.18;
    streak.renderOrder = -1;
    streak.material.uniforms.uColor.value.set(colors[index]);
    streak.material.uniforms.uTint.value.set(tints[index]);
    streak.material.uniforms.uIntensity.value = 0;
    streakGroup.add(streak);
    streaks.push(streak);
  });
}

function updateLoadingDots() {
  loadingDotsEl.textContent = dotStates[dotIndex];
  dotIndex = (dotIndex + 1) % dotStates.length;
}

function startLoadingDots() {
  clearInterval(dotTimer);
  updateLoadingDots();
  dotTimer = setInterval(updateLoadingDots, 450);
}

function stopLoadingDots() {
  clearInterval(dotTimer);
  dotTimer = null;
  loadingDotsEl.textContent = '';
}

function bindEvents() {
  window.addEventListener('resize', onResize);

  replayButton.addEventListener('click', handleReplay);
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('pointermove', handlePointerMove);
}

function handleReplay() {
  resetLoading();
}

function handleKeydown(event) {
    if (event.key.toLowerCase() === 'r') {
      resetLoading();
    }
}

function handlePointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function resetLoading() {
  if (!scene) return;

  dotIndex = 0;
  depthValueEl.textContent = '0000M';
  loadingWordEl.textContent = 'Digging';
  loadingDotsEl.textContent = '';
  hudTopline.classList.remove('is-found');
  hudTopline.style.opacity = '0';
  hudTopline.style.transform = 'translateY(10px)';

  gem.visible = true;
  gem.scale.setScalar(0.22);
  if (gem.material.uniforms) {
    gem.material.uniforms.uExposure.value = 0.9;
    gem.material.uniforms.uLightStrength.value = 0;
  }
  gemKeyLight.intensity = 0;
  gemRimLight.intensity = 0;
  gemFillLight.intensity = 0;
  gemPointLight.intensity = 0;
  gemVioletLight.intensity = 0;
  bloomPass.strength = 0.3;
  bloomPass.threshold = 0.85;
  bloomPass.radius = 0.2;

  scene.rotation.x = 0;
  scene.rotation.y = 0;

  rocks.forEach((rock, index) => {
    rock.position.z = -4.2 + (index % 3) * 0.9;
    rock.userData.offset = Math.random() * 8;
  });

  const points = particles[0]?.geometry.attributes.position.array;
  if (points) {
    for (let i = 0; i < points.length; i += 3) {
      points[i + 1] = -6 + Math.random() * 12;
      points[i + 2] = (Math.random() - 0.5) * 10;
    }
    particles[0].geometry.attributes.position.needsUpdate = true;
  }

  renderer.setAnimationLoop(null);
  renderer.setAnimationLoop(animate);
  startLoadingDots();

  scene.userData.startTime = performance.now();
  scene.userData.introComplete = false;
}

function formatDepth(value) {
  return `${String(value).padStart(4, '0')}M`;
}

function updateLoading() {
  const elapsed = performance.now() - scene.userData.startTime;
  const t = clamp(elapsed / LOADING_DURATION, 0, 1);
  const progress = clamp(t, 0, 1);
  const depth = Math.round(getDepthForProgress(progress));

  depthValueEl.textContent = formatDepth(depth);

  if (progress > 0.02 && progress < 0.95) {
    hudTopline.style.opacity = String(clamp((progress - 0.02) / 0.12, 0, 1));
    hudTopline.style.transform = 'translateY(0)';
  }

  if (progress >= 0.95) {
    const foundFade = clamp((progress - 0.95) / 0.06, 0, 1);
    loadingWordEl.textContent = 'Found.';
    loadingDotsEl.textContent = '';
    hudTopline.classList.add('is-found');
    hudTopline.style.opacity = String(easeOutCubic(foundFade));
    hudTopline.style.transform = 'translateY(0)';
    stopLoadingDots();
  } else {
    loadingWordEl.textContent = 'Digging';
    hudTopline.classList.remove('is-found');
    if (!dotTimer) startLoadingDots();
  }

  const gemProgress = clamp((progress - config.gemRevealStart) / (config.gemRevealEnd - config.gemRevealStart), 0, 1);
  const gemGlow = easeInOutCubic(gemProgress);

  gem.visible = true;
  const gemScale = 0.22 + gemGlow * 0.78;
  gem.scale.setScalar(gemScale);
  gem.position.set(0, 0.18 + Math.sin(elapsed * 0.0018) * 0.18, -0.24 + (1 - gemGlow) * 0.6);
  gem.rotation.y += 0.08 * 0.016;
  gem.rotation.x = Math.sin(elapsed * 0.0011) * 0.4;
  const crystalReveal = clamp((progress - 0.3) / 0.7, 0, 1);
  const flareReveal = THREE.MathUtils.smoothstep(gemProgress, 0.62, 0.9);
  const bloomStrength = progress < 0.5
    ? 0
    : progress < 0.8
      ? easeInOutCubic((progress - 0.5) / 0.3) * 0.55
      : progress < 0.95
        ? 0.55 + easeInOutCubic((progress - 0.8) / 0.15) * 0.7
        : 1.15 + easeOutCubic((progress - 0.95) / 0.05) * 0.22;

  if (gem.material.uniforms) {
    gem.material.uniforms.uTime.value = elapsed * 0.001;
    gem.material.uniforms.uLightStrength.value = crystalReveal;
    gem.material.uniforms.uExposure.value = 1.0 + crystalReveal * 0.55;
  }
  const viewDirection = camera.position.clone().sub(gem.position).normalize();
  const facetNormals = [
    new THREE.Vector3(0.12, 0.82, 0.56),
    new THREE.Vector3(-0.58, 0.34, 0.74),
    new THREE.Vector3(0.68, -0.38, 0.62),
  ];
  const lightDirection = new THREE.Vector3(-0.35, 0.78, 0.48).normalize();
  const sparkleScore = facetNormals.reduce((score, facetNormal) => {
    const worldNormal = facetNormal.clone().applyEuler(gem.rotation).normalize();
    const reflectedDirection = new THREE.Vector3().reflect(viewDirection.clone().negate(), worldNormal).normalize();
    const viewScore = Math.pow(Math.max(worldNormal.dot(viewDirection), 0), 2.2);
    const lightScore = Math.pow(Math.max(reflectedDirection.dot(lightDirection), 0), 18);
    return Math.max(score, viewScore * 0.45 + lightScore * 0.9);
  }, 0);
  streaks.forEach((streak, index) => {
    const directionalPulse = 0.35 + 0.65 * Math.max(0, Math.sin(gem.rotation.y * 1.8 + index * 1.7));
    const burstGate = Math.min(1, Math.max(0, (sparkleScore - 0.16) * 2.8));
    const intensity = flareReveal * crystalReveal * burstGate * directionalPulse * 1.8;
    streak.material.uniforms.uIntensity.value = Math.min(1.35, intensity);
    streak.scale.x = 0.72 + intensity * 0.68;
    streak.rotation.z = [0, Math.PI / 4, Math.PI / 2, (Math.PI * 3) / 4, Math.PI, (Math.PI * 5) / 4, (Math.PI * 3) / 2, (Math.PI * 7) / 4][index] + gem.rotation.y * (index % 2 ? 0.12 : -0.08);
  });
  gemInner.material.emissiveIntensity = 0.01 + crystalReveal * 0.02;
  gemInner.rotation.y -= 0.03 * 0.016;
  gemInner.rotation.x = Math.cos(elapsed * 0.0014) * 0.2;

  gemKeyLight.intensity = 0.15 + crystalReveal * 2.1;
  gemRimLight.intensity = 0.25 + crystalReveal * 2.2;
  gemFillLight.intensity = 0.12 + crystalReveal * 1.4;
  gemPointLight.intensity = 0.08 + crystalReveal * 2.0;
  gemVioletLight.intensity = crystalReveal * 0.22;
  gemPointLight.position.x = Math.sin(elapsed * 0.0007) * 0.5;
  gemPointLight.position.y = -0.7 + Math.cos(elapsed * 0.0009) * 0.3;

  bloomPass.strength = Math.min(1.5, bloomStrength * 1.3);
  bloomPass.threshold = 0.45;
  bloomPass.radius = 0.75;

  gemNormalCamera.copy(camera);
  gemNormalCamera.updateMatrixWorld();
  gemNormalScene.position.copy(scene.position);
  gemNormalScene.rotation.copy(scene.rotation);
  gemBackMesh.visible = true;
  gemBackMesh.position.copy(gem.position);
  gemBackMesh.rotation.copy(gem.rotation);
  gemBackMesh.scale.copy(gem.scale);
  gemBackMesh.updateMatrixWorld();
  renderer.setRenderTarget(gemNormalTarget);
  renderer.render(gemNormalScene, gemNormalCamera);
  renderer.setRenderTarget(null);
  gemBackMesh.visible = false;

  const movementStrength = getMovementStrength(progress);
  const dustFactor = Math.max(0, 1 - progress * 0.9);

  rocks.forEach((rock) => {
    const localProgress = clamp((progress - 0.12 - rock.userData.moveDelay) / 0.82, 0, 1);
    const easedOpen = easeInOutCubic(localProgress);

    const startPos = rock.userData.startPosition;
    const targetPos = rock.userData.targetPosition;
    const startRot = rock.userData.startRotation;
    const targetRot = rock.userData.targetRotation;

    const driftX = Math.sin(elapsed * 0.0011 + rock.userData.phase) * (0.08 + rock.userData.moveStrength * 0.14);
    const driftY = Math.cos(elapsed * 0.0012 + rock.userData.phase) * (0.08 + rock.userData.moveStrength * 0.15);
    const driftZ = Math.sin(elapsed * 0.0009 + rock.userData.phase) * 0.18;

    rock.position.x = THREE.MathUtils.lerp(startPos.x, targetPos.x, easedOpen) + driftX;
    rock.position.y = THREE.MathUtils.lerp(startPos.y, targetPos.y, easedOpen) + driftY;
    rock.position.z = THREE.MathUtils.lerp(startPos.z, targetPos.z, easedOpen) + driftZ;

    rock.rotation.x = THREE.MathUtils.lerp(startRot.x, targetRot.x, easedOpen) + Math.sin(elapsed * 0.0007 + rock.userData.phase) * 0.12;
    rock.rotation.y = THREE.MathUtils.lerp(startRot.y, targetRot.y, easedOpen) + Math.cos(elapsed * 0.0008 + rock.userData.phase) * 0.12;
    rock.rotation.z = THREE.MathUtils.lerp(startRot.z, targetRot.z, easedOpen) + Math.sin(elapsed * 0.0006 + rock.userData.phase) * 0.1;

    const scaleFactor = rock.userData.baseScale * (0.96 + easedOpen * 0.3 + movementStrength * 0.18);
    rock.scale.setScalar(scaleFactor);
  });
  const positions = particles[0].geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] += 0.056 * movementStrength * (1.2 + dustFactor);
    positions[i + 2] += (Math.random() - 0.5) * 0.012;

    if (positions[i + 1] > 8) {
      positions[i + 1] = -8;
      positions[i] = (Math.random() - 0.5) * 15;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }
  }
  particles[0].geometry.attributes.position.needsUpdate = true;

  const targetX = pointer.x * 0.18;
  const targetY = pointer.y * 0.16;
  scene.rotation.x += (targetY - scene.rotation.x) * 0.04;
  scene.rotation.y += (targetX - scene.rotation.y) * 0.04;

  scene.position.y = -Math.sin(progress * Math.PI) * 0.18;

  if (progress >= 1) {
    depthValueEl.textContent = '1000M';
    hudTopline.style.opacity = '1';
    hudTopline.style.transform = 'translateY(0)';
    gemKeyLight.intensity = 1.1;
    gemRimLight.intensity = 1.2;
    gemFillLight.intensity = 0.7;
    gemVioletLight.intensity = 0.22;
    bloomPass.strength = 1.25;
    if (introMode) {
      if (!introComplete) {
        introComplete = true;
        scene.userData.introComplete = true;
        introCompleteCallback?.();
      }
      return;
    }
    scene.userData.startTime = performance.now();
  }
}

function updateRocks() {
  // Kept separate for clarity and later tweaks.
}

function updateParticles() {
  // Kept separate for clarity and later tweaks.
}

function updateGem() {
  // Kept separate for clarity and later tweaks.
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (gemNormalTarget) {
    gemNormalTarget.setSize(renderer.domElement.width, renderer.domElement.height);
    gemResolution.set(renderer.domElement.width, renderer.domElement.height);
  }
}

function animate() {
  if (!animationRunning) return;
  updateLoading();
  composer.render();
}

function cleanupDiggingIntro() {
  if (!renderer) return;

  animationRunning = false;
  renderer.setAnimationLoop(null);
  stopLoadingDots();
  window.removeEventListener('resize', onResize);
  replayButton?.removeEventListener('click', handleReplay);
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('pointermove', handlePointerMove);

  scene.traverse((object) => {
    if (!object.isMesh && !object.isPoints) return;
    object.geometry?.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material) => {
      if (!material) return;
      Object.values(material).forEach((value) => {
        if (value?.isTexture) value.dispose();
      });
      material.dispose();
    });
  });

  composer?.dispose();
  gemNormalTarget?.dispose();
  scene.environment?.dispose();
  renderer.dispose();
  canvas?.remove();
  scene = null;
  renderer = null;
  composer = null;
  gemNormalTarget = null;
}

if (document.querySelector('#scene') && !document.querySelector('#digging-intro')) startDiggingIntro();
