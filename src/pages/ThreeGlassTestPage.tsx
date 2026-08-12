import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

import './ThreeGlassTestPage.css';

const LIQUID_VERTEX_DEFORMATION = /* glsl */ `
uniform float uLiquidTime;

const vec3 LIQUID_SCALE = vec3(1.04, 1.12, 0.94);

float liquidRadiusAndGradient(vec3 direction, out vec3 gradient) {
  gradient = vec3(0.0);
  float radius = 1.0;
  float flowTime = uLiquidTime * 0.085;

  vec3 staticWaveA = vec3(1.35, -2.10, 1.15);
  float staticPhaseA = dot(direction, staticWaveA) + 0.60;
  radius += 0.080 * sin(staticPhaseA);
  gradient += 0.080 * cos(staticPhaseA) * staticWaveA;

  vec3 staticWaveB = vec3(-2.20, 0.85, 1.75);
  float staticPhaseB = dot(direction, staticWaveB) - 1.15;
  radius += 0.058 * sin(staticPhaseB);
  gradient += 0.058 * cos(staticPhaseB) * staticWaveB;

  vec3 staticWaveC = vec3(2.65, 1.55, -2.25);
  float staticPhaseC = dot(direction, staticWaveC) + 0.25;
  radius += 0.032 * cos(staticPhaseC);
  gradient -= 0.032 * sin(staticPhaseC) * staticWaveC;

  vec3 flowingWaveA = vec3(1.85, 2.40, -1.70);
  float flowingPhaseA = dot(direction, flowingWaveA) + flowTime;
  radius += 0.013 * sin(flowingPhaseA);
  gradient += 0.013 * cos(flowingPhaseA) * flowingWaveA;

  vec3 flowingWaveB = vec3(-2.45, 1.30, 2.05);
  float flowingPhaseB = dot(direction, flowingWaveB) + 1.20 - flowTime * 0.73;
  radius += 0.008 * cos(flowingPhaseB);
  gradient -= 0.008 * sin(flowingPhaseB) * flowingWaveB;

  return radius;
}

vec3 liquidPosition(vec3 sourcePosition) {
  vec3 direction = normalize(sourcePosition);
  vec3 gradient;
  float radialScale = liquidRadiusAndGradient(direction, gradient);

  return direction * length(sourcePosition) * radialScale * LIQUID_SCALE;
}

vec3 liquidNormal(vec3 sourcePosition) {
  vec3 direction = normalize(sourcePosition);
  vec3 gradient;
  float radialScale = liquidRadiusAndGradient(direction, gradient);
  vec3 surfaceGradient = gradient - direction * dot(gradient, direction);
  vec3 radialNormal = normalize(direction - surfaceGradient / radialScale);

  return normalize(radialNormal / LIQUID_SCALE);
}
`;

const createLiquidEnvironment = () => {
  const environmentScene = new RoomEnvironment();
  const reflectionColors = ['#8f65c5', '#c05d91', '#5b9da1', '#9b6fb4', '#b86f98', '#567f91'];
  let reflectionIndex = 0;

  environmentScene.traverse((object) => {
    if (object instanceof THREE.PointLight) {
      object.color.set('#aa78c5');
      object.intensity = 320;
      return;
    }

    if (!(object instanceof THREE.Mesh)) return;

    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material) => {
      if (material instanceof THREE.MeshLambertMaterial && material.emissiveIntensity > 0) {
        material.emissive.set(reflectionColors[reflectionIndex % reflectionColors.length]);
        material.emissiveIntensity *= 0.16;
        reflectionIndex += 1;
        return;
      }

      if (material instanceof THREE.MeshStandardMaterial) {
        material.color.set(object instanceof THREE.InstancedMesh ? '#29172f' : '#100a14');
        material.roughness = 0.82;
      }
    });
  });

  return environmentScene;
};

