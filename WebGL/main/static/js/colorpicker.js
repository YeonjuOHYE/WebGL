import { FBXLoader } from '../jsm/loaders/FBXLoader.js';

var colorWell;
var defaultColor = "#1d1d1d";
let renderer, scene, camera;
let material;
let mouseX=0, mouseY=0;

let dirLight1;
let pet;

let clock = new THREE.Clock();
let mixer;

function THREE_start() {
  console.log("JustColor !")
  //start
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);

  scene.background = new THREE.Color(defaultColor);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.getElementById("threejs_canvas").appendChild(renderer.domElement);

  camera.position.set(0, 0, 3);
  camera.lookAt(0, 0, 0);

  //add pet
  pet = new THREE.Object3D();
  // model
  const loader = new FBXLoader();
  loader.load( '/media/main/colorpicker/windmill.fbx', function ( object ) {

    object.scale.set(0.01,0.01,0.01)
    object.position.set(0,-0.3,0)
    object.rotation.set(15 * Math.PI/180,80 * Math.PI/180,0)
    pet.add( object );

  } );

  scene.add(pet);
  pet.position.y = 0.4

  // add lights
  dirLight1 = new THREE.DirectionalLight(defaultColor);
  dirLight1.position.set(0,0, 1);
  dirLight1.intensity = 0.5;
  scene.add(dirLight1);
  const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
  hemiLight.position.set( 0, 200, 0 );
  scene.add( hemiLight );

  // const dirLight = new THREE.DirectionalLight( 0xffffff );
	// 			dirLight.position.set( 0, 200, 100 );
	// 			dirLight.castShadow = true;
	// 			dirLight.shadow.camera.top = 180;
	// 			dirLight.shadow.camera.bottom = - 100;
	// 			dirLight.shadow.camera.left = - 120;
	// 			dirLight.shadow.camera.right = 120;
	// 			scene.add( dirLight );

  const ambientLight = new THREE.AmbientLight(0x8c8c8c);
  scene.add(ambientLight);

  //window resize 대응
  window.addEventListener('resize', onWindowResize, false);
  //mouse move 대응
  document.addEventListener("mousemove", function (event) { mouseMove(event); });
}

function THREE_update(){
  requestAnimationFrame(THREE_update) * 0.01;

  const delta = clock.getDelta();
  if ( mixer ) mixer.update( delta );

  pet.rotation.y = lerp(pet.rotation.y, mouseX, 0.2)
  pet.rotation.x = lerp(pet.rotation.x, mouseY, 0.2)

  colorWell = document.querySelector("#colorWell");
  const col = colorWell.value;
  const b = new THREE.Color(col)
  
  // material.color = b;\
  dirLight1.color = b;
  scene.background = b;
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function mouseMove(event) {
  mouseX = event.clientX * 2 / window.innerWidth - 1; //-1 ~1
  mouseY = event.clientY * 2 / window.innerHeight - 1; //-1 ~1
}

function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end
}

window.addEventListener("load", startup, false);
function startup() {
    colorWell = document.querySelector("#colorWell");
    colorWell.value = defaultColor;
    colorWell.addEventListener("input", (evnet)=>{
      var p = document.querySelector("h3");
  
      if (p) {
          p.style.color = event.target.value;
      }
    }, false);
    colorWell.addEventListener("change", (evnet)=>{
      console.log("bye")
      document.querySelectorAll("h3").forEach(function(p) {
          p.style.color = event.target.value;
      });
      
    }, false);
    
    THREE_start();
    THREE_update();
}