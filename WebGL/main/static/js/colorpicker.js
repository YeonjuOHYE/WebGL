
var colorWell;
var defaultColor = "#0000ff";

window.addEventListener("load", startup, false);
function startup() {
    colorWell = document.querySelector("#colorWell");
    colorWell.value = defaultColor;
    colorWell.addEventListener("input", updateFirst, false);
    colorWell.addEventListener("change", updateAll, false);
    colorWell.select();
}

function updateFirst(event) {
    var p = document.querySelector("h3");
  
    if (p) {
        p.style.color = event.target.value;
    }
}
function updateAll(event) {
    console.log("bye")
    document.querySelectorAll("h3").forEach(function(p) {
        p.style.color = event.target.value;
    });
}

let renderer, scene, camera;
let material;
let mouseX=0, mouseY=0;
start();
update();

function start() {
  console.log("basic.js onload")
  //start
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 3, 5);
    camera.lookAt(0, 0, 0);
  scene.background = new THREE.Color(0x303030);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("threejs_canvas").appendChild(renderer.domElement);
  
  const plane = new THREE.PlaneGeometry(2, 2);
  material = new THREE.MeshBasicMaterial({
    color:0xffcc00
    });
  scene.add(new THREE.Mesh(plane, material));
  
  //window resize 대응
  window.addEventListener('resize', onWindowResize, false);
  //mouse move 대응
  document.addEventListener("mousemove", function (event) { mouseMove(event); });
}

function update(){
  
  const time = requestAnimationFrame(update) * 0.01;
  
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