const ThreeGlassTestPage = () => {
  const sceneHostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sceneHost = sceneHostRef.current;
    if (!sceneHost) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    sceneHost.appendChild(renderer.domElement);

    const environment = createLiquidEnvironment();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const environmentTarget = pmremGenerator.fromScene(environment, 0.12);
    environment.dispose();
    scene.environment = environmentTarget.texture;

    const interactionGroup = new THREE.Group();
    scene.add(interactionGroup);

    const liquidUniforms = {
      uLiquidTime: { value: 0 },
    };
    const liquidGeometry = new THREE.SphereGeometry(1.24, 128, 96);
    liquidGeometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1.72);

    const liquidMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#f3eff8'),
      metalness: 0,
      roughness: 0.13,
      transmission: 0.89,
      thickness: 1.35,
      ior: 1.4,
      attenuationColor: new THREE.Color('#d8b8e0'),
      attenuationDistance: 7,
      clearcoat: 0.68,
      clearcoatRoughness: 0.19,
      iridescence: 0.06,
      iridescenceIOR: 1.25,
      iridescenceThicknessRange: [90, 180],
      dispersion: 0.035,
      envMapIntensity: 0.94,
      specularIntensity: 0.72,
    });
    liquidMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uLiquidTime = liquidUniforms.uLiquidTime;
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>\n${LIQUID_VERTEX_DEFORMATION}`,
        )
        .replace(
          '#include <beginnormal_vertex>',
          'vec3 objectNormal = liquidNormal(position);',
        )
        .replace(
          '#include <begin_vertex>',
          'vec3 transformed = liquidPosition(position);',
        );
    };
    liquidMaterial.customProgramCacheKey = () => 'liquid-glass-organic-v1';

    const liquidObject = new THREE.Mesh(liquidGeometry, liquidMaterial);
    liquidObject.rotation.set(0.1, -0.32, 0.035);
    interactionGroup.add(liquidObject);

    const ambientLight = new THREE.AmbientLight(0x33203b, 0.48);
    const hemisphereLight = new THREE.HemisphereLight(0x71517d, 0x150b19, 0.55);
    const violetLight = new THREE.RectAreaLight(0x9269d5, 7.2, 3.8, 5.4);
    const pinkLight = new THREE.RectAreaLight(0xd66b9b, 5.8, 3.6, 4.6);
    const cyanLight = new THREE.RectAreaLight(0x69b9bd, 2.4, 2.7, 3.4);

    violetLight.position.set(-4.2, 2.4, 3.8);
    pinkLight.position.set(4.1, -1.2, 3.1);
    cyanLight.position.set(1.6, 2.8, -3.6);
    violetLight.lookAt(0, 0, 0);
    pinkLight.lookAt(0, 0, 0);
    cyanLight.lookAt(0, 0, 0);
    scene.add(ambientLight, hemisphereLight, violetLight, pinkLight, cyanLight);

    const tiltXTo = gsap.quickTo(interactionGroup.rotation, 'x', {
      duration: 1.45,
      ease: 'power3.out',
    });
    const tiltYTo = gsap.quickTo(interactionGroup.rotation, 'y', {
      duration: 1.45,
      ease: 'power3.out',
    });

    let resetTimer: number | undefined;

    const resetInteraction = () => {
      window.clearTimeout(resetTimer);
      resetTimer = undefined;
      tiltXTo(0);
      tiltYTo(0);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || prefersReducedMotion) return;

      const bounds = sceneHost.getBoundingClientRect();
      const pointerX = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      const pointerY = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;

      tiltXTo(pointerY * 0.032);
      tiltYTo(pointerX * 0.044);

      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(resetInteraction, 260);
    };

    const resizeScene = () => {
      const width = Math.max(sceneHost.clientWidth, 1);
      const height = Math.max(sceneHost.clientHeight, 1);
      const aspect = width / height;
      const objectRadius = 1.42;
      const halfVerticalFov = THREE.MathUtils.degToRad(camera.fov * 0.5);
      const distanceForHeight = objectRadius / (0.52 * Math.tan(halfVerticalFov));
      const distanceForWidth = objectRadius / (0.54 * Math.tan(halfVerticalFov) * aspect);

      camera.aspect = aspect;
      camera.position.z = Math.max(distanceForHeight, distanceForWidth);
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
    };

    const resizeObserver = new ResizeObserver(resizeScene);
    resizeObserver.observe(sceneHost);
    resizeScene();

    sceneHost.addEventListener('pointermove', handlePointerMove, { passive: true });
    sceneHost.addEventListener('pointerleave', resetInteraction);
    window.addEventListener('blur', resetInteraction);

    const clock = new THREE.Clock();
    let elapsedTime = 0;
    let animationFrame = 0;

    const renderFrame = () => {
      const delta = Math.min(clock.getDelta(), 0.05);

      if (!prefersReducedMotion) {
        elapsedTime += delta;
        liquidUniforms.uLiquidTime.value = elapsedTime;
        liquidObject.rotation.y += delta * 0.036;
        liquidObject.rotation.x = 0.1 + Math.sin(elapsedTime * 0.11) * 0.018;
        liquidObject.rotation.z = 0.035 + Math.sin(elapsedTime * 0.075) * 0.012;
      }

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(resetTimer);
      resizeObserver.disconnect();
      sceneHost.removeEventListener('pointermove', handlePointerMove);
      sceneHost.removeEventListener('pointerleave', resetInteraction);
      window.removeEventListener('blur', resetInteraction);

      tiltXTo.tween.kill();
      tiltYTo.tween.kill();
      gsap.killTweensOf(interactionGroup.rotation);

      liquidGeometry.dispose();
      liquidMaterial.dispose();
      environmentTarget.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      scene.clear();

      if (renderer.domElement.parentNode === sceneHost) {
        sceneHost.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <main
      ref={sceneHostRef}
      className="three-glass-test"
      aria-label="보라색, 핑크색, 시안 빛을 은은하게 반사하는 3D Liquid Glass 오브젝트 테스트"
    />
  );
};

export default ThreeGlassTestPage;
