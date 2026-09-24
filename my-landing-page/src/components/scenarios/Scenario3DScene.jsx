// Scenario3DScene.jsx - Cinematic 3D Rescue Diorama
// Single shared WebGL canvas with reusable GLTF animal characters,
// three-quarter cinematic camera, realistic night lighting, and reactive safe zone.

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function Scenario3DScene({
  currentScenario,
  isConfirmed = false,
  isRecommendedSelected = false,
  selectedOption = null
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Mutable refs to control dynamic 3D reaction without re-mounting Three.js
  const sceneStateRef = useRef({
    scenarioId: currentScenario?.id || 'sc-1',
    animalType: currentScenario?.animalType || 'dog',
    isConfirmed,
    isRecommendedSelected,
    selectedOption
  });

  useEffect(() => {
    sceneStateRef.current = {
      scenarioId: currentScenario?.id || 'sc-1',
      animalType: currentScenario?.animalType || 'dog',
      isConfirmed,
      isRecommendedSelected,
      selectedOption
    };
  }, [currentScenario?.id, currentScenario?.animalType, isConfirmed, isRecommendedSelected, selectedOption]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let renderer = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch (err) {
      console.warn('WebGL init error in Scenario3DScene:', err);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= 768;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isMobile;

    const scene = new THREE.Scene();
    // Night atmospheric fog
    scene.fog = new THREE.FogExp2(0x1a1622, 0.045);

    // Camera setup - three-quarter cinematic perspective
    const baseCamPos = isMobile
      ? new THREE.Vector3(0.5, 3.8, 6.2)
      : new THREE.Vector3(0.8, 3.4, 5.8);
    const baseLookTarget = new THREE.Vector3(0, 0.45, 0);

    const camera = new THREE.PerspectiveCamera(
      32,
      container.clientWidth / container.clientHeight,
      0.1,
      60
    );
    camera.position.copy(baseCamPos);
    camera.lookAt(baseLookTarget);

    // Root diorama group for subtle rotation/floating
    const dioramaGroup = new THREE.Group();
    scene.add(dioramaGroup);

    // ── LIGHTING ────────────────────────────────────────────────────────────
    // 1. Cool night ambient fill
    const ambientLight = new THREE.AmbientLight(0x423d54, 1.2);
    scene.add(ambientLight);

    // 2. Warm golden Streetlamp key light
    const lampSpot = new THREE.SpotLight(0xffdf9e, 3.8, 12, Math.PI * 0.22, 0.45, 1.2);
    lampSpot.position.set(-1.8, 4.6, 0.2);
    lampSpot.target.position.set(-0.2, 0, 0);
    lampSpot.castShadow = !isMobile;
    lampSpot.shadow.mapSize.width = 1024;
    lampSpot.shadow.mapSize.height = 1024;
    lampSpot.shadow.bias = -0.0004;
    scene.add(lampSpot);
    scene.add(lampSpot.target);

    // 3. Subtle cool moonlight rim from behind
    const moonRim = new THREE.DirectionalLight(0x7a8db8, 1.1);
    moonRim.position.set(4, 5, -4);
    scene.add(moonRim);

    // 4. Amber Hazard Warning Blinker Light
    const hazardLight = new THREE.PointLight(0xff8c00, 0, 5, 2);
    hazardLight.position.set(2.4, 0.65, 0.8);
    dioramaGroup.add(hazardLight);

    // 5. Reactive Safe-Zone Uplight (soft emerald/amber when confirmed)
    const safeZoneLight = new THREE.PointLight(0x56d68b, 0, 4.5, 1.6);
    safeZoneLight.position.set(0.6, 0.8, 0.4);
    dioramaGroup.add(safeZoneLight);

    // ── DIORAMA BASE & ENVIRONMENT ──────────────────────────────────────────
    // Stylized floating miniature diorama block
    const baseGeom = new THREE.CylinderGeometry(3.6, 3.8, 0.4, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1f1b24,
      roughness: 0.85,
      metalness: 0.05
    });
    const dioramaBase = new THREE.Mesh(baseGeom, baseMat);
    dioramaBase.position.y = -0.2;
    dioramaBase.receiveShadow = true;
    dioramaGroup.add(dioramaBase);

    // Base Rim Trim in warm terracotta/copper
    const rimGeom = new THREE.TorusGeometry(3.65, 0.04, 12, 48);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x8a5840,
      roughness: 0.5,
      metalness: 0.2
    });
    const dioramaRim = new THREE.Mesh(rimGeom, rimMat);
    dioramaRim.rotation.x = Math.PI / 2;
    dioramaRim.position.y = 0.01;
    dioramaGroup.add(dioramaRim);

    // ── ROADSIDE SCENARIO PROPS (Scenario 1) ─────────────────────────────────
    const roadsideGroup = new THREE.Group();
    dioramaGroup.add(roadsideGroup);

    // 1. Asphalt Roadway & Concrete Sidewalk
    const roadGeom = new THREE.PlaneGeometry(6.2, 3.6);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x221e25,
      roughness: 0.92,
      metalness: 0.02
    });
    const roadMesh = new THREE.Mesh(roadGeom, roadMat);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.position.set(0, 0.01, 0.6);
    roadMesh.receiveShadow = true;
    roadsideGroup.add(roadMesh);

    // Dashed road center divider line
    const dividerGeom = new THREE.PlaneGeometry(5.8, 0.06);
    const dividerMat = new THREE.MeshBasicMaterial({
      color: 0xd6cbb8,
      transparent: true,
      opacity: 0.65
    });
    const dividerMesh = new THREE.Mesh(dividerGeom, dividerMat);
    dividerMesh.rotation.x = -Math.PI / 2;
    dividerMesh.position.set(0, 0.02, 1.35);
    roadsideGroup.add(dividerMesh);

    // Raised Sidewalk Curb
    const curbGeom = new THREE.BoxGeometry(6.4, 0.12, 1.4);
    const curbMat = new THREE.MeshStandardMaterial({
      color: 0x3d3540,
      roughness: 0.8
    });
    const curbMesh = new THREE.Mesh(curbGeom, curbMat);
    curbMesh.position.set(0, 0.06, -0.9);
    curbMesh.receiveShadow = true;
    roadsideGroup.add(curbMesh);

    // Grass patch on sidewalk
    const grassGeom = new THREE.PlaneGeometry(6.2, 0.85);
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x2b382d,
      roughness: 0.95
    });
    const grassMesh = new THREE.Mesh(grassGeom, grassMat);
    grassMesh.rotation.x = -Math.PI / 2;
    grassMesh.position.set(0, 0.125, -1.05);
    grassMesh.receiveShadow = true;
    roadsideGroup.add(grassMesh);

    // 2. Streetlamp Model
    const lampPostGeom = new THREE.CylinderGeometry(0.04, 0.05, 3.8, 14);
    const lampMetalMat = new THREE.MeshStandardMaterial({
      color: 0x484252,
      roughness: 0.45,
      metalness: 0.3
    });
    const lampPost = new THREE.Mesh(lampPostGeom, lampMetalMat);
    lampPost.position.set(-1.8, 1.9, -1.1);
    lampPost.castShadow = true;
    roadsideGroup.add(lampPost);

    // Curved lamp neck
    const lampArmGeom = new THREE.CylinderGeometry(0.035, 0.035, 0.9, 12);
    const lampArm = new THREE.Mesh(lampArmGeom, lampMetalMat);
    lampArm.rotation.z = -Math.PI * 0.32;
    lampArm.position.set(-1.5, 3.7, -1.1);
    roadsideGroup.add(lampArm);

    // Lamp head hood & glowing bulb
    const lampHeadGeom = new THREE.ConeGeometry(0.24, 0.22, 16);
    const lampHeadMesh = new THREE.Mesh(lampHeadGeom, lampMetalMat);
    lampHeadMesh.position.set(-1.18, 3.92, -1.1);
    roadsideGroup.add(lampHeadMesh);

    const bulbGeom = new THREE.SphereGeometry(0.09, 16, 16);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfff0c4 });
    const bulbMesh = new THREE.Mesh(bulbGeom, bulbMat);
    bulbMesh.position.set(-1.18, 3.82, -1.1);
    roadsideGroup.add(bulbMesh);

    // Volumetric Streetlamp light cone
    const coneGeom = new THREE.ConeGeometry(1.6, 4.0, 24, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0xffdf9e,
      transparent: true,
      opacity: 0.11,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const lightConeMesh = new THREE.Mesh(coneGeom, coneMat);
    lightConeMesh.position.set(-1.18, 1.95, -0.6);
    lightConeMesh.rotation.x = 0.14;
    roadsideGroup.add(lightConeMesh);

    // 3. Parked Vehicle on Roadside with Warning Blinkers
    const vehicleGroup = new THREE.Group();
    vehicleGroup.position.set(2.35, 0.02, 0.25);
    vehicleGroup.rotation.y = -Math.PI * 0.45;
    roadsideGroup.add(vehicleGroup);

    // Scooter Body
    const bikeBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.5, 1.2),
      new THREE.MeshStandardMaterial({ color: 0xd95a3f, roughness: 0.4 })
    );
    bikeBody.position.y = 0.38;
    bikeBody.castShadow = true;
    vehicleGroup.add(bikeBody);

    // Wheels
    const wheelGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.1, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1f1b20, roughness: 0.9 });
    const frontWheel = new THREE.Mesh(wheelGeom, wheelMat);
    frontWheel.rotation.z = Math.PI / 2;
    frontWheel.position.set(0, 0.18, 0.5);
    vehicleGroup.add(frontWheel);

    const backWheel = new THREE.Mesh(wheelGeom, wheelMat);
    backWheel.rotation.z = Math.PI / 2;
    backWheel.position.set(0, 0.18, -0.5);
    vehicleGroup.add(backWheel);

    // Handlebars
    const barGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.55, 10);
    const barMesh = new THREE.Mesh(barGeom, lampMetalMat);
    barMesh.position.set(0, 0.72, 0.35);
    vehicleGroup.add(barMesh);

    // Dual Amber Hazard Blinker Spheres on bike
    const blinkerGeom = new THREE.SphereGeometry(0.035, 8, 8);
    const blinkerMat = new THREE.MeshBasicMaterial({ color: 0xff9900 });
    const blinkerL = new THREE.Mesh(blinkerGeom, blinkerMat);
    blinkerL.position.set(-0.18, 0.45, -0.58);
    vehicleGroup.add(blinkerL);
    const blinkerR = new THREE.Mesh(blinkerGeom, blinkerMat);
    blinkerR.position.set(0.18, 0.45, -0.58);
    vehicleGroup.add(blinkerR);

    // 4. Safe Observation Area (3–5m zone arc on ground)
    const safeZoneGeom = new THREE.RingGeometry(0.7, 1.1, 32);
    const safeZoneMat = new THREE.MeshBasicMaterial({
      color: 0x48bb78,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const safeZoneMesh = new THREE.Mesh(safeZoneGeom, safeZoneMat);
    safeZoneMesh.rotation.x = -Math.PI / 2;
    safeZoneMesh.position.set(0.65, 0.03, -0.3);
    roadsideGroup.add(safeZoneMesh);

    // Safe zone dashed ring border
    const ringBorderGeom = new THREE.RingGeometry(1.08, 1.12, 32);
    const ringBorderMat = new THREE.MeshBasicMaterial({
      color: 0x48bb78,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const safeRingBorder = new THREE.Mesh(ringBorderGeom, ringBorderMat);
    safeRingBorder.rotation.x = -Math.PI / 2;
    safeRingBorder.position.set(0.65, 0.032, -0.3);
    roadsideGroup.add(safeRingBorder);

    // ── ANIMAL CHARACTERS (GLTF Models) ─────────────────────────────────────
    const animalAnchor = new THREE.Group();
    // Vulnerable position on road near curb & light cone
    animalAnchor.position.set(-0.7, 0.04, 0.35);
    animalAnchor.rotation.y = Math.PI * 0.22;
    dioramaGroup.add(animalAnchor);

    // Subtle dark contact shadow beneath animal
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(15, 10, 18, 0.7)');
    grad.addColorStop(0.5, 'rgba(20, 15, 25, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = grad;
    sCtx.beginPath();
    sCtx.arc(64, 64, 64, 0, Math.PI * 2);
    sCtx.fill();
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);

    const contactShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.85, 0.65),
      new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.85,
        depthWrite: false
      })
    );
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.set(0, 0.01, 0);
    animalAnchor.add(contactShadow);

    const gltfLoader = new GLTFLoader();
    let dogModel = null;
    let dogBones = {};
    let catModel = null;
    let catBones = {};

    // Load Shiba Dog for dog scenarios
    gltfLoader.load(
      '/assets/models/shiba_dog.glb',
      (gltf) => {
        dogModel = gltf.scene;
        dogModel.scale.setScalar(0.72);
        dogModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = !isMobile;
            child.receiveShadow = true;
            if (child.material) {
              child.material.roughness = 0.65;
              child.material.metalness = 0.0;
              if (child.material.map) {
                child.material.map.colorSpace = THREE.SRGBColorSpace;
              }
              child.material.needsUpdate = true;
            }
          }
          if (child.isBone) {
            child.userData.origRot = child.rotation.clone();
            dogBones[child.name] = child;
          }
        });
        const activeType = sceneStateRef.current.animalType || 'dog';
        dogModel.visible = activeType === 'dog';
        animalAnchor.add(dogModel);
      },
      undefined,
      (err) => console.warn('Could not load shiba_dog.glb in Scenario3D:', err)
    );

    // Load Tabby Cat for cat scenarios
    gltfLoader.load(
      '/assets/models/tabby_cat.glb',
      (gltf) => {
        catModel = gltf.scene;
        catModel.scale.setScalar(0.70);
        catModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = !isMobile;
            child.receiveShadow = true;
            if (child.material) {
              child.material.roughness = 0.65;
              child.material.metalness = 0.0;
              if (child.material.map) {
                child.material.map.colorSpace = THREE.SRGBColorSpace;
              }
              child.material.needsUpdate = true;
            }
          }
          if (child.isBone) {
            child.userData.origRot = child.rotation.clone();
            catBones[child.name] = child;
          }
        });
        const activeType = sceneStateRef.current.animalType || 'dog';
        catModel.visible = activeType === 'cat';
        animalAnchor.add(catModel);
      },
      undefined,
      (err) => console.warn('Could not load tabby_cat.glb in Scenario3D:', err)
    );

    // ── DISTANT BACKGROUND PARTICLES & VEHICLE LIGHTS ───────────────────────
    // Distant traffic light streaks
    const trafficGeom = new THREE.BufferGeometry();
    const trafficCount = 12;
    const trafficPositions = new Float32Array(trafficCount * 3);
    for (let i = 0; i < trafficCount; i++) {
      trafficPositions[i * 3 + 0] = (Math.random() - 0.5) * 8;
      trafficPositions[i * 3 + 1] = 0.4 + Math.random() * 0.2;
      trafficPositions[i * 3 + 2] = 2.4 + Math.random() * 1.5;
    }
    trafficGeom.setAttribute('position', new THREE.BufferAttribute(trafficPositions, 3));
    const trafficMat = new THREE.PointsMaterial({
      size: 0.12,
      color: 0xffaa55,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const trafficPoints = new THREE.Points(trafficGeom, trafficMat);
    scene.add(trafficPoints);

    // ── POINTER PARALLAX ───────────────────────────────────────────────────
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;

    const onPointerMove = (e) => {
      if (prefersReducedMotion) return;
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.5;
      targetMouseX = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width * 0.5)));
      targetMouseY = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height * 0.5)));
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const handleResize = () => {
      if (!renderer || !container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ── ANIMATION & RENDERING LOOP ─────────────────────────────────────────
    let clock = new THREE.Clock();
    let animId = null;
    let isSceneVisible = false;

    const requestRender = () => {
      if (animId === null && isSceneVisible && !document.hidden) {
        clock.start();
        animId = requestAnimationFrame(render);
      }
    };

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isSceneVisible = entry.isIntersecting;
      if (isSceneVisible) requestRender();
      else if (animId !== null) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    }, { threshold: 0.04 });
    visibilityObserver.observe(container);

    const onVisibilityChange = () => {
      if (document.hidden && animId !== null) {
        cancelAnimationFrame(animId);
        animId = null;
      } else {
        requestRender();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    function render() {
      animId = null;
      if (!isSceneVisible || document.hidden) return;
      animId = requestAnimationFrame(render);
      const t = clock.getElapsedTime();
      const state = sceneStateRef.current;

      // Pointer parallax damping
      if (!prefersReducedMotion) {
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;
      }

      // 1. Subtle camera breathing & parallax
      const camParallaxX = mouseX * 0.22;
      const camParallaxY = -mouseY * 0.15;
      const camDrift = prefersReducedMotion ? 0 : Math.sin(t * 0.6) * 0.02;

      // Focus transition: when confirmed, smoothly ease camera slightly closer to safe zone
      const targetCamY = state.isConfirmed ? baseCamPos.y - 0.25 : baseCamPos.y;
      const targetCamZ = state.isConfirmed ? baseCamPos.z - 0.35 : baseCamPos.z;

      camera.position.x += (baseCamPos.x + camParallaxX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY + camParallaxY + camDrift - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;

      const currentLookX = state.isConfirmed ? 0.2 : baseLookTarget.x;
      camera.lookAt(currentLookX, baseLookTarget.y, baseLookTarget.z);

      // 2. Ambient Hazard Warning Light Blinker on vehicle
      const hazardBlink = Math.sin(t * 7.5) > 0.1;
      hazardLight.intensity = THREE.MathUtils.lerp(
        hazardLight.intensity,
        hazardBlink ? 2.4 : 0.1,
        0.3
      );
      blinkerMat.color.setHex(hazardBlink ? 0xffaa00 : 0x553300);

      // 3. Reactive Safe Observation Zone Feedback
      if (state.isConfirmed) {
        const isRec = state.isRecommendedSelected;
        const targetColor = isRec ? 0x48bb78 : 0xffa040;
        safeZoneMat.color.setHex(targetColor);
        safeRingBorder.material.color.setHex(targetColor);

        // Smoothly illuminate safe zone
        const targetOpacity = isRec ? 0.35 + Math.sin(t * 3) * 0.08 : 0.22;
        safeZoneMat.opacity += (targetOpacity - safeZoneMat.opacity) * 0.08;
        safeRingBorder.material.opacity = safeZoneMat.opacity * 2.2;
        safeZoneLight.intensity += (isRec ? 1.8 : 0.8 - safeZoneLight.intensity) * 0.08;
        safeZoneLight.color.setHex(targetColor);
      } else {
        safeZoneMat.opacity += (0.12 - safeZoneMat.opacity) * 0.08;
        safeRingBorder.material.opacity = 0.25;
        safeZoneLight.intensity += (0 - safeZoneLight.intensity) * 0.08;
      }

      // 4. Animal Organic Idle & Dynamic Model Switching
      const activeType = state.animalType || 'dog';
      if (dogModel) dogModel.visible = activeType === 'dog';
      if (catModel) catModel.visible = activeType === 'cat';

      const activeModel = activeType === 'dog' ? dogModel : catModel;
      const activeBones = activeType === 'dog' ? dogBones : catBones;
      const baseScale = activeType === 'dog' ? 0.72 : 0.70;

      if (activeModel && activeModel.visible) {
        const isCalmer = state.isConfirmed && state.isRecommendedSelected;
        // Breathing rate calms down when recommended choice is confirmed
        const breathRate = isCalmer ? 1.6 : 2.8;
        const breathAmp = isCalmer ? 0.008 : 0.014;
        const breath = Math.sin(t * breathRate) * breathAmp;
        activeModel.scale.set(baseScale + breath, baseScale + breath * 1.2, baseScale + breath);

        // Subtle head movement
        if (activeBones['Head'] && activeBones['Head'].userData.origRot) {
          const o = activeBones['Head'].userData.origRot;
          const headWobble = isCalmer
            ? Math.sin(t * 1.2) * 0.02
            : Math.sin(t * 2.2) * 0.045 + (Math.random() < 0.01 ? 0.05 : 0);
          activeBones['Head'].rotation.y = o.y + headWobble + mouseX * 0.1;
          activeBones['Head'].rotation.x = o.x - (isCalmer ? 0.02 : 0.06);
        }

        // Tail wag when comforted
        if (activeBones['Tail'] && activeBones['Tail'].userData.origRot) {
          const o = activeBones['Tail'].userData.origRot;
          const tailSpeed = isCalmer ? 5.5 : 1.2;
          const tailAmp = isCalmer ? 0.22 : 0.05;
          activeBones['Tail'].rotation.y = o.y + Math.sin(t * tailSpeed) * tailAmp;
        }
      }

      // 5. Subtle slow streetlamp flicker (analog warmth)
      lampSpot.intensity = 3.8 + Math.sin(t * 1.4) * 0.12 + (Math.random() < 0.005 ? -0.3 : 0);

      renderer.render(scene, camera);
    }

    requestRender();

    // ── CLEANUP ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      visibilityObserver.disconnect();

      try {
        shadowTexture.dispose();
        scene.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
            else obj.material.dispose();
          }
        });
        renderer.dispose();
      } catch (e) {
        console.warn('Scenario3DScene cleanup error:', e);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="scenario-3d-viewport-wrap"
      aria-label="Khung nhìn mô phỏng không gian cứu hộ 3D thực tế"
    >
      <canvas ref={canvasRef} className="scenario-3d-canvas" />

      {/* Subtle Cinematic Vignette Veil */}
      <div className="scenario-3d-vignette" aria-hidden="true" />

      {/* Minimal Context Pill */}
      <div className="scenario-3d-status-pill">
        <span className="status-live-dot" />
        <span>Quan sát hiện trường 3D</span>
      </div>
    </div>
  );
}
