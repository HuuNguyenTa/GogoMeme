// Scenario3DScene.jsx - Cinematic 3D Rescue Diorama
// Single shared WebGL canvas with reusable GLTF animal characters,
// three-quarter cinematic camera, realistic night lighting, and reactive safe zone.

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function Scenario3DScene({
  currentScenario,
  theme = 'day',
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
    theme,
    isConfirmed,
    isRecommendedSelected,
    selectedOption
  });

  useEffect(() => {
    sceneStateRef.current = {
      scenarioId: currentScenario?.id || 'sc-1',
      animalType: currentScenario?.animalType || 'dog',
      theme,
      isConfirmed,
      isRecommendedSelected,
      selectedOption
    };
  }, [currentScenario?.id, currentScenario?.animalType, theme, isConfirmed, isRecommendedSelected, selectedOption]);

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
    let themeMix = sceneStateRef.current.theme === 'night' ? 1 : 0;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = themeMix ? 1.2 : 1.32;
    renderer.shadowMap.enabled = !isMobile;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(themeMix ? 0x182238 : 0xc6e1e7);
    scene.fog = new THREE.FogExp2(themeMix ? 0x20283e : 0xd4e7e7, themeMix ? 0.035 : 0.026);

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
    // Broad fill keeps faces and rescue props readable in both themes.
    const ambientLight = new THREE.AmbientLight(themeMix ? 0x91a6d8 : 0xfff3dc, themeMix ? 1.55 : 1.85);
    scene.add(ambientLight);

    const skyFill = new THREE.HemisphereLight(
      themeMix ? 0x8fa8df : 0xdff5ff,
      themeMix ? 0x3d3449 : 0x8b785c,
      themeMix ? 1.2 : 1.65
    );
    scene.add(skyFill);

    const animalFill = new THREE.DirectionalLight(themeMix ? 0xc7d8ff : 0xffecd0, themeMix ? 1.7 : 2.05);
    animalFill.position.set(1.5, 3.8, 4.8);
    scene.add(animalFill);

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
    const moonRim = new THREE.DirectionalLight(themeMix ? 0x9bb8ff : 0xffd6a3, themeMix ? 1.65 : 1.2);
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
    // A soft celestial layer turns into moonlight and fireflies at night.
    const makeRadialTexture = (stops) => {
      const textureCanvas = document.createElement('canvas');
      textureCanvas.width = textureCanvas.height = 128;
      const context = textureCanvas.getContext('2d');
      const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
      stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
      context.fillStyle = gradient;
      context.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(textureCanvas);
    };

    const moonTexture = makeRadialTexture([
      [0, 'rgba(255, 252, 225, 1)'],
      [0.34, 'rgba(244, 247, 220, 0.96)'],
      [0.52, 'rgba(196, 218, 255, 0.38)'],
      [1, 'rgba(150, 190, 255, 0)']
    ]);
    const moonMaterial = new THREE.SpriteMaterial({
      map: moonTexture,
      color: 0xe8f1ff,
      transparent: true,
      opacity: themeMix,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const moonSprite = new THREE.Sprite(moonMaterial);
    moonSprite.position.set(1.65, 2.42, -1.65);
    moonSprite.scale.set(0.82, 0.82, 1);
    scene.add(moonSprite);

    const starPositions = new Float32Array([
      -3.3, 3.5, -3.1, -2.7, 2.8, -3.3, -1.9, 3.75, -3.2,
      -1.0, 3.15, -3.5, -0.2, 3.85, -3.4, 0.7, 3.35, -3.3,
      1.45, 3.7, -3.1, 2.15, 2.65, -3.3, 3.25, 3.55, -3.2,
      -3.6, 2.25, -3.0, 3.6, 2.35, -3.0
    ]);
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      size: 0.055,
      color: 0xd9e8ff,
      transparent: true,
      opacity: themeMix * 0.68,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    scene.add(new THREE.Points(starGeometry, starMaterial));

    // The same lightweight particle system reads as pollen by day and fireflies by night.
    const fireflyTexture = makeRadialTexture([
      [0, 'rgba(255, 255, 220, 1)'],
      [0.25, 'rgba(255, 238, 120, 0.9)'],
      [0.58, 'rgba(210, 245, 105, 0.3)'],
      [1, 'rgba(210, 245, 105, 0)']
    ]);
    const fireflyCount = isMobile ? 12 : 22;
    const fireflyPositions = new Float32Array(fireflyCount * 3);
    const fireflyOrigins = new Float32Array(fireflyCount * 3);
    const fireflyPhases = new Float32Array(fireflyCount);
    for (let i = 0; i < fireflyCount; i += 1) {
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (1.15 + ((i * 0.47) % 1.65));
      const y = 0.32 + ((i * 0.31) % 1.2);
      const z = -1.15 + ((i * 0.53) % 2.25);
      fireflyPositions.set([x, y, z], i * 3);
      fireflyOrigins.set([x, y, z], i * 3);
      fireflyPhases[i] = i * 0.83;
    }
    const fireflyGeometry = new THREE.BufferGeometry();
    fireflyGeometry.setAttribute('position', new THREE.BufferAttribute(fireflyPositions, 3));
    const fireflyMaterial = new THREE.PointsMaterial({
      size: 0.13,
      map: fireflyTexture,
      color: themeMix ? 0xffef86 : 0xfff1c4,
      transparent: true,
      opacity: themeMix ? 0.78 : 0.16,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const fireflies = new THREE.Points(fireflyGeometry, fireflyMaterial);
    dioramaGroup.add(fireflies);

    // Low-poly trees and grass frame the action without covering rescue props.
    const scenicNatureGroup = new THREE.Group();
    dioramaGroup.add(scenicNatureGroup);
    const treeTrunkMaterial = new THREE.MeshStandardMaterial({ color: 0x70513d, roughness: 0.96 });
    const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x547a56, roughness: 0.95 });
    const foliageLightMaterial = new THREE.MeshStandardMaterial({ color: 0x73986a, roughness: 0.95 });
    const grassBladeMaterial = new THREE.MeshStandardMaterial({ color: 0x668b56, roughness: 1 });

    const addTree = (x, z, scale, lean = 0) => {
      const tree = new THREE.Group();
      tree.position.set(x, 0.02, z);
      tree.scale.setScalar(scale);
      tree.rotation.z = lean;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.16, 1.55, 9), treeTrunkMaterial);
      trunk.position.y = 0.72;
      trunk.castShadow = !isMobile;
      tree.add(trunk);
      [[0, 1.45, 0], [-0.32, 1.28, 0.02], [0.3, 1.25, -0.04], [0.05, 1.72, -0.02]].forEach(([cx, cy, cz], index) => {
        const crown = new THREE.Mesh(
          new THREE.IcosahedronGeometry(index === 3 ? 0.43 : 0.52, 1),
          index % 2 ? foliageLightMaterial : foliageMaterial
        );
        crown.position.set(cx, cy, cz);
        crown.castShadow = !isMobile;
        tree.add(crown);
      });
      scenicNatureGroup.add(tree);
    };
    addTree(-2.85, -1.5, 0.82, -0.025);
    addTree(2.82, -1.55, 0.72, 0.02);

    const bushGeometry = new THREE.IcosahedronGeometry(0.38, 1);
    [[-2.65, -0.25, 1], [2.7, -0.35, 0.86], [-2.35, 1.05, 0.72], [2.5, 1.05, 0.68]].forEach(([x, z, scale], index) => {
      const bush = new THREE.Mesh(bushGeometry, index % 2 ? foliageLightMaterial : foliageMaterial);
      bush.position.set(x, 0.25 * scale, z);
      bush.scale.set(scale * 1.18, scale * 0.72, scale);
      bush.castShadow = !isMobile;
      scenicNatureGroup.add(bush);
    });

    [[-2.45, 0.8], [-2.05, 1.22], [2.22, 0.92], [2.72, 0.55], [-2.72, -0.65], [2.55, -0.8]].forEach(([x, z], clusterIndex) => {
      for (let bladeIndex = 0; bladeIndex < 5; bladeIndex += 1) {
        const blade = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.34 + bladeIndex * 0.025, 5), grassBladeMaterial);
        blade.position.set(x + bladeIndex * 0.055, 0.17, z + (bladeIndex % 2) * 0.035);
        blade.rotation.z = (bladeIndex - 2) * 0.11 + clusterIndex * 0.01;
        scenicNatureGroup.add(blade);
      }
    });

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

    // Each scenario owns a complete environment. All environments stay mounted so
    // moving between questions only toggles groups instead of rebuilding WebGL.
    const cardboardGroup = new THREE.Group();
    const chainedDogGroup = new THREE.Group();
    const rooftopGroup = new THREE.Group();
    dioramaGroup.add(cardboardGroup, chainedDogGroup, rooftopGroup);

    const makeStandardMaterial = (color, options = {}) => new THREE.MeshStandardMaterial({
      color,
      roughness: options.roughness ?? 0.82,
      metalness: options.metalness ?? 0.02,
      transparent: options.transparent ?? false,
      opacity: options.opacity ?? 1,
      side: options.side ?? THREE.FrontSide
    });

    const addBox = (group, size, position, material, rotation = null) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
      mesh.position.set(...position);
      if (rotation) mesh.rotation.set(...rotation);
      mesh.castShadow = !isMobile;
      mesh.receiveShadow = true;
      group.add(mesh);
      return mesh;
    };

    const addCylinder = (group, radiusTop, radiusBottom, height, position, material, radialSegments = 16) => {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments),
        material
      );
      mesh.position.set(...position);
      mesh.castShadow = !isMobile;
      mesh.receiveShadow = true;
      group.add(mesh);
      return mesh;
    };

    // ── SCENARIO 2: NEWBORN KITTEN IN A CARDBOARD BOX ───────────────────────
    const alleyFloorMat = makeStandardMaterial(0x242129, { roughness: 0.96 });
    const alleyFloor = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 3.7), alleyFloorMat);
    alleyFloor.rotation.x = -Math.PI / 2;
    alleyFloor.position.y = 0.015;
    alleyFloor.receiveShadow = true;
    cardboardGroup.add(alleyFloor);

    const wallMat = makeStandardMaterial(0x302b35, { roughness: 0.95 });
    addBox(cardboardGroup, [6.2, 2.8, 0.16], [0, 1.38, -1.72], wallMat);
    addBox(cardboardGroup, [0.16, 2.1, 3.2], [-3.02, 1.02, -0.15], wallMat);

    // Stable open carton: every flap rotates from a real hinge on its wall,
    // preventing the overlapping faces and detached lids of the old model.
    const cartonMat = makeStandardMaterial(0x9b6841, { roughness: 0.94 });
    const cartonDarkMat = makeStandardMaterial(0x4a3024, { roughness: 1 });
    const carton = new THREE.Group();
    carton.position.set(-0.55, 0.03, 0.05);
    carton.rotation.y = -0.04;
    cardboardGroup.add(carton);

    const cartonWidth = 1.88;
    const cartonDepth = 1.3;
    const cartonWallHeight = 0.7;
    const cartonThickness = 0.075;
    const cartonHalfWidth = cartonWidth / 2;
    const cartonHalfDepth = cartonDepth / 2;
    const cartonFloor = addBox(carton, [cartonWidth, 0.1, cartonDepth], [0, 0.05, 0], cartonDarkMat);
    cartonFloor.castShadow = false;

    // Lower camera-facing wall keeps the kitten visible while the other three
    // walls retain the recognizable depth of a real cardboard box.
    const frontWallHeight = 0.46;
    addBox(carton, [cartonWidth, frontWallHeight, cartonThickness], [0, frontWallHeight / 2 + 0.08, cartonHalfDepth], cartonMat);
    addBox(carton, [cartonWidth, cartonWallHeight, cartonThickness], [0, cartonWallHeight / 2 + 0.08, -cartonHalfDepth], cartonMat);
    addBox(carton, [cartonThickness, cartonWallHeight, cartonDepth - cartonThickness * 2], [-cartonHalfWidth, cartonWallHeight / 2 + 0.08, 0], cartonMat);
    addBox(carton, [cartonThickness, cartonWallHeight, cartonDepth - cartonThickness * 2], [cartonHalfWidth, cartonWallHeight / 2 + 0.08, 0], cartonMat);

    const addHingedFlap = ({ size, hinge, offset, rotation }) => {
      const pivot = new THREE.Group();
      pivot.position.set(...hinge);
      pivot.rotation.set(...rotation);
      carton.add(pivot);
      const flap = new THREE.Mesh(new THREE.BoxGeometry(...size), cartonMat);
      flap.position.set(...offset);
      flap.castShadow = !isMobile;
      flap.receiveShadow = true;
      pivot.add(flap);
    };

    const longFlapDepth = 0.56;
    addHingedFlap({
      size: [cartonWidth, 0.055, longFlapDepth],
      hinge: [0, frontWallHeight + 0.08, cartonHalfDepth],
      offset: [0, 0, longFlapDepth / 2],
      rotation: [-0.34, 0, 0]
    });
    addHingedFlap({
      size: [cartonWidth, 0.055, longFlapDepth],
      hinge: [0, cartonWallHeight + 0.08, -cartonHalfDepth],
      offset: [0, 0, -longFlapDepth / 2],
      rotation: [0.42, 0, 0]
    });

    const sideFlapWidth = 0.54;
    addHingedFlap({
      size: [sideFlapWidth, 0.055, cartonDepth - 0.08],
      hinge: [-cartonHalfWidth, cartonWallHeight + 0.08, 0],
      offset: [-sideFlapWidth / 2, 0, 0],
      rotation: [0, 0, -0.5]
    });
    addHingedFlap({
      size: [sideFlapWidth, 0.055, cartonDepth - 0.08],
      hinge: [cartonHalfWidth, cartonWallHeight + 0.08, 0],
      offset: [sideFlapWidth / 2, 0, 0],
      rotation: [0, 0, 0.5]
    });

    const towelMat = makeStandardMaterial(0xc99c83, { roughness: 1 });
    const towel = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 0.78, 7, 5), towelMat);
    towel.rotation.x = -Math.PI / 2;
    towel.position.set(0, 0.115, 0);
    carton.add(towel);

    // A classic rubber hot-water bottle makes the recommended action instantly
    // recognizable. The cream towel only covers its middle so the neck, stopper,
    // rounded shoulders and ribbed body remain easy to read at a small scale.
    const bottleGroup = new THREE.Group();
    bottleGroup.position.set(1.38, 0.06, 0.34);
    bottleGroup.rotation.set(-0.05, -0.16, -0.08);
    bottleGroup.visible = false;
    cardboardGroup.add(bottleGroup);

    const hotBottleMat = makeStandardMaterial(0x3f9188, { roughness: 0.66 });
    const hotBottleRibMat = makeStandardMaterial(0x286d69, { roughness: 0.72 });
    const bottleCapMat = makeStandardMaterial(0xf2c77f, { roughness: 0.58 });
    const bottleTowelMat = makeStandardMaterial(0xf4e5cb, { roughness: 0.98 });
    const bottleTowelEdgeMat = makeStandardMaterial(0xd9bea0, { roughness: 1 });

    const bottleShape = new THREE.Shape();
    bottleShape.moveTo(-0.27, 0.02);
    bottleShape.quadraticCurveTo(-0.35, 0.05, -0.34, 0.16);
    bottleShape.lineTo(-0.3, 0.54);
    bottleShape.quadraticCurveTo(-0.28, 0.63, -0.13, 0.68);
    bottleShape.lineTo(-0.1, 0.79);
    bottleShape.lineTo(0.1, 0.79);
    bottleShape.lineTo(0.13, 0.68);
    bottleShape.quadraticCurveTo(0.28, 0.63, 0.3, 0.54);
    bottleShape.lineTo(0.34, 0.16);
    bottleShape.quadraticCurveTo(0.35, 0.05, 0.27, 0.02);
    bottleShape.quadraticCurveTo(0, -0.03, -0.27, 0.02);

    const bottleBodyGeometry = new THREE.ExtrudeGeometry(bottleShape, {
      depth: 0.16,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.025,
      bevelThickness: 0.025,
      curveSegments: 12
    });
    bottleBodyGeometry.translate(0, 0, -0.08);
    const bottleBody = new THREE.Mesh(bottleBodyGeometry, hotBottleMat);
    bottleBody.castShadow = !isMobile;
    bottleBody.receiveShadow = true;
    bottleGroup.add(bottleBody);

    // Horizontal rubber ribs visually separate the bottle from a carton or can.
    [
      { y: 0.18, length: 0.44 },
      { y: 0.3, length: 0.5 },
      { y: 0.42, length: 0.48 },
      { y: 0.54, length: 0.4 }
    ].forEach(({ y, length }) => {
      const rib = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.014, length, 3, 8),
        hotBottleRibMat
      );
      rib.position.set(0, y, 0.115);
      rib.rotation.z = Math.PI / 2;
      rib.castShadow = !isMobile;
      bottleGroup.add(rib);
    });

    // A large ribbed screw cap gives the prop a familiar hot-water-bottle silhouette.
    const stopper = addCylinder(bottleGroup, 0.13, 0.13, 0.13, [0, 0.855, 0], bottleCapMat, 20);
    [0.805, 0.855, 0.905].forEach((y) => {
      const capRidge = new THREE.Mesh(
        new THREE.TorusGeometry(0.135, 0.012, 6, 20),
        bottleTowelEdgeMat
      );
      capRidge.position.set(0, y, 0);
      capRidge.rotation.x = Math.PI / 2;
      capRidge.castShadow = !isMobile;
      bottleGroup.add(capRidge);
    });
    stopper.castShadow = !isMobile;

    // Soft towel band with stitched edges, wrapped around the warm (not hot) bottle.
    const towelWrap = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.115, 0.43, 5, 10),
      bottleTowelMat
    );
    towelWrap.position.set(0, 0.3, 0.13);
    towelWrap.rotation.z = Math.PI / 2;
    towelWrap.scale.z = 0.72;
    towelWrap.castShadow = !isMobile;
    bottleGroup.add(towelWrap);

    [0.205, 0.395].forEach((y) => {
      const towelSeam = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.012, 0.42, 3, 8),
        bottleTowelEdgeMat
      );
      towelSeam.position.set(0, y, 0.225);
      towelSeam.rotation.z = Math.PI / 2;
      bottleGroup.add(towelSeam);
    });

    const warmthMat = new THREE.MeshBasicMaterial({
      color: 0xffb35c,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const warmthAura = new THREE.Mesh(new THREE.RingGeometry(0.48, 0.86, 32), warmthMat);
    warmthAura.rotation.x = -Math.PI / 2;
    warmthAura.position.set(-0.55, 0.16, 0.03);
    cardboardGroup.add(warmthAura);

    // ── SCENARIO 3: DEHYDRATED DOG CHAINED IN AN EMPTY LOT ─────────────────
    const dirtMat = makeStandardMaterial(0x4a3a2d, { roughness: 1 });
    const dirt = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 3.7), dirtMat);
    dirt.rotation.x = -Math.PI / 2;
    dirt.position.y = 0.015;
    dirt.receiveShadow = true;
    chainedDogGroup.add(dirt);

    // Fence line and a heavy tether post communicate confinement immediately.
    const fenceMat = makeStandardMaterial(0x5f554d, { roughness: 0.65, metalness: 0.45 });
    [-2.7, -1.35, 0, 1.35, 2.7].forEach((x) => {
      addCylinder(chainedDogGroup, 0.045, 0.06, 1.65, [x, 0.82, -1.42], fenceMat, 10);
    });
    [0.45, 0.95, 1.45].forEach((y) => {
      addBox(chainedDogGroup, [5.55, 0.025, 0.025], [0, y, -1.42], fenceMat);
    });
    const tetherPost = addCylinder(chainedDogGroup, 0.09, 0.13, 1.25, [-1.85, 0.62, -0.48], fenceMat, 12);
    tetherPost.rotation.z = -0.04;

    const chainCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.82, 0.48, -0.46),
      new THREE.Vector3(-1.3, 0.2, -0.1),
      new THREE.Vector3(-0.72, 0.08, 0.26),
      new THREE.Vector3(-0.3, 0.24, 0.38)
    ]);
    const chainMesh = new THREE.Mesh(
      new THREE.TubeGeometry(chainCurve, 36, 0.025, 8, false),
      makeStandardMaterial(0x8a8175, { roughness: 0.42, metalness: 0.7 })
    );
    chainMesh.castShadow = !isMobile;
    chainedDogGroup.add(chainMesh);

    const makeBowl = (position, color) => {
      const bowl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.34, 0.24, 0.16, 24, 1, true),
        makeStandardMaterial(color, { roughness: 0.5, metalness: 0.2, side: THREE.DoubleSide })
      );
      bowl.position.set(...position);
      bowl.receiveShadow = true;
      chainedDogGroup.add(bowl);
      return bowl;
    };
    makeBowl([1.05, 0.09, 0.18], 0x6d6257);
    const waterBowl = makeBowl([1.72, 0.09, 0.14], 0x6093a1);
    waterBowl.visible = false;
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x82cbe3,
      transparent: true,
      opacity: 0.72,
      roughness: 0.15,
      metalness: 0.05
    });
    const waterSurface = new THREE.Mesh(new THREE.CircleGeometry(0.26, 24), waterMat);
    waterSurface.rotation.x = -Math.PI / 2;
    waterSurface.position.set(1.72, 0.16, 0.14);
    waterSurface.visible = false;
    chainedDogGroup.add(waterSurface);

    // Dry grass patches reinforce the heat/dehydration context.
    const dryGrassMat = makeStandardMaterial(0x9b7c45, { roughness: 1 });
    [[-2.3, 0.75], [2.45, -0.7], [0.65, -1.05]].forEach(([x, z]) => {
      for (let i = 0; i < 4; i += 1) {
        const blade = addBox(chainedDogGroup, [0.025, 0.35 + i * 0.035, 0.018], [x + i * 0.07, 0.18, z], dryGrassMat);
        blade.rotation.z = (i - 1.5) * 0.15;
      }
    });

    const dogSafeMat = new THREE.MeshBasicMaterial({
      color: 0x48bb78,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const dogSafeZone = new THREE.Mesh(new THREE.RingGeometry(0.75, 1.06, 32), dogSafeMat);
    dogSafeZone.rotation.x = -Math.PI / 2;
    dogSafeZone.position.set(1.55, 0.025, 0.1);
    chainedDogGroup.add(dogSafeZone);

    // ── SCENARIO 4: CAT STRANDED ON A HIGH CORRUGATED ROOF ──────────────────
    const groundMat = makeStandardMaterial(0x29242d, { roughness: 0.96 });
    const roofGround = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 3.7), groundMat);
    roofGround.rotation.x = -Math.PI / 2;
    roofGround.position.y = 0.015;
    rooftopGroup.add(roofGround);

    const facadeMat = makeStandardMaterial(0x6b5145, { roughness: 0.92 });
    addBox(rooftopGroup, [4.5, 1.5, 2.3], [-0.45, 0.74, -0.12], facadeMat);

    const roofMat = makeStandardMaterial(0x49606a, { roughness: 0.48, metalness: 0.55 });
    const roof = addBox(rooftopGroup, [5.05, 0.12, 2.75], [-0.45, 1.52, -0.12], roofMat, [0.035, 0, -0.055]);
    roof.castShadow = !isMobile;
    // Raised ribs make the surface unmistakably corrugated sheet metal.
    for (let x = -2.75; x <= 1.9; x += 0.32) {
      addBox(rooftopGroup, [0.035, 0.06, 2.72], [x, 1.61 - (x + 0.45) * 0.055, -0.12], roofMat, [0.035, 0, -0.055]);
    }

    // Drain pipe provides the dangerous improvised climbing route from option A.
    const pipeMat = makeStandardMaterial(0x889095, { roughness: 0.38, metalness: 0.68 });
    addCylinder(rooftopGroup, 0.075, 0.075, 2.1, [2.0, 0.93, 1.08], pipeMat, 12);
    const gutter = addCylinder(rooftopGroup, 0.075, 0.075, 4.9, [-0.45, 1.47, 1.18], pipeMat, 12);
    gutter.rotation.z = Math.PI / 2;

    // Rescue tarp and supports show the safe action before professionals arrive.
    const tarpMat = new THREE.MeshStandardMaterial({
      color: 0xd77a55,
      roughness: 0.8,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide
    });
    const tarp = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1.45, 5, 4), tarpMat);
    tarp.rotation.x = -Math.PI / 2;
    tarp.position.set(0.5, 0.34, 1.28);
    tarp.visible = false;
    rooftopGroup.add(tarp);
    const tarpSupports = [[-0.7, 0.62], [1.7, 0.62], [-0.7, 1.94], [1.7, 1.94]].map(([x, z]) => {
      const support = addCylinder(rooftopGroup, 0.025, 0.025, 0.66, [x, 0.32, z], fenceMat, 8);
      support.visible = false;
      return support;
    });

    const rescueBeaconMat = new THREE.MeshBasicMaterial({ color: 0xff8d57 });
    const rescueBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), rescueBeaconMat);
    rescueBeacon.position.set(2.55, 0.46, -0.75);
    rescueBeacon.visible = false;
    rooftopGroup.add(rescueBeacon);
    addBox(rooftopGroup, [0.34, 0.42, 0.34], [2.55, 0.22, -0.75], makeStandardMaterial(0x56464b));

    const scenarioGroups = {
      'sc-1': roadsideGroup,
      'sc-2': cardboardGroup,
      'sc-3': chainedDogGroup,
      'sc-4': rooftopGroup
    };

    const scenarioTransforms = {
      'sc-1': { position: [-0.7, 0.04, 0.35], rotationY: Math.PI * 0.22, scale: { dog: 0.72, cat: 0.7 }, lookAt: [0, 0.45, 0], cameraY: 0, cameraZ: 0, moon: [1.7, 1.85, -1.65] },
      'sc-2': { position: [-0.55, 0.32, 0.02], rotationY: -0.18, scale: { dog: 0.5, cat: 0.48 }, lookAt: [-0.3, 0.5, 0], cameraY: -0.12, cameraZ: -0.15, moon: [1.65, 2.42, -1.65] },
      'sc-3': { position: [-0.24, 0.04, 0.38], rotationY: -0.45, scale: { dog: 0.67, cat: 0.62 }, lookAt: [0, 0.42, 0], cameraY: -0.12, cameraZ: 0, moon: [1.7, 1.62, -1.65] },
      'sc-4': { position: [-0.75, 1.62, 0.2], rotationY: 0.55, scale: { dog: 0.52, cat: 0.54 }, lookAt: [-0.35, 1.18, 0], cameraY: 0.32, cameraZ: 0.2, moon: [1.65, 2.42, -1.65] }
    };

    // Theme colors are allocated once and interpolated in-place during the
    // existing render loop, avoiding React re-renders and material recreation.
    const themeColorTracks = [];
    const trackThemeColor = (color, dayHex, nightHex) => {
      const dayColor = new THREE.Color(dayHex);
      const nightColor = new THREE.Color(nightHex);
      color.copy(dayColor).lerp(nightColor, themeMix);
      themeColorTracks.push({ color, dayColor, nightColor });
    };
    trackThemeColor(scene.background, 0xc6e1e7, 0x182238);
    trackThemeColor(scene.fog.color, 0xd4e7e7, 0x20283e);
    trackThemeColor(ambientLight.color, 0xfff3dc, 0x91a6d8);
    trackThemeColor(skyFill.color, 0xdff5ff, 0x8fa8df);
    trackThemeColor(skyFill.groundColor, 0x8b785c, 0x3d3449);
    trackThemeColor(animalFill.color, 0xffecd0, 0xc7d8ff);
    trackThemeColor(moonRim.color, 0xffd6a3, 0x9bb8ff);
    trackThemeColor(baseMat.color, 0x8a796f, 0x393342);
    trackThemeColor(rimMat.color, 0xb97855, 0x9a644f);
    trackThemeColor(roadMat.color, 0x55565c, 0x302c38);
    trackThemeColor(dividerMat.color, 0xf2eadb, 0xd8d0c3);
    trackThemeColor(curbMat.color, 0xa89fa0, 0x554d5b);
    trackThemeColor(grassMat.color, 0x5d8054, 0x385747);
    trackThemeColor(lampMetalMat.color, 0x5f6368, 0x575160);
    trackThemeColor(alleyFloorMat.color, 0x817b7b, 0x3c3742);
    trackThemeColor(wallMat.color, 0xa59691, 0x514756);
    trackThemeColor(cartonMat.color, 0xb67a4f, 0x88583d);
    trackThemeColor(cartonDarkMat.color, 0x6b4632, 0x4d3329);
    trackThemeColor(towelMat.color, 0xe1b69d, 0xc89b8a);
    trackThemeColor(hotBottleMat.color, 0x4aa69a, 0x3c8e8a);
    trackThemeColor(hotBottleRibMat.color, 0x286d69, 0x67c4b4);
    trackThemeColor(bottleCapMat.color, 0xf2c77f, 0xf3d49a);
    trackThemeColor(bottleTowelMat.color, 0xf4e5cb, 0xe8d7bd);
    trackThemeColor(bottleTowelEdgeMat.color, 0xd9bea0, 0xcaa989);
    trackThemeColor(dirtMat.color, 0x8c6a4b, 0x5a4638);
    trackThemeColor(fenceMat.color, 0x716c64, 0x7b7473);
    trackThemeColor(dryGrassMat.color, 0xb79a5d, 0x8d754a);
    trackThemeColor(groundMat.color, 0x848187, 0x3a3542);
    trackThemeColor(facadeMat.color, 0xb9896f, 0x7b5c55);
    trackThemeColor(roofMat.color, 0x708b94, 0x496476);
    trackThemeColor(pipeMat.color, 0x9da6a8, 0x87949d);
    trackThemeColor(treeTrunkMaterial.color, 0x795740, 0x604a43);
    trackThemeColor(foliageMaterial.color, 0x527c55, 0x315e58);
    trackThemeColor(foliageLightMaterial.color, 0x769b6c, 0x47766d);
    trackThemeColor(grassBladeMaterial.color, 0x688f58, 0x3f7469);
    const fireflyDayColor = new THREE.Color(0xffedbd);
    const fireflyNightColor = new THREE.Color(0xf1ff86);

    const setActiveEnvironment = (scenarioId) => {
      const activeId = scenarioGroups[scenarioId] ? scenarioId : 'sc-1';
      Object.entries(scenarioGroups).forEach(([id, group]) => {
        group.visible = id === activeId;
      });
      return activeId;
    };

    let renderedScenarioId = setActiveEnvironment(sceneStateRef.current.scenarioId);
    const currentLookTarget = new THREE.Vector3(...scenarioTransforms[renderedScenarioId].lookAt);
    const desiredLookTarget = new THREE.Vector3();

    // ── ANIMAL CHARACTERS (GLTF Models) ─────────────────────────────────────
    const animalAnchor = new THREE.Group();
    const initialTransform = scenarioTransforms[renderedScenarioId];
    animalAnchor.position.set(...initialTransform.position);
    animalAnchor.rotation.y = initialTransform.rotationY;
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
    const timer = new THREE.Timer();
    timer.connect(document);
    let animId = null;
    let isSceneVisible = false;

    const requestRender = () => {
      if (animId === null && isSceneVisible && !document.hidden) {
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

    function render(timestamp) {
      animId = null;
      if (!isSceneVisible || document.hidden) return;
      animId = requestAnimationFrame(render);
      timer.update(timestamp);
      const t = timer.getElapsed();
      const state = sceneStateRef.current;

      const targetThemeMix = state.theme === 'night' ? 1 : 0;
      themeMix = prefersReducedMotion
        ? targetThemeMix
        : THREE.MathUtils.lerp(themeMix, targetThemeMix, 0.045);
      themeColorTracks.forEach(({ color, dayColor, nightColor }) => {
        color.copy(dayColor).lerp(nightColor, themeMix);
      });
      renderer.toneMappingExposure = THREE.MathUtils.lerp(1.32, 1.2, themeMix);
      scene.fog.density = THREE.MathUtils.lerp(0.026, 0.035, themeMix);
      ambientLight.intensity = THREE.MathUtils.lerp(1.85, 1.55, themeMix);
      skyFill.intensity = THREE.MathUtils.lerp(1.65, 1.2, themeMix);
      animalFill.intensity = THREE.MathUtils.lerp(2.05, 1.7, themeMix);
      moonRim.intensity = THREE.MathUtils.lerp(1.2, 1.65, themeMix);
      moonMaterial.opacity = themeMix * 0.8;
      starMaterial.opacity = themeMix * 0.7;
      coneMat.opacity = THREE.MathUtils.lerp(0.025, 0.105, themeMix);
      contactShadow.material.opacity = THREE.MathUtils.lerp(0.52, 0.72, themeMix);

      fireflyMaterial.color.copy(fireflyDayColor).lerp(fireflyNightColor, themeMix);
      fireflyMaterial.size = THREE.MathUtils.lerp(0.08, 0.14, themeMix);
      fireflyMaterial.opacity = THREE.MathUtils.lerp(0.12, 0.8, themeMix)
        * (0.94 + Math.sin(t * 0.9) * 0.06);
      if (!prefersReducedMotion) {
        const positions = fireflyGeometry.attributes.position.array;
        for (let i = 0; i < fireflyCount; i += 1) {
          const offset = i * 3;
          const phase = fireflyPhases[i];
          positions[offset] = fireflyOrigins[offset] + Math.sin(t * 0.42 + phase) * 0.09;
          positions[offset + 1] = fireflyOrigins[offset + 1] + Math.sin(t * 0.64 + phase * 1.3) * 0.11;
          positions[offset + 2] = fireflyOrigins[offset + 2] + Math.cos(t * 0.36 + phase) * 0.07;
        }
        fireflyGeometry.attributes.position.needsUpdate = true;
      }

      if (state.scenarioId !== renderedScenarioId) {
        renderedScenarioId = setActiveEnvironment(state.scenarioId);
        const nextTransform = scenarioTransforms[renderedScenarioId];
        animalAnchor.position.set(...nextTransform.position);
        animalAnchor.rotation.y = nextTransform.rotationY;
      }
      const activeTransform = scenarioTransforms[renderedScenarioId];
      const isRecommendedResult = state.isConfirmed && state.isRecommendedSelected;
      moonSprite.position.set(...activeTransform.moon);

      // Recommended rescue equipment appears only after the learner confirms
      // the safe action, keeping the initial scene observational rather than a hint.
      bottleGroup.visible = renderedScenarioId === 'sc-2' && isRecommendedResult;
      waterBowl.visible = renderedScenarioId === 'sc-3' && isRecommendedResult;
      waterSurface.visible = waterBowl.visible;
      tarp.visible = renderedScenarioId === 'sc-4' && isRecommendedResult;
      tarpSupports.forEach((support) => { support.visible = tarp.visible; });
      rescueBeacon.visible = renderedScenarioId === 'sc-4' && state.isConfirmed;
      trafficPoints.visible = renderedScenarioId === 'sc-1';

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
      const targetCamY = baseCamPos.y + activeTransform.cameraY - (state.isConfirmed ? 0.18 : 0);
      const targetCamZ = baseCamPos.z + activeTransform.cameraZ - (state.isConfirmed ? 0.28 : 0);

      camera.position.x += (baseCamPos.x + camParallaxX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY + camParallaxY + camDrift - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;

      desiredLookTarget.set(...activeTransform.lookAt);
      currentLookTarget.lerp(desiredLookTarget, 0.06);
      camera.lookAt(currentLookTarget);

      // 2. Ambient Hazard Warning Light Blinker on vehicle
      const hazardBlink = Math.sin(t * 7.5) > 0.1;
      hazardLight.intensity = THREE.MathUtils.lerp(
        hazardLight.intensity,
        renderedScenarioId === 'sc-1' && hazardBlink ? 2.4 : 0.05,
        0.3
      );
      blinkerMat.color.setHex(hazardBlink ? 0xffaa00 : 0x553300);
      rescueBeaconMat.color.setHex(hazardBlink ? 0xffa066 : 0x6b3028);

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
        const targetSafeLight = isRec ? 1.8 : 0.8;
        safeZoneLight.intensity += (targetSafeLight - safeZoneLight.intensity) * 0.08;
        safeZoneLight.color.setHex(targetColor);
      } else {
        safeZoneMat.opacity += (0.12 - safeZoneMat.opacity) * 0.08;
        safeRingBorder.material.opacity = 0.25;
        safeZoneLight.intensity += (0 - safeZoneLight.intensity) * 0.08;
      }

      const feedbackOpacity = isRecommendedResult ? 0.38 + Math.sin(t * 2.5) * 0.08 : 0.08;
      warmthMat.opacity += (feedbackOpacity - warmthMat.opacity) * 0.08;
      dogSafeMat.opacity += ((isRecommendedResult ? 0.35 : 0.08) - dogSafeMat.opacity) * 0.08;
      waterMat.opacity = isRecommendedResult ? 0.74 + Math.sin(t * 2.2) * 0.08 : 0.65;

      // 4. Animal Organic Idle & Dynamic Model Switching
      const activeType = state.animalType || 'dog';
      if (dogModel) dogModel.visible = activeType === 'dog';
      if (catModel) catModel.visible = activeType === 'cat';

      const activeModel = activeType === 'dog' ? dogModel : catModel;
      const activeBones = activeType === 'dog' ? dogBones : catBones;
      const baseScale = activeTransform.scale[activeType];

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
      const dayLampIntensity = renderedScenarioId === 'sc-1' ? 2.8 : 2.15;
      const nightLampIntensity = renderedScenarioId === 'sc-1' ? 4.1 : renderedScenarioId === 'sc-2' ? 3.25 : 2.8;
      const sceneLampIntensity = THREE.MathUtils.lerp(dayLampIntensity, nightLampIntensity, themeMix);
      lampSpot.intensity = sceneLampIntensity + Math.sin(t * 1.4) * 0.12 + (Math.random() < 0.005 ? -0.3 : 0);

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
      timer.dispose();

      try {
        shadowTexture.dispose();
        moonTexture.dispose();
        fireflyTexture.dispose();
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
