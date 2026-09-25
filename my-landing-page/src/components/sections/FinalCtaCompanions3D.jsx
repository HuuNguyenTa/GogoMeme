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
export default function FinalCtaCompanions3D({ theme = 'day' }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const controllerRef = useRef(null);
  const initialThemeRef = useRef(theme);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    let disposed = false;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = motionQuery.matches;
    const isMobile = window.innerWidth <= 768;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

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

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isMobile ? 1.28 : 1.1;
    renderer.shadowMap.enabled = !isMobile;

    const width = container.clientWidth || 460;
    let height = container.clientHeight || 260;
    renderer.setSize(width, height);

    const scene = new THREE.Scene();

    // Camera setup - warm intimate eye-level view
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 50);
    camera.position.set(0, 0.75, 4.2);
    camera.lookAt(0, 0.35, 0);

    // ── Warm Sanctuary Lighting for Dark Card ─────────────────────────────
    // Warm ambient base
    const ambientLight = new THREE.HemisphereLight(0xfff2de, 0x5b3025, isMobile ? 2.05 : 1.72);
    scene.add(ambientLight);

    // Warm key light from top-front
    const keyLight = new THREE.DirectionalLight(0xfffaea, isMobile ? 2.4 : 2.08);
    keyLight.position.set(3, 6, 4);
    keyLight.castShadow = !isMobile;
    keyLight.shadow.mapSize.width = 768;
    keyLight.shadow.mapSize.height = 768;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Soft warm fill light from front-left
    const fillLight = new THREE.DirectionalLight(0xffd8b8, isMobile ? 1.55 : 1.25);
    fillLight.position.set(-3, 3, 3);
    scene.add(fillLight);

    // Golden rim light from behind (makes silhouette pop against dark background)
    const rimLight = new THREE.DirectionalLight(0xffa764, isMobile ? 1.75 : 1.48);
    rimLight.position.set(0, 3, -3.5);
    scene.add(rimLight);

    // Soft floor glow bounce
    const groundBounce = new THREE.PointLight(0xff8855, 0.55, 6, 1.5);
    groundBounce.position.set(0, -0.2, 0.8);
    scene.add(groundBounce);

    let themeMix = initialThemeRef.current === 'night' ? 1 : 0;
    let targetThemeMix = themeMix;
    const dayAmbient = ambientLight.color.clone();
    const nightAmbient = new THREE.Color(0xc6c8f0);
    const dayRim = rimLight.color.clone();
    const nightRim = new THREE.Color(0xacb9ff);
    const dayGround = ambientLight.groundColor.clone();
    const nightGround = new THREE.Color(0x302538);
    const applyTheme = () => {
      ambientLight.color.copy(dayAmbient).lerp(nightAmbient, themeMix);
      ambientLight.groundColor.copy(dayGround).lerp(nightGround, themeMix);
      rimLight.color.copy(dayRim).lerp(nightRim, themeMix);
      groundBounce.intensity = 0.55 + themeMix * 0.12;
    };
    applyTheme();

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

    // A shared ceramic plinth visually reunites the pair and catches their contact shadows.
    const plinth = new THREE.Mesh(
      new THREE.CylinderGeometry(1.52, 1.66, 0.09, 48),
      new THREE.MeshPhysicalMaterial({
        color: 0x7e4939,
        roughness: 0.72,
        metalness: 0,
        clearcoat: 0.12,
        clearcoatRoughness: 0.78
      })
    );
    plinth.position.set(0, -0.045, 0.02);
    plinth.scale.z = 0.42;
    plinth.receiveShadow = true;
    companionsGroup.add(plinth);

    const plinthInlay = new THREE.Mesh(
      new THREE.TorusGeometry(1.08, 0.018, 8, 48),
      new THREE.MeshStandardMaterial({ color: 0xe5a06f, roughness: 0.65 })
    );
    plinthInlay.rotation.x = Math.PI / 2;
    plinthInlay.scale.y = 0.42;
    plinthInlay.position.y = 0.012;
    companionsGroup.add(plinthInlay);

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
        if (disposed) { disposeObject(model); return; }
        model.scale.setScalar(0.88);
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = !isMobile;
            child.receiveShadow = true;
            if (child.material) {
              child.material.roughness = 0.68;
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
        requestRender();
      },
      undefined,
      (err) => console.warn('Could not load shiba_dog.glb in FinalCta:', err)
    );

    // 2. Load Tabby Cat (exact same model from Hero)
    gltfLoader.load(
      '/assets/models/tabby_cat.glb',
      (gltf) => {
        const model = gltf.scene;
        if (disposed) { disposeObject(model); return; }
        model.scale.setScalar(0.76);
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = !isMobile;
            child.receiveShadow = true;
            if (child.material) {
              child.material.roughness = 0.68;
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
        requestRender();
      },
      undefined,
      (err) => console.warn('Could not load tabby_cat.glb in FinalCta:', err)
    );

    // ── Interaction: Subtle Pointer Parallax ──────────────────────────────
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;

    const onPointerMove = (e) => {
      if (prefersReducedMotion || !hasFinePointer) return;
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.5;
      const clientX = e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches && e.touches[0] ? e.touches[0].clientY : e.clientY;
      if (typeof clientX !== 'number' || typeof clientY !== 'number') return;
      targetMouseX = Math.max(-1, Math.min(1, (clientX - cx) / (rect.width * 0.5)));
      targetMouseY = Math.max(-1, Math.min(1, (clientY - cy) / (rect.height * 0.5)));
    };
    const onTouchEnd = () => {
      targetMouseX = 0;
      targetMouseY = 0;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!renderer || !container) return;
      const w = container.clientWidth || 460;
      height = container.clientHeight || 260;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
      requestRender();
    };

    window.addEventListener('resize', handleResize);

    // ── Animation Loop ───────────────────────────────────────────────────
    let lastTime = performance.now();
    let elapsed = 0;
    let animId = null;
    let isSceneVisible = true;

    const requestRender = () => {
      if (!disposed && animId === null && isSceneVisible && !document.hidden) {
        lastTime = performance.now();
        animId = requestAnimationFrame(renderLoop);
      }
    };

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isSceneVisible = entry.isIntersecting;
      if (isSceneVisible) {
        themeMix = targetThemeMix;
        applyTheme();
        requestRender();
      }
      else if (animId !== null) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    }, { threshold: 0, rootMargin: '160px 0px 160px 0px' });
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
    const onMotionChange = () => {
      prefersReducedMotion = motionQuery.matches;
      if (prefersReducedMotion) mouseX = mouseY = targetMouseX = targetMouseY = 0;
      requestRender();
    };
    motionQuery.addEventListener('change', onMotionChange);

    controllerRef.current = {
      setTheme(nextTheme) {
        targetThemeMix = nextTheme === 'night' ? 1 : 0;
        if (prefersReducedMotion || !isSceneVisible || document.hidden) themeMix = targetThemeMix;
        requestRender();
      }
    };

    function renderLoop(now) {
      animId = null;
      if (!isSceneVisible || document.hidden) return;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      elapsed += dt;
      const t = elapsed;
      themeMix += (targetThemeMix - themeMix) * (1 - Math.exp(-dt * 7));
      if (Math.abs(targetThemeMix - themeMix) < 0.002) themeMix = targetThemeMix;
      applyTheme();

      // Smooth pointer interpolation
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      // Group slight rotation toward pointer
      companionsGroup.rotation.y = mouseX * 0.1;
      companionsGroup.position.y = prefersReducedMotion ? 0.02 : 0.02 + Math.sin(t * 0.72) * 0.006;

      // 1. Organic breathing idle
      const dogBreath = prefersReducedMotion ? 0 : Math.sin(t * 2.2) * 0.009;
      const catBreath = prefersReducedMotion ? 0 : Math.sin(t * 2.6 + 0.9) * 0.009;
      dogAnchor.scale.set(1 + dogBreath, 1 + dogBreath * 1.2, 1 + dogBreath);
      catAnchor.scale.set(1 + catBreath, 1 + catBreath * 1.2, 1 + catBreath);

      // 2. Tail movements
      if (dogBones['Tail'] && dogBones['Tail'].userData.origRot) {
        const o = dogBones['Tail'].userData.origRot;
        dogBones['Tail'].rotation.y = o.y + (prefersReducedMotion ? 0 : Math.sin(t * 4.2) * 0.16);
      }
      if (dogBones['Tail1'] && dogBones['Tail1'].userData.origRot) {
        const o = dogBones['Tail1'].userData.origRot;
        dogBones['Tail1'].rotation.y = o.y + (prefersReducedMotion ? 0 : Math.sin(t * 4.2 - 0.3) * 0.13);
      }

      if (catBones['Tail'] && catBones['Tail'].userData.origRot) {
        const o = catBones['Tail'].userData.origRot;
        catBones['Tail'].rotation.y = o.y + (prefersReducedMotion ? 0 : Math.sin(t * 1.8) * 0.12);
      }
      if (catBones['Tail1'] && catBones['Tail1'].userData.origRot) {
        const o = catBones['Tail1'].userData.origRot;
        catBones['Tail1'].rotation.y = o.y + (prefersReducedMotion ? 0 : Math.sin(t * 1.8 - 0.4) * 0.1);
      }

      // 3. Head subtle movements toward cursor
      if (dogBones['Head'] && dogBones['Head'].userData.origRot) {
        const o = dogBones['Head'].userData.origRot;
        dogBones['Head'].rotation.y = o.y + mouseX * 0.14 + (prefersReducedMotion ? 0 : Math.sin(t * 1.3) * 0.018);
        dogBones['Head'].rotation.x = o.x - mouseY * 0.06;
      }

      if (catBones['Head'] && catBones['Head'].userData.origRot) {
        const o = catBones['Head'].userData.origRot;
        catBones['Head'].rotation.y = o.y + mouseX * 0.12 + (prefersReducedMotion ? 0 : Math.sin(t * 1.2 + 1.0) * 0.018);
        catBones['Head'].rotation.x = o.x - mouseY * 0.05;
      }

      renderer.render(scene, camera);
      if (!prefersReducedMotion) animId = requestAnimationFrame(renderLoop);
    }

    requestRender();

    // ── Cleanup ──────────────────────────────────────────────────────────
    return () => {
      disposed = true;
      controllerRef.current = null;
      if (animId !== null) cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      motionQuery.removeEventListener('change', onMotionChange);
      visibilityObserver.disconnect();

      try {
        shadowTex.dispose();
        shadowMat.dispose();
        disposeObject(scene);
        keyLight.shadow.dispose();
        renderer.dispose();
      } catch (err) {
        console.warn('Error during FinalCta 3D disposal:', err);
      }
    };
  }, []);

  useEffect(() => {
    controllerRef.current?.setTheme(theme);
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className={`final-cta-3d-wrapper ${isLoaded ? 'is-ready' : 'is-loading'}`}
      aria-label="3D Shiba Dog và Tabby Cat từ Hero đồng hành cùng GoGo & MeMe"
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

function disposeObject(root) {
  const disposedResources = new Set();
  const dispose = (resource) => {
    if (!resource || disposedResources.has(resource)) return;
    disposedResources.add(resource);
    resource.dispose();
  };
  root.traverse((object) => {
    dispose(object.geometry);
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of materials) {
      if (!material) continue;
      for (const value of Object.values(material)) if (value?.isTexture) dispose(value);
      dispose(material);
    }
  });
}
