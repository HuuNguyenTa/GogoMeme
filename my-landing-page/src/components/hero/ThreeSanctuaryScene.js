// ThreeSanctuaryScene.js - "A Little World of Love"
// Art-Directed Miniature 3D Sanctuary Diorama for Trạm Yêu Thương
// Prominent GLB Shiba Dog & Tabby Cat Characters with Supporting Miniature Shelter Backdrop

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function initThreeSanctuary(canvas, hostElement, initialTheme = 'day') {
  const emptyController = { dispose() {}, setTheme() {} };
  if (!canvas) return emptyController;
  let disposed = false;
  let targetThemeMix = initialTheme === 'night' ? 1 : 0;
  let themeMix = targetThemeMix;

  let renderer = null;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
  } catch (err) {
    console.error('WebGLRenderer initialization failed:', err);
    return emptyController;
  }

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let prefersReducedMotion = motionQuery.matches;
  const isMobile = window.innerWidth <= 768;
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.35 : 1.8));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xfff7ee, 0.024);

  // Isometric-feel Perspective Camera positioned so left 48% is dedicated to typography
  const baseCamX = -0.25;
  const baseCamY = 2.25;
  const baseCamZ = 7.7;
  const lookTarget = new THREE.Vector3(-0.25, 0.45, 0);
  const camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(baseCamX, baseCamY, baseCamZ);
  camera.lookAt(lookTarget);

  // Root Groups
  const dioramaRoot = new THREE.Group();
  scene.add(dioramaRoot);
  // Shift to right side (~70% horizontal position) leaving left half pristine for typography & CTAs
  dioramaRoot.position.set(2.25, -0.08, 0);

  const envGroup = new THREE.Group();
  scene.add(envGroup);

  // ── Cinematic PBR Lighting (Warm Sunny Sanctuary Morning) ─────────────────
  const ambLight = new THREE.AmbientLight(0xfff7ee, 1.4);
  scene.add(ambLight);

  // Main Sun Key Light casting crisp, soft-edged shadows
  const sunLight = new THREE.DirectionalLight(0xfffae4, 2.2);
  sunLight.position.set(6, 12, 7);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 30;
  sunLight.shadow.camera.left = -4.5;
  sunLight.shadow.camera.right = 4.5;
  sunLight.shadow.camera.top = 4.5;
  sunLight.shadow.camera.bottom = -4.5;
  sunLight.shadow.bias = -0.0004;
  sunLight.shadow.radius = 2.5;
  scene.add(sunLight);

  // Fresh green grass bounce fill
  const groundBounce = new THREE.DirectionalLight(0x7bc668, 0.65);
  groundBounce.position.set(-2, -5, 2);
  scene.add(groundBounce);

  // Warm golden rim light for edges and silhouettes
  const rimLight = new THREE.DirectionalLight(0xffbe85, 1.0);
  rimLight.position.set(-6, 4, -4);
  scene.add(rimLight);

  // ── Upper Sky Sun Corona Disk ─────────────────────────────────────────────
  const createSunTex = () => {
    const cv = document.createElement('canvas');
    cv.width = cv.height = 256;
    const ctx = cv.getContext('2d');
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, 'rgba(255, 255, 252, 1)');
    grad.addColorStop(0.25, 'rgba(255, 240, 190, 0.85)');
    grad.addColorStop(0.6, 'rgba(255, 200, 120, 0.35)');
    grad.addColorStop(1, 'rgba(255, 150, 50, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(128, 128, 128, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(cv);
  };
  const sunTex = createSunTex();
  const sunSpriteMat = new THREE.SpriteMaterial({
    map: sunTex,
    color: 0xfffaee,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const sunSprite = new THREE.Sprite(sunSpriteMat);
  sunSprite.position.set(7.5, 6.2, -10);
  sunSprite.scale.set(7.5, 7.5, 1);
  envGroup.add(sunSprite);

  // ── Compact, Refined Miniature Diorama Pedestal ───────────────────────────
  // 1. Handcrafted Terracotta Ceramic Foundation
  const baseGeom = new THREE.CylinderGeometry(2.55, 2.25, 0.85, 48);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0xd69c76,
    roughness: 0.85,
    metalness: 0.03
  });
  const baseMesh = new THREE.Mesh(baseGeom, baseMat);
  baseMesh.position.y = -0.42;
  baseMesh.receiveShadow = true;
  dioramaRoot.add(baseMesh);

  // 2. Sculpted Lush Green Lawn Cap (Smooth normals, soft beveled rim)
  const lawnGeom = new THREE.CylinderGeometry(2.62, 2.62, 0.22, 48);
  const lawnMat = new THREE.MeshStandardMaterial({
    color: 0x5ebd48, // Fresh vibrant spring grass
    roughness: 0.72,
    metalness: 0.02
  });
  const lawnMesh = new THREE.Mesh(lawnGeom, lawnMat);
  lawnMesh.position.y = 0.11;
  lawnMesh.receiveShadow = true;
  dioramaRoot.add(lawnMesh);

  // ── The Miniature Shelter Cottage (Warm, Supporting Backdrop) ─────────────
  // Scaled down to ~55% so it cradles and supports the characters without overpowering them
  const shelterGroup = new THREE.Group();
  shelterGroup.position.set(-0.45, 0.22, -0.65);
  dioramaRoot.add(shelterGroup);

  const woodWallMat = new THREE.MeshPhysicalMaterial({
    color: 0xfff7ec, // Cream cedar siding
    roughness: 0.82,
    metalness: 0.0,
    sheen: 0.08,
    sheenColor: new THREE.Color(0xffd8bd)
  });
  const woodTrimMat = new THREE.MeshStandardMaterial({
    color: 0xb56c42, // Warm oak timber trim
    roughness: 0.68,
    metalness: 0.06
  });
  const terracottaRoofMat = new THREE.MeshPhysicalMaterial({
    color: 0xeb6b4d, // Warm terracotta coral roof tiles
    roughness: 0.7,
    metalness: 0.0,
    clearcoat: 0.12,
    clearcoatRoughness: 0.72
  });
  const glowingWindowMat = new THREE.MeshStandardMaterial({
    color: 0xffe494,
    emissive: 0xffbe44,
    emissiveIntensity: 0.85,
    roughness: 0.35
  });
  const darkMetalMat = new THREE.MeshStandardMaterial({
    color: 0x3d3531,
    roughness: 0.5,
    metalness: 0.35
  });

  // House Body
  const houseBody = new THREE.Mesh(new THREE.BoxGeometry(1.45, 1.05, 1.2), woodWallMat);
  houseBody.position.y = 0.52;
  houseBody.castShadow = true;
  houseBody.receiveShadow = true;
  shelterGroup.add(houseBody);

  // Structural corner beams sit flush with the walls; porch columns are separate below.
  const pillarGeom = new THREE.BoxGeometry(0.075, 1.04, 0.075);
  const pOffsets = [
    [-0.72, 0.52, -0.6],
    [0.72, 0.52, -0.6],
    [-0.72, 0.52, 0.6],
    [0.72, 0.52, 0.6]
  ];
  pOffsets.forEach(([px, py, pz]) => {
    const pil = new THREE.Mesh(pillarGeom, woodTrimMat);
    pil.position.set(px, py, pz);
    pil.castShadow = true;
    shelterGroup.add(pil);
  });

  // A grounded sill and straight header make the tiny facade read as real joinery.
  const frontSill = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.09, 0.09), woodTrimMat);
  frontSill.position.set(0, 0.08, 0.63);
  frontSill.castShadow = true;
  shelterGroup.add(frontSill);

  const frontHeader = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.1, 0.1), woodTrimMat);
  frontHeader.position.set(0, 1.0, 0.64);
  frontHeader.castShadow = true;
  shelterGroup.add(frontHeader);

  // Gabled Roof
  const roofShape = new THREE.Shape();
  roofShape.moveTo(-0.95, 0);
  roofShape.lineTo(0, 0.75);
  roofShape.lineTo(0.95, 0);
  roofShape.closePath();

  const roofGeom = new THREE.ExtrudeGeometry(roofShape, {
    depth: 1.38,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.04,
    bevelThickness: 0.04
  });
  roofGeom.center();
  const roofMesh = new THREE.Mesh(roofGeom, terracottaRoofMat);
  roofMesh.position.set(0, 1.35, 0);
  roofMesh.castShadow = true;
  roofMesh.receiveShadow = true;
  shelterGroup.add(roofMesh);

  // Chimney
  const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.58, 0.24), woodTrimMat);
  chimney.position.set(0.42, 1.58, -0.25);
  chimney.castShadow = true;
  shelterGroup.add(chimney);

  const chimCap = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.06, 0.32), terracottaRoofMat);
  chimCap.position.set(0.42, 1.88, -0.25);
  shelterGroup.add(chimCap);

  // Front porch: broad deck, two aligned square columns, and a continuous canopy beam.
  const porchDeck = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.08, 0.65), woodTrimMat);
  porchDeck.position.set(0, 0.04, 0.82);
  porchDeck.castShadow = true;
  porchDeck.receiveShadow = true;
  shelterGroup.add(porchDeck);

  const porchStepLower = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.07, 0.22), woodTrimMat);
  porchStepLower.position.set(0.18, 0.035, 1.25);
  porchStepLower.castShadow = true;
  shelterGroup.add(porchStepLower);

  const porchStepUpper = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.06, 0.2), woodWallMat);
  porchStepUpper.position.set(0.1, 0.075, 1.12);
  porchStepUpper.castShadow = true;
  shelterGroup.add(porchStepUpper);

  const postGeom = new THREE.BoxGeometry(0.09, 0.94, 0.09);
  const leftPost = new THREE.Mesh(postGeom, woodTrimMat);
  leftPost.position.set(-0.61, 0.52, 1.05);
  leftPost.castShadow = true;
  shelterGroup.add(leftPost);

  const rightPost = new THREE.Mesh(postGeom, woodTrimMat);
  rightPost.position.set(0.61, 0.52, 1.05);
  rightPost.castShadow = true;
  shelterGroup.add(rightPost);

  const porchBeam = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.1, 0.11), woodTrimMat);
  porchBeam.position.set(0, 1.0, 1.05);
  porchBeam.castShadow = true;
  shelterGroup.add(porchBeam);

  [-0.61, 0.61].forEach((x) => {
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.08, 0.14), woodTrimMat);
    base.position.set(x, 0.09, 1.05);
    shelterGroup.add(base);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.07, 0.14), woodTrimMat);
    cap.position.set(x, 0.97, 1.05);
    shelterGroup.add(cap);
  });

  // Front Door in Sage Green
  const doorLeaf = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.78, 0.03),
    new THREE.MeshStandardMaterial({ color: 0x589e7e, roughness: 0.55 })
  );
  doorLeaf.position.set(0.25, 0.44, 0.61);
  shelterGroup.add(doorLeaf);

  // Glowing Windows
  const frontWin = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.5), glowingWindowMat);
  frontWin.position.set(-0.35, 0.62, 0.61);
  shelterGroup.add(frontWin);

  // Porch Lantern with warm point light
  const lanternPost = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.16), darkMetalMat);
  lanternPost.position.set(-0.05, 0.88, 0.62);
  shelterGroup.add(lanternPost);

  const lanternBulb = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.10, 0.08), glowingWindowMat);
  lanternBulb.position.set(-0.05, 0.80, 0.62);
  shelterGroup.add(lanternBulb);

  const porchLight = new THREE.PointLight(0xffb854, 1.6, 4.0, 1.5);
  porchLight.position.set(-0.05, 0.80, 0.72);
  shelterGroup.add(porchLight);

  // Wooden Signboard: "Trạm Yêu Thương"
  const signBoard = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.18, 0.03), woodTrimMat);
  signBoard.position.set(0.25, 0.94, 0.62);
  shelterGroup.add(signBoard);

  const pawTexCanvas = document.createElement('canvas');
  pawTexCanvas.width = pawTexCanvas.height = 128;
  const pctx = pawTexCanvas.getContext('2d');
  pctx.fillStyle = '#ffffff';
  pctx.beginPath();
  pctx.ellipse(64, 76, 26, 20, 0, 0, Math.PI * 2);
  pctx.fill();
  const toes = [[36, 44], [54, 30], [74, 30], [92, 44]];
  toes.forEach(([tx, ty]) => {
    pctx.beginPath();
    pctx.arc(tx, ty, 9, 0, Math.PI * 2);
    pctx.fill();
  });
  const pawTex = new THREE.CanvasTexture(pawTexCanvas);
  const pawSignMat = new THREE.MeshBasicMaterial({ map: pawTex, transparent: true });
  const pawSignMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.14), pawSignMat);
  pawSignMesh.position.set(0.25, 0.94, 0.64);
  shelterGroup.add(pawSignMesh);

  // ── Supporting Garden Features (Smooth Stylized, Matching Characters) ──────
  const gardenGroup = new THREE.Group();
  dioramaRoot.add(gardenGroup);

  // 1. Single Stylized Blossoming Fruit Tree (Right-rear corner only, never overlaps text)
  const treeGroup = new THREE.Group();
  treeGroup.position.set(1.5, 0.15, -0.7);
  const baseTreeRotationZ = -0.015;
  treeGroup.rotation.z = baseTreeRotationZ;
  gardenGroup.add(treeGroup);

  const trunkGeom = new THREE.CylinderGeometry(0.08, 0.14, 1.15, 12);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8a5b3a, roughness: 0.85 });
  const trunk = new THREE.Mesh(trunkGeom, trunkMat);
  trunk.position.y = 0.58;
  trunk.castShadow = true;
  treeGroup.add(trunk);

  // Visible branching gives the crown believable support without adding visual noise.
  const branchGeom = new THREE.CylinderGeometry(0.035, 0.065, 0.62, 8);
  const branchData = [
    [-0.18, 1.02, 0.02, -0.58, 0.14],
    [0.2, 1.0, -0.04, 0.62, -0.18],
    [-0.02, 1.17, -0.12, 0.18, 0.48]
  ];
  branchData.forEach(([x, y, z, rz, rx]) => {
    const branch = new THREE.Mesh(branchGeom, trunkMat);
    branch.position.set(x, y, z);
    branch.rotation.z = rz;
    branch.rotation.x = rx;
    branch.castShadow = true;
    treeGroup.add(branch);
  });

  // Smooth pillowy cloud foliage (SphereGeometry with smooth shading, NOT faceted low-poly)
  const foliageMats = [0x54ba4a, 0x68c65b, 0x43a944].map((color) => new THREE.MeshStandardMaterial({
    color,
    roughness: 0.72,
    metalness: 0.0
  }));
  const folPuffs = [
    [0, 1.45, 0, 0.72, 1, 0.9, 1, 0],
    [-0.32, 1.30, 0.18, 0.52, 1.1, 0.85, 1, 1],
    [0.34, 1.25, -0.15, 0.54, 0.95, 1, 0.9, 2],
    [-0.12, 1.68, -0.15, 0.48, 1, 0.8, 1, 1]
  ];
  folPuffs.forEach(([ox, oy, oz, r, sx, sy, sz, materialIndex]) => {
    const g = new THREE.SphereGeometry(r, 20, 14);
    const m = new THREE.Mesh(g, foliageMats[materialIndex]);
    m.position.set(ox, oy, oz);
    m.scale.set(sx, sy, sz);
    m.castShadow = true;
    m.receiveShadow = true;
    treeGroup.add(m);
  });

  // Small pastel blossom spheres
  const bMat = new THREE.MeshBasicMaterial({ color: 0xffb2c2 });
  const bGeom = new THREE.SphereGeometry(0.045, 8, 8);
  for (let b = 0; b < 10; b++) {
    const blossom = new THREE.Mesh(bGeom, bMat);
    const angle = b * 0.65;
    blossom.position.set(Math.cos(angle) * 0.62, 1.32 + Math.sin(b * 1.3) * 0.35, Math.sin(angle) * 0.62);
    treeGroup.add(blossom);
  }

  // 2. White Garden Picket Fence (Curving along the back-right lawn edge)
  const fenceMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.68 });
  function createPicket(x, y, z, rotY = 0) {
    const pGroup = new THREE.Group();
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.48, 0.025), fenceMat);
    post.position.y = 0.24;
    pGroup.add(post);

    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.09, 4), fenceMat);
    tip.rotateY(Math.PI * 0.25);
    tip.position.y = 0.52;
    pGroup.add(tip);

    pGroup.position.set(x, y, z);
    pGroup.rotation.y = rotY;
    pGroup.castShadow = true;
    return pGroup;
  }

  const fencePositions = [
    [1.15, 0.16, 0.15],
    [1.38, 0.16, 0.35],
    [1.60, 0.15, 0.60],
    [1.78, 0.15, 0.88]
  ];
  fencePositions.forEach(([fx, fy, fz]) => {
    gardenGroup.add(createPicket(fx, fy, fz, -0.5));
  });

  // Midground shrubs help the house and tree sit inside the lawn instead of on top of it.
  const shrubMat = new THREE.MeshStandardMaterial({ color: 0x469d51, roughness: 0.82 });
  const shrubLightMat = new THREE.MeshStandardMaterial({ color: 0x72c767, roughness: 0.8 });
  const shrubPositions = [
    [-1.82, 0.29, -0.74, 0.34],
    [-1.55, 0.25, -1.05, 0.28],
    [1.93, 0.24, -0.2, 0.3],
    [1.72, 0.22, -1.22, 0.25]
  ];
  shrubPositions.forEach(([x, y, z, scale], index) => {
    const shrub = new THREE.Mesh(
      new THREE.SphereGeometry(1, 14, 10),
      index % 2 ? shrubLightMat : shrubMat
    );
    shrub.position.set(x, y, z);
    shrub.scale.set(scale * 1.35, scale, scale);
    shrub.castShadow = true;
    shrub.receiveShadow = true;
    gardenGroup.add(shrub);
  });

  // Instanced grass gives the foreground a tactile edge with a single draw call.
  const grassBladeGeom = new THREE.ConeGeometry(0.028, 0.2, 5);
  const grassBladeMat = new THREE.MeshStandardMaterial({ color: 0x3d9d43, roughness: 0.88 });
  const grassBladeCount = isMobile ? 18 : 30;
  const grassBlades = new THREE.InstancedMesh(grassBladeGeom, grassBladeMat, grassBladeCount);
  const grassMatrix = new THREE.Matrix4();
  const grassColor = new THREE.Color();
  for (let i = 0; i < grassBladeCount; i++) {
    const angle = (i / grassBladeCount) * Math.PI * 2 + (i % 3) * 0.09;
    const radius = 2.12 + (i % 4) * 0.1;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const scale = 0.78 + (i % 5) * 0.08;
    grassMatrix.compose(
      new THREE.Vector3(x, 0.27, z),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0, angle, (i % 2 ? 1 : -1) * 0.08)),
      new THREE.Vector3(scale, scale, scale)
    );
    grassBlades.setMatrixAt(i, grassMatrix);
    grassColor.set(i % 3 === 0 ? 0x73c85e : i % 3 === 1 ? 0x3e9f46 : 0x58b94d);
    grassBlades.setColorAt(i, grassColor);
  }
  grassBlades.instanceMatrix.needsUpdate = true;
  if (grassBlades.instanceColor) grassBlades.instanceColor.needsUpdate = true;
  grassBlades.castShadow = true;
  grassBlades.receiveShadow = true;
  gardenGroup.add(grassBlades);

  // 3. Smooth Flagstone Stepping Stones leading to characters
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0xe2d9ce, roughness: 0.82 });
  const stoneCoords = [
    [0.15, 0.18, 1.5],
    [0.42, 0.17, 1.8],
    [0.68, 0.16, 2.1]
  ];
  stoneCoords.forEach(([sx, sy, sz], idx) => {
    const sGeom = new THREE.CylinderGeometry(0.18 + (idx % 2) * 0.03, 0.22, 0.04, 16);
    const stone = new THREE.Mesh(sGeom, stoneMat);
    stone.position.set(sx, sy, sz);
    stone.rotation.y = idx * 0.7;
    stone.receiveShadow = true;
    gardenGroup.add(stone);
  });

  // 4. Swaying Spring Wildflowers
  const flowerInstances = [];
  const flowerMatYellow = new THREE.MeshStandardMaterial({ color: 0xffd147, roughness: 0.6 });
  const flowerMatCoral = new THREE.MeshStandardMaterial({ color: 0xff7b60, roughness: 0.6 });
  const flowerMatWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x4aa342, roughness: 0.8 });

  const flowerPositions = [
    [-1.6, 0.15, 0.6, flowerMatYellow],
    [-1.8, 0.14, 1.0, flowerMatCoral],
    [-1.4, 0.15, 1.3, flowerMatWhite],
    [-1.1, 0.16, 1.7, flowerMatYellow],
    [-0.7, 0.17, 1.9, flowerMatCoral],
    [0.9, 0.16, 1.8, flowerMatWhite],
    [1.2, 0.15, 1.5, flowerMatYellow],
    [1.5, 0.14, 1.2, flowerMatCoral],
    [1.7, 0.14, 0.4, flowerMatWhite],
    [1.4, 0.15, -0.1, flowerMatYellow]
  ];

  flowerPositions.forEach(([fx, fy, fz, fColor], i) => {
    const fGroup = new THREE.Group();
    fGroup.position.set(fx, fy, fz);

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.22), stemMat);
    stem.position.y = 0.11;
    fGroup.add(stem);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), fColor);
    head.position.y = 0.22;
    fGroup.add(head);

    gardenGroup.add(fGroup);
    flowerInstances.push({
      group: fGroup,
      baseRotZ: (Math.random() - 0.5) * 0.1,
      speed: 1.8 + Math.random() * 0.8,
      phase: i * 0.55
    });
  });

  // ── Production 3D Character Models: Shiba Dog & Tabby Cat (Focal Point) ──
  const charactersAnchor = new THREE.Group();
  charactersAnchor.name = 'charactersAnchor';
  dioramaRoot.add(charactersAnchor);

  // Grounding Decor: Cozy woven pet rug for cat & stepping flagstone for dog
  const catRugGeom = new THREE.CylinderGeometry(0.55, 0.58, 0.03, 28);
  const catRugMat = new THREE.MeshStandardMaterial({
    color: 0xffdfcb,
    roughness: 0.88,
    metalness: 0.0
  });
  const catRug = new THREE.Mesh(catRugGeom, catRugMat);
  catRug.position.set(-0.44, 0.22, 0.82);
  catRug.receiveShadow = true;
  charactersAnchor.add(catRug);

  const dogStoneGeom = new THREE.CylinderGeometry(0.60, 0.65, 0.03, 28);
  const dogStoneMat = new THREE.MeshStandardMaterial({
    color: 0xe2d9ce,
    roughness: 0.82,
    metalness: 0.04
  });
  const dogStone = new THREE.Mesh(dogStoneGeom, dogStoneMat);
  dogStone.position.set(0.44, 0.22, 0.82);
  dogStone.receiveShadow = true;
  charactersAnchor.add(dogStone);

  // Ceramic pet food & water bowls between them
  const petFoodBowlGeom = new THREE.CylinderGeometry(0.12, 0.08, 0.075, 18);
  const petFoodBowlMat = new THREE.MeshStandardMaterial({ color: 0xff6b4a, roughness: 0.35 });
  const petFoodBowl = new THREE.Mesh(petFoodBowlGeom, petFoodBowlMat);
  petFoodBowl.position.set(0.10, 0.26, 0.96);
  petFoodBowl.castShadow = true;
  petFoodBowl.receiveShadow = true;
  charactersAnchor.add(petFoodBowl);

  const petWaterBowlGeom = new THREE.CylinderGeometry(0.12, 0.08, 0.075, 18);
  const petWaterBowlMat = new THREE.MeshStandardMaterial({ color: 0x58bfe6, roughness: 0.35 });
  const petWaterBowl = new THREE.Mesh(petWaterBowlGeom, petWaterBowlMat);
  petWaterBowl.position.set(-0.10, 0.26, 0.96);
  petWaterBowl.castShadow = true;
  petWaterBowl.receiveShadow = true;
  charactersAnchor.add(petWaterBowl);

  // Dedicated Warm Character Focal Lighting (Ensures vibrant visibility & eye catchlight)
  const petKeyLight = new THREE.DirectionalLight(0xfffaea, 1.5);
  petKeyLight.position.set(2.0, 6.0, 6.0);
  petKeyLight.target = charactersAnchor;
  scene.add(petKeyLight);

  const petFrontFill = new THREE.PointLight(0xfff0dd, 1.2, 5.5, 1.4);
  petFrontFill.position.set(0.0, 1.4, 2.4);
  dioramaRoot.add(petFrontFill);

  // Dog Anchor: Prominently positioned in the sunny foreground
  const dogAnchor = new THREE.Group();
  dogAnchor.name = 'dogAnchor';
  dogAnchor.position.set(0.44, 0.24, 0.82);
  const baseDogRotY = -Math.PI * 0.18;
  dogAnchor.rotation.y = baseDogRotY;
  charactersAnchor.add(dogAnchor);

  // Cat Anchor: Prominently positioned beside the dog in the sunny foreground
  const catAnchor = new THREE.Group();
  catAnchor.name = 'catAnchor';
  catAnchor.position.set(-0.44, 0.24, 0.82);
  const baseCatRotY = Math.PI * 0.15;
  catAnchor.rotation.y = baseCatRotY;
  charactersAnchor.add(catAnchor);

  const gltfLoader = new GLTFLoader();
  let dogBones = {}, catBones = {};

  // Shared geometry/materials/textures are disposed once, including late GLTF responses.
  function disposeObject(root) {
    const resources = new Set();
    root.traverse((child) => {
      if (child.geometry) resources.add(child.geometry);
      if (child.skeleton) resources.add(child.skeleton);
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.filter(Boolean).forEach((material) => {
        Object.values(material).forEach((value) => {
          if (value?.isTexture) resources.add(value);
        });
        resources.add(material);
      });
    });
    resources.forEach((resource) => resource.dispose());
  }

  // 1. Load Shiba Dog GLB
  gltfLoader.load(
    '/assets/models/shiba_dog.glb',
    (gltf) => {
      const model = gltf.scene;
      if (disposed) { disposeObject(model); return; }
      // Prominent scale: 0.92 makes the dog a true emotional focal point
      model.scale.setScalar(0.92);
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.roughness = 0.62;
            child.material.metalness = 0.0;
            child.material.shadowSide = THREE.FrontSide;
            if (child.material.map) {
              child.material.map.colorSpace = THREE.SRGBColorSpace;
            }
            child.material.needsUpdate = true;
          }
        }
        if (child.isBone) {
          child.userData.origRot = child.rotation.clone();
          child.userData.origPos = child.position.clone();
          dogBones[child.name] = child;
        }
      });
      dogAnchor.add(model);
      requestRender();
    },
    undefined,
    (err) => console.warn('Could not load shiba_dog.glb:', err)
  );

  // 2. Load Tabby Cat GLB
  gltfLoader.load(
    '/assets/models/tabby_cat.glb',
    (gltf) => {
      const model = gltf.scene;
      if (disposed) { disposeObject(model); return; }
      // Prominent scale: 0.80 ensures the cat is fully visible, charming, and recognizable
      model.scale.setScalar(0.80);
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.roughness = 0.62;
            child.material.metalness = 0.0;
            child.material.shadowSide = THREE.FrontSide;
            if (child.material.map) {
              child.material.map.colorSpace = THREE.SRGBColorSpace;
            }
            child.material.needsUpdate = true;
          }
        }
        if (child.isBone) {
          child.userData.origRot = child.rotation.clone();
          child.userData.origPos = child.position.clone();
          catBones[child.name] = child;
        }
      });
      catAnchor.add(model);
      requestRender();
    },
    undefined,
    (err) => console.warn('Could not load tabby_cat.glb:', err)
  );

  // ── Floating Sunlit Golden Pollen Motes ────────────────────────────────────
  const MOTE_COUNT = isMobile ? 16 : 32;
  const FIREFLY_COUNT = isMobile ? 4 : 6;
  const motePos = new Float32Array(MOTE_COUNT * 3);
  const moteColors = new Float32Array(MOTE_COUNT * 3);
  const moteData = [];

  for (let i = 0; i < MOTE_COUNT; i++) {
    // Local positions keep both pollen and fireflies inside the diorama, off the copy.
    const angle = i * 2.399;
    const radius = 0.9 + (i % 4) * 0.3;
    const x = Math.cos(angle) * radius;
    const y = 0.48 + (i % 5) * 0.23;
    const z = Math.sin(angle) * radius;
    motePos.set([x, y, z], i * 3);
    moteColors.set([1, 1, 1], i * 3);
    moteData.push({
      x, y, z,
      phase: i * 1.73,
      speed: 0.22 + (i % 4) * 0.045
    });
  }

  const moteGeom = new THREE.BufferGeometry();
  moteGeom.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
  moteGeom.setAttribute('color', new THREE.BufferAttribute(moteColors, 3));

  const createPollenTex = () => {
    const cv = document.createElement('canvas');
    cv.width = cv.height = 64;
    const ctx = cv.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.35, 'rgba(255, 235, 160, 0.85)');
    grad.addColorStop(0.7, 'rgba(255, 190, 100, 0.3)');
    grad.addColorStop(1, 'rgba(255, 180, 80, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(cv);
  };

  const pollenTex = createPollenTex();
  const moteMat = new THREE.PointsMaterial({
    size: 0.28,
    map: pollenTex,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexColors: true,
    color: 0xfffae0
  });
  const motesPoints = new THREE.Points(moteGeom, moteMat);
  dioramaRoot.add(motesPoints);

  // One mix drives every property through a warm dusk into readable moonlight.
  // All colors, lights, and materials are allocated once, never on a theme toggle.
  const palettes = [];
  const colorTrack = (color, dusk, night) => {
    palettes.push({ color, day: color.clone(), dusk: new THREE.Color(dusk), night: new THREE.Color(night) });
  };
  colorTrack(scene.fog.color, 0x483e58, 0x0f152b);
  colorTrack(ambLight.color, 0xd8bfdb, 0x889ee8);
  colorTrack(sunLight.color, 0xffb890, 0xa6c2ff);
  colorTrack(groundBounce.color, 0x9e9070, 0x6078a4);
  colorTrack(rimLight.color, 0xe0a0bb, 0x8ab8ff);
  colorTrack(petKeyLight.color, 0xffd8be, 0xbcd1ff);
  colorTrack(petFrontFill.color, 0xffdab0, 0xffd8b4);
  colorTrack(sunSpriteMat.color, 0xe2b9d5, 0xcbe0ff);
  colorTrack(baseMat.color, 0x9c746e, 0x443242);
  colorTrack(lawnMat.color, 0x638d5d, 0x386b62);
  colorTrack(woodWallMat.color, 0xd0bac0, 0x929eb6);
  colorTrack(woodTrimMat.color, 0x966858, 0x6b5368);
  colorTrack(terracottaRoofMat.color, 0xb46b6b, 0x865e78);
  colorTrack(fenceMat.color, 0xd8c5cb, 0x9cb0d0);
  colorTrack(shrubMat.color, 0x55825c, 0x2e5c5f);
  colorTrack(shrubLightMat.color, 0x769b73, 0x4f7d7c);
  foliageMats.forEach((material, i) => colorTrack(material.color, [0x688860, 0x829d72, 0x587856][i], [0x3c6d6d, 0x558584, 0x2e5959][i]));
  colorTrack(grassBladeMat.color, 0x5f8d5f, 0x4c8a80);
  colorTrack(stemMat.color, 0x5c845c, 0x426e6b);
  colorTrack(stoneMat.color, 0xb8b0b8, 0x8e9bb5);
  colorTrack(dogStoneMat.color, 0xb8b0b8, 0x8e9bb5);
  colorTrack(catRugMat.color, 0xd4b4ba, 0xb098ae);

  function applyTheme() {
    const mix = themeMix * themeMix * (3 - 2 * themeMix);
    palettes.forEach(({ color, day, dusk, night }) => {
      if (mix <= 0.5) color.copy(day).lerp(dusk, mix * 2);
      else color.copy(dusk).lerp(night, mix * 2 - 1);
    });
    const lerp = THREE.MathUtils.lerp;
    ambLight.intensity = lerp(1.4, 0.92, mix);
    sunLight.intensity = lerp(2.2, 1.35, mix);
    groundBounce.intensity = lerp(0.65, 0.40, mix);
    rimLight.intensity = lerp(1.0, 1.9, mix);
    petKeyLight.intensity = lerp(1.5, 1.15, mix);
    petFrontFill.intensity = lerp(1.2, 1.6, mix);
    porchLight.intensity = lerp(1.6, 4.2, mix);
    glowingWindowMat.emissiveIntensity = lerp(0.85, 2.8, mix);
    glowingWindowMat.emissive.setHex(0xff9e3d);

    // Subtle bioluminescent fairytale glow on wildflowers at night
    flowerMatYellow.emissive.setHex(0xffcb3d);
    flowerMatYellow.emissiveIntensity = lerp(0, 0.75, mix);
    flowerMatCoral.emissive.setHex(0xff6e54);
    flowerMatCoral.emissiveIntensity = lerp(0, 0.65, mix);
    flowerMatWhite.emissive.setHex(0xcbe4ff);
    flowerMatWhite.emissiveIntensity = lerp(0, 0.55, mix);

    scene.fog.density = lerp(0.024, 0.028, mix);
    renderer.toneMappingExposure = lerp(1.15, 1.05, mix);
    sunSpriteMat.opacity = lerp(1, 0.72, mix);
    moteMat.opacity = lerp(0.15, 0.88, mix);
    moteMat.size = lerp(0.28, 0.18, mix);
    moteGeom.setDrawRange(0, mix === 1 ? FIREFLY_COUNT : MOTE_COUNT);
  }
  applyTheme();

  // ── Parallax Pointer Interaction ──────────────────────────────────────────
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  let scrollDepth = 0;
  let targetScrollDepth = 0;

  const onPointerMove = (e) => {
    if (prefersReducedMotion || !hasFinePointer) return;
    const cx = window.innerWidth * 0.5;
    const cy = window.innerHeight * 0.5;
    targetMouseX = (e.clientX - cx) / cx;
    targetMouseY = (e.clientY - cy) / cy;
  };
  if (hasFinePointer) {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
  }

  const onScroll = () => {
    if (!hostElement || prefersReducedMotion) return;
    const rect = hostElement.getBoundingClientRect();
    targetScrollDepth = THREE.MathUtils.clamp(-rect.top / Math.max(rect.height * 0.72, 1), 0, 1);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const onResize = () => {
    if (!renderer || !canvas) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    requestRender();
  };
  window.addEventListener('resize', onResize);

  // ── Animation Loop ───────────────────────────────────────────────────────
  let elapsed = 0;
  let lastTime = 0;
  let raf = null;
  let isSceneVisible = true;

  const requestRender = () => {
    if (!disposed && raf === null && isSceneVisible && !document.hidden) {
      lastTime = performance.now();
      raf = requestAnimationFrame(animate);
    }
  };

  const visibilityObserver = new IntersectionObserver(([entry]) => {
    isSceneVisible = entry.isIntersecting;
    if (isSceneVisible) {
      // An offscreen theme switch should already be complete when the scene returns.
      themeMix = targetThemeMix;
      applyTheme();
      requestRender();
    }
    else if (raf !== null) {
      cancelAnimationFrame(raf);
      raf = null;
    }
  }, { threshold: 0.02 });
  if (hostElement) visibilityObserver.observe(hostElement);

  const onVisibilityChange = () => {
    if (document.hidden && raf !== null) {
      cancelAnimationFrame(raf);
      raf = null;
    } else {
      themeMix = targetThemeMix;
      applyTheme();
      requestRender();
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  const onMotionChange = (event) => {
    prefersReducedMotion = event.matches;
    if (prefersReducedMotion) {
      mouseX = mouseY = targetMouseX = targetMouseY = scrollDepth = targetScrollDepth = 0;
      dogAnchor.scale.setScalar(1);
      catAnchor.scale.setScalar(1);
      dogAnchor.rotation.y = baseDogRotY;
      catAnchor.rotation.y = baseCatRotY;
      [...Object.values(dogBones), ...Object.values(catBones)].forEach((bone) => {
        if (bone.userData.origRot) bone.rotation.copy(bone.userData.origRot);
      });
    }
    requestRender();
  };
  motionQuery.addEventListener('change', onMotionChange);

  function animate(now) {
    raf = null;
    if (disposed || !isSceneVisible || document.hidden) return;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    if (!prefersReducedMotion) elapsed += dt;
    const t = prefersReducedMotion ? 0 : elapsed;
    const previousThemeMix = themeMix;
    if (prefersReducedMotion) themeMix = targetThemeMix;
    else if (themeMix !== targetThemeMix) {
      const step = dt / 0.78;
      themeMix += Math.sign(targetThemeMix - themeMix) * Math.min(Math.abs(targetThemeMix - themeMix), step);
    }
    if (themeMix !== previousThemeMix) applyTheme();

    // Smooth pointer damping
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;
    scrollDepth += (targetScrollDepth - scrollDepth) * 0.055;

    // Gentle diorama floating orbit & subtle pointer parallax
    const hoverY = prefersReducedMotion ? 0 : Math.sin(t * 1.0) * 0.025;
    dioramaRoot.position.y = -0.22 + hoverY - scrollDepth * 0.11;
    dioramaRoot.rotation.y = 0.15 + mouseX * 0.11 + (prefersReducedMotion ? 0 : Math.sin(t * 0.35) * 0.02);
    dioramaRoot.rotation.x = -mouseY * 0.055;

    // Camera responsive framing
    camera.position.x = baseCamX + mouseX * 0.32;
    camera.position.y = baseCamY - mouseY * 0.20;
    camera.position.z = baseCamZ + scrollDepth * 0.48;
    camera.lookAt(lookTarget);

    // ── Procedural Organic Character Animation (Rest-Pose Relative) ─────────
    // 1. Gentle character breathing (natural volume expansion, no bone distortion)
    if (!prefersReducedMotion) {
      const dogBreath = Math.sin(t * 2.2) * 0.010;
      const catBreath = Math.sin(t * 2.6 + 0.9) * 0.010;
      dogAnchor.scale.set(1 + dogBreath, 1 + dogBreath * 1.2, 1 + dogBreath);
      catAnchor.scale.set(1 + catBreath, 1 + catBreath * 1.2, 1 + catBreath);

      // 2. Small character body rotation toward the pointer
      dogAnchor.rotation.y = baseDogRotY + mouseX * 0.10;
      catAnchor.rotation.y = baseCatRotY + mouseX * 0.08;

      // 3. Subtle head movement relative to original rest-pose
      if (dogBones['Head'] && dogBones['Head'].userData.origRot) {
        const o = dogBones['Head'].userData.origRot;
        dogBones['Head'].rotation.y = o.y + mouseX * 0.16 + Math.sin(t * 1.5) * 0.025;
        dogBones['Head'].rotation.x = o.x - mouseY * 0.07 + Math.cos(t * 1.3) * 0.02;
      }

      if (catBones['Head'] && catBones['Head'].userData.origRot) {
        const o = catBones['Head'].userData.origRot;
        catBones['Head'].rotation.y = o.y + mouseX * 0.14 + Math.sin(t * 1.4 + 1.2) * 0.025;
        catBones['Head'].rotation.x = o.x - mouseY * 0.05;
      }

      // 4. Subtle tail movement relative to original rest-pose
      if (dogBones['Tail'] && dogBones['Tail'].userData.origRot) {
        const o = dogBones['Tail'].userData.origRot;
        dogBones['Tail'].rotation.y = o.y + Math.sin(t * 4.8) * 0.20;
      }
      if (dogBones['Tail1'] && dogBones['Tail1'].userData.origRot) {
        const o = dogBones['Tail1'].userData.origRot;
        dogBones['Tail1'].rotation.y = o.y + Math.sin(t * 4.8 - 0.4) * 0.16;
      }

      if (catBones['Tail'] && catBones['Tail'].userData.origRot) {
        const o = catBones['Tail'].userData.origRot;
        catBones['Tail'].rotation.y = o.y + Math.sin(t * 1.7) * 0.14;
      }
      if (catBones['Tail1'] && catBones['Tail1'].userData.origRot) {
        const o = catBones['Tail1'].userData.origRot;
        catBones['Tail1'].rotation.y = o.y + Math.sin(t * 1.7 - 0.4) * 0.12;
      }
    }

    // Swaying garden flowers in the gentle breeze
    flowerInstances.forEach((fl) => {
      const breeze = prefersReducedMotion ? 0 : 1;
      fl.group.rotation.z = fl.baseRotZ + Math.sin(t * fl.speed + fl.phase) * 0.10 * breeze;
      fl.group.rotation.x = Math.cos(t * fl.speed * 0.8 + fl.phase) * 0.06 * breeze;
    });

    treeGroup.rotation.z = baseTreeRotationZ + (prefersReducedMotion ? 0 : Math.sin(t * 0.62) * 0.012);

    // Sun breathing corona pulse
    const sunScale = THREE.MathUtils.lerp(7.5, 5.8, themeMix) + (prefersReducedMotion ? 0 : Math.sin(t * 0.5) * 0.08);
    sunSprite.scale.set(sunScale, sunScale, 1);

    // Bounded wandering and independent, slow pulses share the existing particle pass.
    const pArr = moteGeom.attributes.position.array;
    for (let i = 0; i < moteGeom.drawRange.count; i++) {
      const d = moteData[i];
      pArr[i * 3] = d.x + (prefersReducedMotion ? 0 : Math.sin(t * d.speed + d.phase) * 0.24);
      pArr[i * 3 + 1] = d.y + (prefersReducedMotion ? 0 : Math.sin(t * d.speed * 0.7 + d.phase * 1.2) * 0.18);
      pArr[i * 3 + 2] = d.z + (prefersReducedMotion ? 0 : Math.cos(t * d.speed * 0.85 + d.phase) * 0.2);
      const pulse = prefersReducedMotion ? 0.7 : 0.45 + (Math.sin(t * 0.75 + d.phase) + 1) * 0.275;
      const brightness = THREE.MathUtils.lerp(1, pulse, themeMix) * (i < FIREFLY_COUNT ? 1 : 1 - themeMix);
      moteColors[i * 3] = brightness;
      moteColors[i * 3 + 1] = brightness * (1 - themeMix * 0.08);
      moteColors[i * 3 + 2] = brightness * (1 - themeMix * 0.36);
    }
    moteGeom.attributes.position.needsUpdate = true;
    moteGeom.attributes.color.needsUpdate = true;

    renderer.render(scene, camera);
    if (!prefersReducedMotion) raf = requestAnimationFrame(animate);
  }

  requestRender();

  // Trigger entrance readiness
  let introTimer;
  const readyTimer = setTimeout(() => {
    if (!disposed && hostElement) {
      hostElement.classList.add('is-ready');
      introTimer = setTimeout(() => {
        if (!disposed) hostElement.classList.add('intro-done');
      }, prefersReducedMotion ? 0 : 1200);
    }
  }, 100);

  // ── Disposal & Resource Teardown ─────────────────────────────────────────
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(raf);
    clearTimeout(readyTimer);
    clearTimeout(introTimer);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    motionQuery.removeEventListener('change', onMotionChange);
    visibilityObserver.disconnect();

    disposeObject(scene);
    sunLight.shadow.dispose();

    if (renderer) {
      renderer.dispose();
    }
  };
  return {
    dispose,
    setTheme(theme) {
      if (disposed) return;
      targetThemeMix = theme === 'night' ? 1 : 0;
      // Wake a static reduced-motion scene; this does not rebuild any GPU resources.
      requestRender();
    }
  };
}
