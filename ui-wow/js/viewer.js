
import { ttsSpeak } from './tts.js';
let THREE, OrbitControls, GLTFLoader;
let scene,camera,renderer,controls,clock;
let pebble, idlePhase=0, isTalking=false;
export async function initViewer(mods){
  THREE=mods.THREE; OrbitControls=mods.OrbitControls; GLTFLoader=mods.GLTFLoader;
  clock=new THREE.Clock();
  scene=new THREE.Scene(); scene.background=new THREE.Color(0xf5f9ff);
  const container=document.getElementById('viewer');
  const w=container.clientWidth||600, h=container.clientHeight||400;
  camera=new THREE.PerspectiveCamera(45,w/h,0.1,100); camera.position.set(0.8,1.2,2.2);
  renderer=new THREE.WebGLRenderer({antialias:true}); renderer.setSize(w,h); container.appendChild(renderer.domElement);
  controls=new OrbitControls(camera, renderer.domElement); controls.enableDamping=true;
  const hemi=new THREE.HemisphereLight(0xffffff,0x88aadd,0.8); scene.add(hemi);
  const dir=new THREE.DirectionalLight(0xffffff,0.9); dir.position.set(3,5,2); dir.castShadow=true; scene.add(dir);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(10,10), new THREE.MeshStandardMaterial({color:0xf0f4ff}));
  ground.rotation.x=-Math.PI/2; ground.position.y=-0.01; ground.receiveShadow=true; scene.add(ground);
  animate(); window.addEventListener('resize',onResize);
}
function onResize(){ const container=document.getElementById('viewer'); const w=container.clientWidth||600,h=container.clientHeight||400; camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h); }
export async function loadGLBFromFile(file){ const url=URL.createObjectURL(file); await loadGLB(url); URL.revokeObjectURL(url); }
async function loadGLB(url){
  const loader=new GLTFLoader();
  return new Promise((resolve,reject)=>{
    loader.load(url,(gltf)=>{ if(pebble) scene.remove(pebble); pebble=gltf.scene; pebble.traverse((o)=>{ if(o.isMesh){o.castShadow=true;o.receiveShadow=true;} }); pebble.position.set(0,0,0); scene.add(pebble); resolve(); },undefined,reject);
  });
}
function animate(){ requestAnimationFrame(animate); const dt=clock.getDelta(); controls.update(); if(pebble){ idlePhase+=dt; const bounce=Math.sin(idlePhase*2)*0.02; pebble.position.y=0.02+bounce; if(isTalking){ const s=1.0+Math.sin(idlePhase*20)*0.03; pebble.scale.set(s,1.0,s);} else { pebble.scale.set(1,1,1);} } renderer.render(scene,camera); }
export async function sayLine(text){ try{ isTalking=true; await ttsSpeak(text);} finally{ isTalking=false; } }
