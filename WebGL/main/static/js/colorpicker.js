var colorWell;
var defaultColor = "#0000ff";
let renderer, scene, camera;
let material;
let mouseX=0, mouseY=0;

let pet;
let pointer;

function THREE_start() {
  console.log("JustColor !")
  //start
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);

  scene.background = new THREE.Color(defaultColor);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("threejs_canvas").appendChild(renderer.domElement);
  
  const pointer_g = new THREE.BoxGeometry(1,1)
  const pointer_m = new THREE.MeshPhongMaterial({
    color:0xebe533
  });
  pointer = new THREE.Mesh(pointer_g, pointer_m);
  scene.add(pointer);

  pet = new THREE.Object3D();
  const face = new THREE.BoxGeometry(1, 1);
  material = new THREE.MeshPhongMaterial({});
  scene.add(new THREE.Mesh(face, material));
  
  // lights
  const dirLight1 = new THREE.DirectionalLight(0x602733);
  dirLight1.position.set(0, 1, 0);
  scene.add(dirLight1);

  const ambientLight = new THREE.AmbientLight(0x8c8c8c);
  scene.add(ambientLight);

  //window resize 대응
  window.addEventListener('resize', onWindowResize, false);
  //mouse move 대응
  document.addEventListener("mousemove", function (event) { mouseMove(event); });
}

function THREE_update(){
  const time = requestAnimationFrame(THREE_update) * 0.01;

  //update pointer 3d position
  pointer.position.set(mouseX,mouseY,0); 
  

  // head_anchor.lookAt(propeller)
  colorWell = document.querySelector("#colorWell");
  const col = colorWell.value;
  const b = new THREE.Color(col)
  // console.log(col.replace("#",''));
  material.color = b;
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function mouseMove(event) {
  mouseX = event.clientX;
  mouseY = window.innerHeight-event.clientY;
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
    colorWell.select();

    THREE_start();
    THREE_update();
}