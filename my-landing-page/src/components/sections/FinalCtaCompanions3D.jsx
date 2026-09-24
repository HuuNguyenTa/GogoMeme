import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * FinalCtaCompanions3D - Realtime 3D Shiba Dog & Tabby Cat Companions
 * Replaces the 2D cartoon mascot duo at the bottom of FinalCtaSection
 * with the exact high-fidelity 3D characters from the Hero.
 *
 * Features:
 * - Realtime WebGL rendering with transparent background
 * - PBR lighting tailored for dark warm card background (key, fill & golden rim)
 * - Grounding contact shadows under both companions
 * - Procedural breathing & resting tail / head idle motions
 * - Subtle pointer-following parallax
 * - Full memory & resource cleanup on unmount
 */
export default function FinalCtaCompanions3D() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

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
    } catch (e) {
      console.warn('WebGL initialization failed in FinalCtaCompanions3D:', e);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = container.clientWidth || 460;
    const height = 240;
    renderer.setSize(width, height);

    const scene = new THREE.Scene();

    // Camera setup - warm intimate eye-level view
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 50);
    camera.position.set(0, 0.75, 4.2);
    camera.lookAt(0, 0.35, 0);

    // ── Warm Sanctuary Lighting for Dark Card ─────────────────────────────
    // Warm ambient base
    const ambientLight = new THREE.AmbientLight(0xffecd6, 1.6);
    scene.add(ambientLight);

    // Warm key light from top-front
    const keyLight = new THREE.DirectionalLight(0xfffaea, 2.2);
    keyLight.position.set(3, 6, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Soft warm fill light from front-left
    const fillLight = new THREE.DirectionalLight(0xffd8b8, 1.2);
    fillLight.position.set(-3, 3, 3);
    scene.add(fillLight);

    // Golden rim light from behind (makes silhouette pop against dark background)
    const rimLight = new THREE.DirectionalLight(0xffa764, 2.0);
    rimLight.position.set(0, 3, -3.5);
    scene.add(rimLight);

    // Soft floor glow bounce
    const groundBounce = new THREE.PointLight(0xff8855, 0.8, 6, 1.5);
    groundBounce.position.set(0, -0.2, 0.8);
    scene.add(groundBounce);

    // ── Soft Contact Shadow Texture ──────────────────────────────────────
    const createShadowTex = () => {
      const cv = document.createElement('canvas');
      cv.width = cv.height = 128;
      const ctx = cv.getContext('2d');
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(15, 8, 4, 0.65)');
      grad.addColorStop(0.45, 'rgba(25, 12, 6, 0.35)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(64, 64, 64, 0, Math.PI * 2);
      ctx.fill();
      return new THREE.CanvasTexture(cv);
    };

    const shadowTex = createShadowTex();
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.8
    });

    // Shadow for Cat (Left)
    const catShadow = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.7), shadowMat);
    catShadow.rotation.x = -Math.PI / 2;
    catShadow.position.set(-0.52, 0.01, 0.05);
    scene.add(catShadow);

    // Shadow for Dog (Right)
    const dogShadow = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.8), shadowMat);
    dogShadow.rotation.x = -Math.PI / 2;
    dogShadow.position.set(0.55, 0.01, 0.05);
    scene.add(dogShadow);

    // ── Character Root Anchors ───────────────────────────────────────────
    const companionsGroup = new THREE.Group();
    scene.add(companionsGroup);
    companionsGroup.position.set(0, 0.02, 0);

    // Cat Anchor: positioned left, angled slightly toward dog and camera
    const catAnchor = new THREE.Group();
    catAnchor.position.set(-0.54, 0.02, 0.02);
    const baseCatRotY = Math.PI * 0.16;
    catAnchor.rotation.y = baseCatRotY;
    companionsGroup.add(catAnchor);

    // Dog Anchor: positioned right, angled slightly toward cat and camera
    const dogAnchor = new THREE.Group();
    dogAnchor.position.set(0.55, 0.02, 0.02);
    const baseDogRotY = -Math.PI * 0.18;
    dogAnchor.rotation.y = baseDogRotY;
    companionsGroup.add(dogAnchor);

    const gltfLoader = new GLTFLoader();
    let dogBones = {}, catBones = {};
    let loadedCount = 0;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount >= 2) {
        setIsLoaded(true);
      }
    };

    // 1. Load Shiba Dog (exact same model from Hero)
    gltfLoader.load(
      '/assets/models/shiba_dog.glb',
      (gltf) => {
        const model = gltf.scene;
        model.scale.setScalar(0.88);
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.roughness = 0.6;
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
        dogAnchor.add(model);
        checkAllLoaded();
      },
      undefined,
      (err) => console.warn('Could not load shiba_dog.glb in FinalCta:', err)
    );

    // 2. Load Tabby Cat (exact same model from Hero)
    gltfLoader.load(
      '/assets/models/tabby_cat.glb',
      (gltf) => {
        const model = gltf.scene;
        model.scale.setScalar(0.76);
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.roughness = 0.6;
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
        catAnchor.add(model);
        checkAllLoaded();
      },
      undefined,
      (err) => console.warn('Could not load tabby_cat.glb in FinalCta:', err)
    );

    // ── Interaction: Subtle Pointer Parallax ──────────────────────────────
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.5;
      targetMouseX = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width * 0.5)));
      targetMouseY = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height * 0.5)));
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!renderer || !container) return;
      const w = container.clientWidth || 460;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };

    window.addEventListener('resize', handleResize);

    // ── Animation Loop ───────────────────────────────────────────────────
    let clock = new THREE.Clock();
    let animId = null;

    function renderLoop() {
      animId = requestAnimationFrame(renderLoop);
      const t = clock.getElapsedTime();

      // Smooth pointer interpolation
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      // Group slight rotation toward pointer
      companionsGroup.rotation.y = mouseX * 0.12;

      // 1. Organic breathing idle
      const dogBreath = Math.sin(t * 2.2) * 0.012;
      const catBreath = Math.sin(t * 2.6 + 0.9) * 0.012;
      dogAnchor.scale.set(1 + dogBreath, 1 + dogBreath * 1.2, 1 + dogBreath);
      catAnchor.scale.set(1 + catBreath, 1 + catBreath * 1.2, 1 + catBreath);

      // 2. Tail movements
      if (dogBones['Tail'] && dogBones['Tail'].userData.origRot) {
        const o = dogBones['Tail'].userData.origRot;
        dogBones['Tail'].rotation.y = o.y + Math.sin(t * 4.2) * 0.18;
      }
      if (dogBones['Tail1'] && dogBones['Tail1'].userData.origRot) {
        const o = dogBones['Tail1'].userData.origRot;
        dogBones['Tail1'].rotation.y = o.y + Math.sin(t * 4.2 - 0.3) * 0.14;
      }

      if (catBones['Tail'] && catBones['Tail'].userData.origRot) {
        const o = catBones['Tail'].userData.origRot;
        catBones['Tail'].rotation.y = o.y + Math.sin(t * 1.8) * 0.14;
      }
      if (catBones['Tail1'] && catBones['Tail1'].userData.origRot) {
        const o = catBones['Tail1'].userData.origRot;
        catBones['Tail1'].rotation.y = o.y + Math.sin(t * 1.8 - 0.4) * 0.12;
      }

      // 3. Head subtle movements toward cursor
      if (dogBones['Head'] && dogBones['Head'].userData.origRot) {
        const o = dogBones['Head'].userData.origRot;
        dogBones['Head'].rotation.y = o.y + mouseX * 0.14 + Math.sin(t * 1.3) * 0.02;
        dogBones['Head'].rotation.x = o.x - mouseY * 0.06;
      }

      if (catBones['Head'] && catBones['Head'].userData.origRot) {
        const o = catBones['Head'].userData.origRot;
        catBones['Head'].rotation.y = o.y + mouseX * 0.12 + Math.sin(t * 1.2 + 1.0) * 0.02;
        catBones['Head'].rotation.x = o.x - mouseY * 0.05;
      }

      renderer.render(scene, camera);
    }

    renderLoop();

    // ── Cleanup ──────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', handleResize);

      try {
        shadowTex.dispose();
        shadowMat.dispose();
        scene.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material.dispose();
            }
          }
        });
        renderer.dispose();
      } catch (err) {
        console.warn('Error during FinalCta 3D disposal:', err);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`final-cta-3d-wrapper ${isLoaded ? 'is-ready' : 'is-loading'}`}
      aria-label="3D Shiba Dog và Tabby Cat từ Hero đồng hành cùng Trạm Yêu Thương"
    >
      <canvas ref={canvasRef} className="final-cta-3d-canvas" />
      {!isLoaded && (
        <div className="final-cta-3d-loader" aria-hidden="true">
          <div className="final-cta-3d-spinner" />
          <span>Đang tải các bé bốn chân...</span>
        </div>
      )}
    </div>
  );
}

