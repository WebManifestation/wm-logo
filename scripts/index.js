const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
  window.innerWidth / -2,
  window.innerWidth / 2,
  window.innerHeight / 2,
  window.innerHeight / -2,
  1,
  2000
);

// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   2000
// );

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setPixelRatio(Math.max(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;
document.body.appendChild(renderer.domElement);

//Init orbit controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  // controls.enableZoom = false;
  // controls.minPolarAngle = (60 * Math.PI) / 180;
  // controls.maxPolarAngle = (120 * Math.PI) / 180;
  // controls.maxAzimuthAngle = (32 * Math.PI) / 180;
  // controls.minAzimuthAngle = (-32 * Math.PI) / 180;
  controls.maxZoom = 3;
  controls.minZoom = 1;
// controls.maxDistance = 600;

//Init root loader
const rootLoader = new THREE.LoadingManager();

rootLoader.onProgress = (url, itemsLoaded, itemsTotal) => {
  console.log(itemsLoaded, itemsTotal, url);
};

rootLoader.onLoad = () => {
  console.log("Loaded all");
};

//Init gltf loader
const gltfLoader = new THREE.GLTFLoader(rootLoader);

//Init texture loader
const textureLoader = new THREE.TextureLoader(rootLoader);

//Load Texture
const bakedTexture = textureLoader.load("assets/final.jpg");
bakedTexture.flipY = false;
bakedTexture.encoding = THREE.sRGBEncoding;

const baseMaterial = new THREE.MeshBasicMaterial({
  map: bakedTexture,
});

//Load mesh
gltfLoader.load("assets/wm.glb", (gltf) => {
  gltf.scene.scale.set(50, 50, 50);
  gltf.scene.position.z = 100
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.material = baseMaterial;
    }
  });
  scene.add(gltf.scene);
});

// Add mesh
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

// scene.add(cube);

camera.position.z = -600;
controls.update();

animate();

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  controls.update();

  renderer.render(scene, camera);
}
