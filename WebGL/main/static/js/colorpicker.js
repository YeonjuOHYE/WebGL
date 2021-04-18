import { FBXLoader } from '../jsm/loaders/FBXLoader.js';

var colorWell;
var defaultColor = getRandomColor();
let col = new THREE.Color(defaultColor)
let renderer, scene, camera;
let material;
let mouseX = 0, mouseY = 0;

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
  loader.load('/media/main/colorpicker/windmill.fbx', function (object) {

    object.scale.set(0.01, 0.01, 0.01)
    object.position.set(0, -0.3, 0)
    object.rotation.set(15 * Math.PI / 180, 100 * Math.PI / 180, 0)
    pet.add(object);

  });

  scene.add(pet);
  pet.position.y = 0.4

  // add lights
  dirLight1 = new THREE.DirectionalLight(defaultColor);
  dirLight1.position.set(0, 0, 1);
  dirLight1.intensity = 0.5;
  scene.add(dirLight1);
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 200, 0);
  scene.add(hemiLight);

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

function THREE_update() {
  requestAnimationFrame(THREE_update) * 0.01;

  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  pet.rotation.y = lerp(pet.rotation.y, mouseX, 0.2)
  pet.rotation.x = lerp(pet.rotation.x, mouseY, 0.2)

  dirLight1.color = col;
  scene.background = col;

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
function getRandomColor() {
  let h = Math.random(), s = 0.5, l = 0.7;
  let randomColor = new THREE.Color();
  randomColor.setHSL(h, s, l);

  return "#" + randomColor.getHexString();
}
function RGBtoCMYK(r, g, b) {
  const k = 1 - Math.max(r, g, b);
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);

  return [c, m, y, k];
}
window.addEventListener("load", startup, false);
function startup() {
  colorWell = document.querySelector("#colorWell");
  const colorButton = document.querySelector("#colorButton");
  const colorPanel = document.querySelector("#colorPanel");
  const tags = document.querySelectorAll("#colorTable span");

  colorWell.value = defaultColor;
  tags.forEach(tag => {
    tag.addEventListener("click", (event) => {
      console.log("Ge");
      var tempElem = document.createElement('textarea');
      tempElem.value = tag.innerText;
      document.body.appendChild(tempElem);

      tempElem.select();
      document.execCommand("copy");
      document.body.removeChild(tempElem);
      var x = document.querySelector("#snackbar2");
      x.innerText = tag.innerText + " copied"
      console.log(x);
      x.className = "show";
      setTimeout(function () { x.className = x.className.replace("show", ""); }, 2000);
    });
  });
  colorWell.addEventListener("input", (event) => {
    col = new THREE.Color(colorWell.value);

    const r = col.r;
    const g = col.g;
    const b = col.b;
    const cmyk = RGBtoCMYK(r, g, b);
    let hsl = { h: 0, s: 0, l: 0 };
    col.getHSL(hsl);
    //set tags info
    // hex
    tags[0].innerText = "#" + col.getHexString();
    tags[1].innerText = col.getHexString();
    // rgb
    tags[2].innerText = (r * 255).toFixed(0);
    tags[3].innerText = (g * 255).toFixed(0);
    tags[4].innerText = (b * 255).toFixed(0);
    tags[5].innerText = r.toFixed(2);
    tags[6].innerText = g.toFixed(2);
    tags[7].innerText = b.toFixed(2);
    // cmyk
    tags[8].innerText = (cmyk[0] * 255).toFixed(0);
    tags[9].innerText = (cmyk[1] * 255).toFixed(0);
    tags[10].innerText = (cmyk[2] * 255).toFixed(0);
    tags[11].innerText = (cmyk[3] * 255).toFixed(0);
    tags[12].innerText = cmyk[0].toFixed(2);
    tags[13].innerText = cmyk[1].toFixed(2);
    tags[14].innerText = cmyk[2].toFixed(2);
    tags[15].innerText = cmyk[3].toFixed(2);
    //hsl
    tags[16].innerText = (hsl.h * 255).toFixed(0);
    tags[17].innerText = (hsl.s * 255).toFixed(0);
    tags[18].innerText = (hsl.l * 255).toFixed(0);
    tags[19].innerText = hsl.h.toFixed(2);
    tags[20].innerText = hsl.s.toFixed(2);
    tags[21].innerText = hsl.l.toFixed(2);

    colorButton.style.marginTop = "50vh";
    colorWell.style.marginTop = "50vh";
    colorPanel.style.marginTop = "65vh";
  }, false);


  THREE_start();
  THREE_update();
}