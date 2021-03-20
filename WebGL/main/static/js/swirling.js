import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { RGBELoader } from '../jsm/loaders/RGBELoader.js';

let renderer, scene, camera, contorls;
start();
update();

function start() {
  console.log("basic.js onload")
  //start
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  camera = new THREE.OrthographicCamera(
    -1, // left
      1, // right
      1, // top
    -1, // bottom
    -1, // near,
      1, // far
  );
  // renderer.autoClearColor = false;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("threejs_canvas").appendChild(renderer.domElement);

  contorls = new OrbitControls(camera, renderer.domElement);
  
  const plane = new THREE.PlaneGeometry(2, 2);
 
  const fShader = document.getElementById('fragmentShader').innerHTML;
  const loader = new THREE.TextureLoader();
  const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/bayer.png');
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  const uniforms = {
    iTime: { value: 0 },
    iResolution:  { value: new THREE.Vector3() },
    iMouse:  { value: new THREE.Vector4() },
    iChannel0: { value: texture },
  };

  const material = new THREE.ShaderMaterial({
    uniforms:uniforms,
    fragmentShader:fShader,
  });

  scene.add(new THREE.Mesh(plane, material));
  
  //window resize 대응
  window.addEventListener('resize', onWindowResize, false);
}

function update(){
  requestAnimationFrame(update);
  const time = Date.now() * 0.001;  // convert to seconds
  
  // const canvas = renderer.domElement;
  // uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
  // uniforms.iTime.value = time;

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

