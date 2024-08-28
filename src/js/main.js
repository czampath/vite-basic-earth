import '../css/style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { EffectComposer } from 'three/examples/jsm/Addons.js';
import { RenderPass } from 'three/examples/jsm/Addons.js';
import { generateStarDome } from './star-dome';
import { getFresnelMat } from './getFresnelMat';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const canvas = document.querySelector("#bg");

const w = parseInt(window.getComputedStyle(canvas).getPropertyValue("width"));
const h = parseInt(window.getComputedStyle(canvas).getPropertyValue("height"));

//Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,  w / h, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: canvas,
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
camera.position.set(15,-.2,40);
renderer.render(scene, camera);

//texture Loader
const textureLoader =  new THREE.TextureLoader();

// model loader
const modelLoader = new GLTFLoader();

let modelScale = .12

modelLoader.load( './models/iss_s.glb', function ( gltf ) {
  const model = gltf.scene;
  model.scale.set(modelScale,modelScale,modelScale)
  model.position.set(0,-.2,28);
  model.rotation.set(1.5,1,0)
  scene.add( model );

}, undefined, function ( error ) {
  console.error( error );
});

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup)

//Sphere Geom
const earthGeometry = new THREE.IcosahedronGeometry(25,50);

// high-res textures are commented out
const earthMaterial = new THREE.MeshPhongMaterial({ 
  // map: loader.load("./textures/earthmap1k.jpg"),
  map: textureLoader.load("./textures/8k/8k_earth_daymap.jpg"),
  // map: textureLoader.load("./textures/16k/2_no_clouds_16k.jpg"),
  bumpMap: textureLoader.load("./textures/16k/elev_bump_16k.jpg"),
  bumpScale: 6,
  // map: loader.load("./textures/16k/1_earth_16k.jpg")
});

const earthMesh = new THREE.Mesh(earthGeometry,earthMaterial);
earthMesh.position.set(0, 0, 0);
earthMesh.receiveShadow = true;
earthGroup.add(earthMesh)

// const lightMapTexture = textureLoader.load('./textures/16k/5_night_16k.jpg');
const lightMapTexture = textureLoader.load('./textures/8k/8k_earth_nightmap.jpg');

const lightsMaterial = new THREE.MeshStandardMaterial({
  // map: loader.load("./textures/earthlights1k.jpg"),
  // map: loader.load("./textures/8k/8k_earth_nightmap.jpg"),
  map: lightMapTexture,
  emissive: 0xffffff,
  emissiveMap: lightMapTexture,
  emissiveIntensity: 0.05,
  blending: THREE.AdditiveBlending,
  transparent: true
})

const lightsMesh = new THREE.Mesh(earthGeometry, lightsMaterial)
lightsMesh.scale.setScalar(1.000)
earthGroup.add(lightsMesh)


const cloudMaterial = new THREE.MeshStandardMaterial({
  // map: loader.load("./textures/earthcloudmap.jpg"),
  // map: loader.load("./textures/8k/8k_earth_clouds.jpg"),
  // map: loader.load("./textures/8k/fair_clouds_8k.jpg"),
  // map: loader.load("./textures/8k/australia_clouds_8k.jpg"),
  // map: loader.load("./textures/8k/storm_clouds_8k.jpg"),
  map: textureLoader.load("./textures/8k/africa_clouds_8k.jpg"),
  blending: THREE.AdditiveBlending,
  transparent: true,
  opacity: .2
})

const cloudsMesh = new THREE.Mesh(earthGeometry, cloudMaterial)
cloudsMesh.scale.setScalar(1.01)
cloudsMesh.castShadow = true;
cloudsMesh.rotation.y += .9
earthGroup.add(cloudsMesh)

//second cloud layer
const cloudMaterial2 = new THREE.MeshStandardMaterial({
  // map: loader.load("./textures/earthcloudmap.jpg"),
  map: textureLoader.load("./textures/8k/8k_earth_clouds.jpg"),
  // map: loader.load("./textures/8k/fair_clouds_8k.jpg"),
  // map: loader.load("./textures/8k/australia_clouds_8k.jpg"),
  // map: loader.load("./textures/8k/storm_clouds_8k.jpg"),
  // map: loader.load("./textures/8k/africa_clouds_8k.jpg"),
  blending: THREE.AdditiveBlending,
  transparent: true,
  opacity: .9
})

const cloudsMesh2 = new THREE.Mesh(earthGeometry, cloudMaterial2)
cloudsMesh2.scale.setScalar(1.013)
cloudsMesh2.castShadow = true;
cloudsMesh2.rotation.y += .5
earthGroup.add(cloudsMesh2)


