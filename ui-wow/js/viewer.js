import { ttsSpeak } from './tts.js';

let THREE, OrbitControls, GLTFLoader;
let scene, camera, renderer, controls, clock;
let pebble, idlePhase = 0, isTalking = false;

export async function initViewer(mods) {
  THREE = mods.THREE;
  OrbitControls = mods.OrbitControls;
  GLTFLoader = mods.GLTFLoader;

  clock = new THREE.Clock();

  // transparent scene
  scene = new THREE.Scene();
  scene.background = null;

  const container = document.getElementById('viewer');
  const w = container.clientWidth || 600;
  const h = container.clientHeight || 400;

  camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.set(0.8, 1.2, 2.2);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(w, h);
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const hemi = new THREE.HemisphereLight(0xffffff, 0x88aadd, 0.8);
  scene.add(hemi);

  const dir = new THREE.DirectionalLight(0xffffff, 1.1);
  dir.position.set(3, 5, 2);
  dir.castShadow = true;
  scene.add(dir);

  animate();
  window.addEventListener('resize', onResize);
}

function onResize() {
  const container = document.getElementById('viewer');
  const w = container.clientWidth || 600;
  const h = container.clientHeight || 400;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

export async function loadGLBFromFile(file) {
  const url = URL.createObjectURL(file);
  await loadGLB(url);
  URL.revokeObjectURL(url);
}

async function loadGLB(url) {
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        if (pebble) scene.remove(pebble);
        pebble = gltf.scene;
        pebble.traverse((o) => {
          if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
        });
        scene.add(pebble);

        // center + scale + set camera comfortably
        fitToView(pebble, { offset: 1.35 });
        resolve();
      },
      undefined,
      reject
    );
  });
}

/* Center object at origin, scale to comfy size, and set camera/controls */
function fitToView(object, { offset = 1.25 } = {}) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  // move model so its center is at (0,0,0)
  object.position.sub(center);

  // distance for full view (with a little breathing room)
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = THREE.MathUtils.degToRad(camera.fov);
  const distance = (maxDim / 2) / Math.tan(fov / 2) * offset;

  // place camera on a nice diagonal
  const dir = new THREE.Vector3(1, 0.5, 1).normalize();
  camera.position.copy(dir.multiplyScalar(distance));
  camera.near = distance / 100;
  camera.far  = distance * 100;
  camera.updateProjectionMatrix();

  // orbit focus & limits
  controls.target.set(0, 0, 0);
  controls.maxDistance = distance * 4;
  controls.minDistance = distance / 10;
  controls.update();
}

function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();
  controls.update();

  if (pebble) {
    // gentle idle bounce
    idlePhase += dt;
    const bounce = Math.sin(idlePhase * 2) * 0.02;
    pebble.position.y = 0.02 + bounce;

    // subtle talk wiggle
    if (isTalking) {
      const s = 1.0 + Math.sin(idlePhase * 20) * 0.03;
      pebble.scale.set(s, 1.0, s);
    } else {
      pebble.scale.set(1, 1, 1);
    }
  }

  renderer.render(scene, camera);
}

export async function sayLine(text) {
  try {
    isTalking = true;
    await ttsSpeak(text);
  } finally {
    isTalking = false;
  }
}
