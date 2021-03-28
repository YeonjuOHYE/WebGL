import { OrbitControls } from "../jsm/controls/OrbitControls.js";
import { RGBELoader } from '../jsm/loaders/RGBELoader.js';

// standard global variables
var container, scene, camera, renderer, controls, sphereGeom, sphere, base;


init();
animate();


// FUNCTIONS 		
function init() {
  // SCENE
  scene = new THREE.Scene();
  // CAMERA
  var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
  var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  scene.add(camera);
  camera.position.set(-100, 150, 300);
  camera.lookAt(scene.position);
  // RENDERER
  if (Detector.webgl)
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  else
    renderer = new THREE.CanvasRenderer();
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  container = document.getElementById('ThreeJS');
  container.appendChild(renderer.domElement);
  // EVENTS
  THREEx.WindowResize(renderer, camera);
  THREEx.FullScreen.bindKey({ charCode: 'm'.charCodeAt(0) });
  // CONTROLS
  controls = new OrbitControls(camera, renderer.domElement);


  ////////////
  // CUSTOM //
  ////////////


  // radius, segments along width, segments along height
  sphereGeom = new THREE.SphereBufferGeometry(150, 32, 16);
  base = sphereGeom.attributes.position.array.slice()
  const sphereM = new THREE.MeshPhysicalMaterial({
    map: null,
    color: 0xffffff,
    metalness: 1,
    roughness: 0.13,
    opacity: 0.1,
    side: THREE.FrontSide,
    transparent: true,
    envMapIntensity: 1,
    premultipliedAlpha: true,
    reflectivity: 0
  });
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  new RGBELoader()
    .setDataType(THREE.UnsignedByteType)
    .setPath('/media/main/jewelry/')
    .load('royal_esplanade_1k.hdr', function (hdrEquirect) {

      const hdrCubeRenderTarget = pmremGenerator.fromEquirectangular(hdrEquirect);
      pmremGenerator.dispose();

      sphereM.envMap = hdrCubeRenderTarget.texture;
      sphereM.needsUpdate = true;
      hdrEquirect.dispose();
    });
   sphere = new THREE.Mesh(sphereGeom, sphereM);
  sphere.position.set(-100, 50, 100);
  scene.add(sphere);

}

function animate() {
  requestAnimationFrame(animate);
  render();
}



function render() {

  const timer = Date.now() * 0.00025;
  

    const norm =  sphereGeom.attributes.normal.array;
    sphereGeom.attributes.position.array.forEach((val,i,arr)=>{
        const place = i % 3;
        if(place ===0) //x
        {
            arr[i] = base[i] + norm[i] * Math.sin((i*0.001+timer*10)*1.5 ) *0.2;
        }
        if(place ===1) //y
        {
            arr[i] = base[i] + norm[i] * Math.sin((i*0.002+ timer*5)*1 ) *0.1;
        }
        if(place ===2) //z
        {
            // arr[i] = base[i] + norm[i] * Math.sin(timer*10 ) *0.5;
        }
    });
    sphereGeom.computeVertexNormals()
    sphereGeom.normalizeNormals();
    sphereGeom.attributes.position.needsUpdate = true;

    sphere.rotation.set(0,0,timer);
  renderer.render(scene, camera);
}