//Fresnel glow
const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(earthGeometry,fresnelMat)
glowMesh.scale.setScalar(1.014)
earthGroup.add(glowMesh)

//Directional Light
const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-2, .5, 2)
sunLight.castShadow = true;
scene.add(sunLight)

//Set up shadow properties for the light
sunLight.shadow.mapSize.width = 512; // default
sunLight.shadow.mapSize.height = 512; // default
sunLight.shadow.camera.near = 0.5; // default
sunLight.shadow.camera.far = 500; // default

const helper = new THREE.CameraHelper( sunLight.shadow.camera );
// scene.add( helper );

//Camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.zoomSpeed = 0.2

//Composer
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene,camera);

generateStarDome(scene,.3,.5)

composer.addPass(renderPass);


//Camera movement toggle
const newCameraPosition = new THREE.Vector3(550,2, -300);
let cameraToggle = false;

const btnContainer = document.createElement("div")
btnContainer.style = "position: absolute; top: 5%; left: 50%; transform: translate(-50%, 50%); display: flex; gap: 5px; flex-direction: column;"

const button = document.createElement('button');
button.innerText = 'Move In/Out';
button.style = ""
btnContainer.appendChild(button);

const circleButton = document.createElement('button');
circleButton.innerText = 'Go Around';
circleButton.style = "";
btnContainer.appendChild(circleButton);
document.body.appendChild(btnContainer);


function easeInOutCustom(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Function to smoothly move the camera
function moveCamera(targetPosition) {
  const duration = 10; 
  const initialPosition = camera.position.clone();
  const startTime = performance.now();

  function animate(time) {
      const elapsedTime = (time - startTime) / 1000;
      let t = Math.min(elapsedTime / duration, 1); 

      t = easeInOutCustom(t);

      camera.position.lerpVectors(initialPosition, targetPosition, t);

      if (t < 1) {
          requestAnimationFrame(animate);
      }
  }
  requestAnimationFrame(animate);
}

// move camera around the globe
function moveCameraInCircle(duration, center = new THREE.Vector3(0, 0, 0)) {
  const startTime = performance.now();
  
  const initialX = camera.position.x - center.x;
  const initialZ = camera.position.z - center.z;
  const initialRadius = Math.sqrt(initialX * initialX + initialZ * initialZ);
  const initialAngle = Math.atan2(initialZ, initialX);

  function animate(time) {
      const elapsedTime = (time - startTime) / 1000;
      let t = Math.min(elapsedTime / duration, 1); 

      t = easeInOutCustom(t);

      const angle = initialAngle + t * Math.PI * 2; 
      const radius = initialRadius; 
      const x = center.x + radius * Math.cos(angle);
      const z = center.z + radius * Math.sin(angle);

      camera.position.set(x, camera.position.y, z);
      camera.lookAt(center);

      if (t < 1) {
          requestAnimationFrame(animate);
      }
  }

  requestAnimationFrame(animate);
}

button.addEventListener('click', () => {
  cameraToggle = !cameraToggle;
  const targetPosition = cameraToggle ? newCameraPosition : new THREE.Vector3(15,-.2,40);
  moveCamera(targetPosition);
});

circleButton.addEventListener('click', () => {
  moveCameraInCircle(10);
});

//dynamic zoom-speed / scroll-damping relative to the distance
const center = new THREE.Vector3(0, 0, 0);
function updateDamping() {
    const distance = camera.position.distanceTo(center);
    const tooClose = 30;
    const nearLimit = 70;
    const farLimit = 500;
    if( distance < tooClose){
      controls.zoomSpeed = 0.05
      controls.dampingFactor = 0.002;
    } else if (distance < nearLimit) {
        controls.dampingFactor = 0.008;
        controls.zoomSpeed = 0.2
    } else if (distance > farLimit) {
        controls.dampingFactor = 0.1; 
        controls.zoomSpeed = 1
    } else {
        controls.dampingFactor = 0.1 + (1 - (distance - nearLimit) / (farLimit - nearLimit)) * 0.1;
    }
}


//Render
function render(){
  composer.render();
}

let speedFactor = 0.5;
//Animator
function animate(){
  
  render();
  requestAnimationFrame(animate);

  updateDamping();
  earthMesh.rotation.y += 0.00015 * speedFactor
  lightsMesh.rotation.y += 0.00015 * speedFactor
  glowMesh.rotation.y += 0.00015 * speedFactor
  cloudsMesh2.rotation.y += 0.00019 * speedFactor
  cloudsMesh.rotation.y += 0.00032 * speedFactor

  controls.update();
  onWindowResize();
}

function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
}

window.addEventListener("resize", onWindowResize);
animate();