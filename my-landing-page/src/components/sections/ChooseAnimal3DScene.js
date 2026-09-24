// ChooseAnimal3DScene.js - Interactive 3D Character Selection Stage
// Provides immersive 3D preview of Shiba Dog and Tabby Cat with drag-to-rotate,
// procedural breathing, head tracking, and cozy sanctuary miniature pedestal.

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function initChooseAnimalScene(canvas, hostElement, options = {}) {
  if (!canvas) return { dispose: () => {}, setAnimalType: () => {} };

  const { onLoaded } = options;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(canvas.clientWidth || 540, canvas.clientHeight || 500);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
  } catch (err) {
    console.warn('WebGL initialization error in ChooseAnimal3DScene:', err);
    return { dispose: () => {}, setAnimalType: () => {} };
  }

  const scene = new THREE.Scene();

  // Perspective camera with cozy portrait framing
  const camera = new THREE.PerspectiveCamera(32, (canvas.clientWidth || 540) / (canvas.clientHeight || 500), 0.1, 50);
  camera.position.set(0, 1.35, 4.6);
  const lookTarget = new THREE.Vector3(0, 0.45, 0);
  camera.lookAt(lookTarget);

  // Root platform group (can be rotated 360° by user drag)
  const stageRoot = new THREE.Group();
  scene.add(stageRoot);
  stageRoot.position.set(0, -0.32, 0);

  // ── Cinematic Warm Sanctuary Studio Lighting ──────────────────────────────
  const ambLight = new THREE.AmbientLight(0xfff7ee, 1.5);
  scene.add(ambLight);

  // Main Sunny Key Light
  const sunLight = new THREE.DirectionalLight(0xfffae4, 2.2);
  sunLight.position.set(4, 8, 5);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 15;
  sunLight.shadow.camera.left = -2.5;
  sunLight.shadow.camera.right = 2.5;
  sunLight.shadow.camera.top = 2.5;
  sunLight.shadow.camera.bottom = -2.5;
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);

  // Soft front fill point light for expressive face and catchlights
  const frontFill = new THREE.PointLight(0xffecd4, 1.4, 6.0, 1.5);
  frontFill.position.set(0, 1.2, 2.8);
  scene.add(frontFill);

  // Warm golden rim light for soft fur silhouettes
  const rimLight = new THREE.DirectionalLight(0xffbe85, 1.2);
  rimLight.position.set(-4, 3, -3);
  scene.add(rimLight);

  // Fresh lawn bounce light
  const bounceLight = new THREE.DirectionalLight(0x7dc96e, 0.5);
  bounceLight.position.set(0, -3, 1);
  scene.add(bounceLight);

  // ── Handcrafted Miniature Pedestal & Garden Grounding ─────────────────────
  // 1. Terracotta Ceramic Foundation
  const baseGeom = new THREE.CylinderGeometry(1.75, 1.52, 0.45, 36);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0xd69c76,
    roughness: 0.85,
    metalness: 0.03
  });
  const baseMesh = new THREE.Mesh(baseGeom, baseMat);
  baseMesh.position.y = -0.225;
  baseMesh.receiveShadow = true;
  stageRoot.add(baseMesh);

  // 2. Lush Spring Meadow Lawn Cap
  const lawnGeom = new THREE.CylinderGeometry(1.82, 1.82, 0.16, 36);
  const lawnMat = new THREE.MeshStandardMaterial({
    color: 0x5ebd48,
    roughness: 0.72,
    metalness: 0.02
  });
  const lawnMesh = new THREE.Mesh(lawnGeom, lawnMat);
  lawnMesh.position.y = 0.08;
  lawnMesh.receiveShadow = true;
  stageRoot.add(lawnMesh);

  // 3. Cozy Woven Braided Rug for Character
  const rugGeom = new THREE.CylinderGeometry(0.85, 0.90, 0.025, 32);
  const rugMat = new THREE.MeshStandardMaterial({
    color: 0xffdfcb,
    roughness: 0.90,
    metalness: 0.0
  });
  const rugMesh = new THREE.Mesh(rugGeom, rugMat);
  rugMesh.position.set(0, 0.17, 0);
  rugMesh.receiveShadow = true;
  stageRoot.add(rugMesh);

  // 4. Little Pet Food & Water Bowls in Front
  const bowlFood = new THREE.Mesh(
    new THREE.CylinderGeometry(0.10, 0.07, 0.065, 16),
    new THREE.MeshStandardMaterial({ color: 0xff6b4a, roughness: 0.35 })
  );
  bowlFood.position.set(0.48, 0.20, 0.72);
  bowlFood.castShadow = true;
  stageRoot.add(bowlFood);

  const bowlWater = new THREE.Mesh(
    new THREE.CylinderGeometry(0.10, 0.07, 0.065, 16),
    new THREE.MeshStandardMaterial({ color: 0x58bfe6, roughness: 0.35 })
  );
  bowlWater.position.set(-0.48, 0.20, 0.72);
  bowlWater.castShadow = true;
  stageRoot.add(bowlWater);

  // 5. Swaying Garden Wildflowers around perimeter
  const flowerInstances = [];
  const flMats = [
    new THREE.MeshStandardMaterial({ color: 0xffd147, roughness: 0.5 }),
    new THREE.MeshStandardMaterial({ color: 0xff7b60, roughness: 0.5 }),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 })
  ];
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x4aa342, roughness: 0.8 });
  const flCoords = [
    [-1.2, 0.16, 0.5], [-1.0, 0.16, 0.9], [-0.6, 0.16, 1.2],
    [0.7, 0.16, 1.2], [1.1, 0.16, 0.8], [1.3, 0.16, 0.3],
    [1.1, 0.16, -0.6], [-1.0, 0.16, -0.7]
  ];
  flCoords.forEach(([fx, fy, fz], idx) => {
    const fg = new THREE.Group();
    fg.position.set(fx, fy, fz);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.18), stemMat);
    stem.position.y = 0.09;
    fg.add(stem);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 8), flMats[idx % 3]);
    head.position.y = 0.18;
    fg.add(head);
    stageRoot.add(fg);
    flowerInstances.push({
      group: fg,
      baseRotZ: (Math.random() - 0.5) * 0.1,
      speed: 1.8 + Math.random() * 0.8,
      phase: idx * 0.6
    });
  });

  // ── Character Model Anchors ───────────────────────────────────────────────
  const dogRoot = new THREE.Group();
  dogRoot.position.set(0, 0.18, 0.05);
  dogRoot.rotation.y = -0.15;
  stageRoot.add(dogRoot);

  const catRoot = new THREE.Group();
  catRoot.position.set(0, 0.18, 0.05);
  catRoot.rotation.y = 0.12;
  stageRoot.add(catRoot);
  catRoot.visible = false;

  let currentType = 'dog';
  let dogBones = {}, catBones = {};
  let dogLoaded = false, catLoaded = false;

  const gltfLoader = new GLTFLoader();

  // Load Shiba Dog
  gltfLoader.load(
    '/assets/models/shiba_dog.glb',
    (gltf) => {
      const model = gltf.scene;
      model.scale.setScalar(1.08);
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.roughness = 0.62;
            child.material.metalness = 0.0;
            if (child.material.map) {
              child.material.map.colorSpace = THREE.SRGBColorSpace;
            }
          }
        }
        if (child.isBone) {
          dogBones[child.name] = child;
          child.userData.origRot = child.rotation.clone();
          child.userData.origPos = child.position.clone();
        }
      });
      dogRoot.add(model);
      dogLoaded = true;
      if (onLoaded) onLoaded();
    },
    undefined,
    (err) => console.warn('Shiba Dog model load error in ChooseAnimal:', err)
  );

  // Load Tabby Cat
  gltfLoader.load(
    '/assets/models/tabby_cat.glb',
    (gltf) => {
      const model = gltf.scene;
      model.scale.setScalar(0.96);
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.roughness = 0.62;
            child.material.metalness = 0.0;
            if (child.material.map) {
              child.material.map.colorSpace = THREE.SRGBColorSpace;
            }
          }
        }
        if (child.isBone) {
          catBones[child.name] = child;
          child.userData.origRot = child.rotation.clone();
          child.userData.origPos = child.position.clone();
        }
      });
      catRoot.add(model);
      catLoaded = true;
    },
    undefined,
    (err) => console.warn('Tabby Cat model load error in ChooseAnimal:', err)
  );

  // ── Drag to Orbit / Rotate ────────────────────────────────────────────────
  let isDragging = false;
  let prevMouseX = 0;
  let targetRotY = 0;
  let currentRotY = 0;
  let rotVelocity = 0;

  let pointerNormX = 0;
  let pointerNormY = 0;
  let targetPointerX = 0;
  let targetPointerY = 0;

  const onPointerDown = (e) => {
    isDragging = true;
    prevMouseX = e.clientX;
    rotVelocity = 0;
    canvas.style.cursor = 'grabbing';
  };

  const onPointerMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const cx = rect.left + rect.width * 0.5;
    const cy = rect.top + rect.height * 0.5;
    targetPointerX = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width * 0.5)));
    targetPointerY = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height * 0.5)));

    if (isDragging) {
      const dx = e.clientX - prevMouseX;
      prevMouseX = e.clientX;
      targetRotY += dx * 0.012;
      rotVelocity = dx * 0.012;
    }
  };

  const onPointerUp = () => {
    if (isDragging) {
      isDragging = false;
      canvas.style.cursor = 'grab';
    }
  };

  canvas.style.cursor = 'grab';
  canvas.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp);

  // ── Smooth Character Switch & Elastic Bounce Transition ───────────────────
  let transitionProgress = 1.0;
  let transitionTarget = 1.0;

  function setAnimalType(type) {
    if (type === currentType) return;
    currentType = type;
    transitionProgress = 0.0;
    transitionTarget = 1.0;

    // Gently reset rotation towards front with nice angle
    targetRotY = type === 'dog' ? -0.15 : 0.12;

    if (type === 'dog') {
      dogRoot.visible = isModelVisible;
      catRoot.visible = false;
    } else {
      catRoot.visible = isModelVisible;
      dogRoot.visible = false;
    }
  }

  function resetView() {
    targetRotY = currentType === 'dog' ? -0.15 : 0.12;
    rotVelocity = 0;
  }

  // ── Responsive Canvas Resize ──────────────────────────────────────────────
  const onResize = () => {
    if (!renderer || !canvas) return;
    const w = canvas.parentElement ? canvas.parentElement.clientWidth : canvas.clientWidth;
    const h = canvas.parentElement ? canvas.parentElement.clientHeight : canvas.clientHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', onResize);

  // ── Procedural Companion Reactions & State ──────────────────────────────
  let typingReactionUntil = 0;
  let happyReactionUntil = 0;
  let companionMode = 'choose'; // 'choose' | 'write' | 'success'
  let isModelVisible = true;

  function triggerTypingReaction() {
    const now = clock.getElapsedTime();
    // Extend or trigger 1.4s of curious companion attentiveness
    typingReactionUntil = Math.max(typingReactionUntil, now + 1.4);
  }

  function triggerHappyReaction() {
    const now = clock.getElapsedTime();
    // 2.8s of celebratory jumping, joyful tail wagging and perks
    happyReactionUntil = now + 2.8;
  }

  function setCompanionMode(mode) {
    companionMode = mode;
  }

  function setModelVisibility(visible) {
    isModelVisible = visible;
    if (currentType === 'dog') {
      dogRoot.visible = visible;
      catRoot.visible = false;
    } else {
      catRoot.visible = visible;
      dogRoot.visible = false;
    }
  }

  // ── Animation Loop ────────────────────────────────────────────────────────
  let clock = new THREE.Clock();
  let rafId = 0;

  function animate() {
    rafId = requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.getElapsedTime();

    const isTyping = t < typingReactionUntil;
    const isHappy = t < happyReactionUntil;

    // Damped drag rotation with gentle deceleration
    if (!isDragging) {
      targetRotY += rotVelocity;
      rotVelocity *= 0.92;
      // Gentle subtle breathing float
      stageRoot.rotation.y += (targetRotY - stageRoot.rotation.y) * 0.10;
    } else {
      stageRoot.rotation.y = targetRotY;
    }

    // Happy reaction bouncing hop on the pedestal
    if (isHappy) {
      const hopProgress = happyReactionUntil - t;
      const hop = Math.abs(Math.sin(hopProgress * 8)) * 0.10;
      stageRoot.position.y = -0.32 + hop;
    } else {
      stageRoot.position.y += (-0.32 - stageRoot.position.y) * 0.15;
    }

    // Pointer smoothing
    pointerNormX += (targetPointerX - pointerNormX) * 0.08;
    pointerNormY += (targetPointerY - pointerNormY) * 0.08;

    // Camera responsive framing depending on companionMode
    const baseCamX = companionMode === 'write' ? -0.15 : 0;
    const baseCamY = companionMode === 'write' ? 1.28 : 1.35;
    const baseCamZ = companionMode === 'write' ? 4.18 : 4.60;

    camera.position.x += (baseCamX + pointerNormX * 0.22 - camera.position.x) * 0.08;
    camera.position.y += (baseCamY - pointerNormY * 0.12 - camera.position.y) * 0.08;
    camera.position.z += (baseCamZ - camera.position.z) * 0.08;
    camera.lookAt(lookTarget);

    // Transition scaling bounce (0 -> 1)
    if (transitionProgress < 1.0) {
      transitionProgress += dt * 4.0;
      if (transitionProgress > 1.0) transitionProgress = 1.0;
      const s = THREE.MathUtils.lerp(0.85, 1.0, 1 - Math.pow(1 - transitionProgress, 3));
      if (currentType === 'dog' && isModelVisible) {
        dogRoot.scale.set(s, s, s);
      } else if (currentType === 'cat' && isModelVisible) {
        catRoot.scale.set(s, s, s);
      }
    }

    // Organic procedural breathing
    const breath = Math.sin(t * 2.2) * 0.012;
    if (currentType === 'dog' && dogLoaded && isModelVisible) {
      dogRoot.position.y = 0.18 + breath * 0.5;

      // Head tracking & curious typing reaction
      if (dogBones['Head'] && dogBones['Head'].userData.origRot) {
        const o = dogBones['Head'].userData.origRot;
        const tilt = isTyping ? 0.14 : isHappy ? Math.sin(t * 10) * 0.08 : 0;
        dogBones['Head'].rotation.y = o.y + pointerNormX * 0.22 + Math.sin(t * 1.5) * 0.025;
        dogBones['Head'].rotation.x = o.x - pointerNormY * 0.10 + Math.cos(t * 1.2) * 0.02 + (isTyping ? 0.06 : 0);
        dogBones['Head'].rotation.z = o.z + tilt;
      }
      // Joyful tail wagging (accelerated on typing / celebration)
      const wagSpeed = isHappy ? 14 : isTyping ? 7.5 : 5.2;
      const wagAmp = isHappy ? 0.42 : isTyping ? 0.32 : 0.25;
      if (dogBones['Tail'] && dogBones['Tail'].userData.origRot) {
        const o = dogBones['Tail'].userData.origRot;
        dogBones['Tail'].rotation.y = o.y + Math.sin(t * wagSpeed) * wagAmp;
      }
      if (dogBones['Tail1'] && dogBones['Tail1'].userData.origRot) {
        const o = dogBones['Tail1'].userData.origRot;
        dogBones['Tail1'].rotation.y = o.y + Math.sin(t * wagSpeed - 0.4) * (wagAmp * 0.72);
      }
    } else if (currentType === 'cat' && catLoaded && isModelVisible) {
      catRoot.position.y = 0.18 + breath * 0.5;

      // Cat head curious tracking & typing reaction
      if (catBones['Head'] && catBones['Head'].userData.origRot) {
        const o = catBones['Head'].userData.origRot;
        const tilt = isTyping ? 0.12 : isHappy ? Math.sin(t * 8) * 0.06 : 0;
        catBones['Head'].rotation.y = o.y + pointerNormX * 0.18 + Math.sin(t * 1.4) * 0.025;
        catBones['Head'].rotation.x = o.x - pointerNormY * 0.08 + (isTyping ? 0.05 : 0);
        catBones['Head'].rotation.z = o.z + tilt;
      }
      // Cat tail sway (curled on typing / celebration)
      const catWagSpeed = isHappy ? 6.5 : isTyping ? 3.2 : 1.8;
      const catWagAmp = isHappy ? 0.35 : 0.18;
      if (catBones['Tail'] && catBones['Tail'].userData.origRot) {
        const o = catBones['Tail'].userData.origRot;
        catBones['Tail'].rotation.y = o.y + Math.sin(t * catWagSpeed) * catWagAmp;
      }
      if (catBones['Tail1'] && catBones['Tail1'].userData.origRot) {
        const o = catBones['Tail1'].userData.origRot;
        catBones['Tail1'].rotation.y = o.y + Math.sin(t * catWagSpeed - 0.4) * (catWagAmp * 0.8);
      }
    }

    // Swaying wildflowers
    flowerInstances.forEach((fl) => {
      fl.group.rotation.z = fl.baseRotZ + Math.sin(t * fl.speed + fl.phase) * 0.09;
    });

    renderer.render(scene, camera);
  }

  rafId = requestAnimationFrame(animate);

  // Trigger initial resize after layout render
  setTimeout(onResize, 150);

  // ── Disposal & Resource Teardown ─────────────────────────────────────────
  return {
    setAnimalType,
    resetView,
    triggerTypingReaction,
    triggerHappyReaction,
    setCompanionMode,
    setModelVisibility,
    dispose: () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);

      baseGeom.dispose();
      baseMat.dispose();
      lawnGeom.dispose();
      lawnMat.dispose();
      rugGeom.dispose();
      rugMat.dispose();
      flMats.forEach((m) => m.dispose());
      stemMat.dispose();

      if (renderer) {
        renderer.dispose();
      }
    }
  };
}

