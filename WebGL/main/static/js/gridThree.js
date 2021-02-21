import { OrbitControls } from "../jsm/controls/OrbitControls.js";
import { GUI } from "../jsm/gui/dat.gui.module.js";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const makeCube = function (x, y, z) {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({
    color: Math.random() * 0xffffff,
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y, z);
  return cube;
};

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.update();

let initialTarget = [0, 2, 3];
const initialAngle = 0;
const targetRadius = 30;

function degToRad(d) {
  return (d * Math.PI) / 180;
}
//attach gui
class FogGUIHelper {
  constructor(target, angle) {
    this.target = target;
    this.angle = angle;
  }

  getTarget() {
    return this.target;
  }

  get targetHeight() {
    return this.target[1];
  }
  set targetHeight(v) {
    this.target[1] = v;
  }
  get targetAngle() {
    return this.angle;
  }
  set targetAngle(v) {
    this.angle = v;
    let targetAngleRadians = degToRad(v);
    this.target[0] = Math.sin(targetAngleRadians) * targetRadius;
    this.target[2] = Math.cos(targetAngleRadians) * targetRadius;
    initialTarget[0] = Math.sin(targetAngleRadians) * targetRadius;
    initialTarget[2] = Math.cos(targetAngleRadians) * targetRadius;
  }
}

const gui = new GUI();
const minHeight = 0;
const maxHeight = 10;
const minAngle = -360;
const maxAngle = 360;
const fogGUIHelper = new FogGUIHelper(initialTarget, initialAngle);
function updateGui() {
  cubeList.forEach((v) => v.lookAt(...fogGUIHelper.getTarget()));
}
gui
  .add(fogGUIHelper, "targetHeight", minHeight, maxHeight)
  .listen()
  .onChange(updateGui);
gui
  .add(fogGUIHelper, "targetAngle", minAngle, maxAngle)
  .listen()
  .onChange(updateGui);

let cubeList = [];
var deep = 5;
var across = 5;
for (var zz = 0; zz < deep; ++zz) {
  var v = zz / (deep - 1);
  var z = (v - 0.5) * deep * 5;
  for (var xx = 0; xx < across; ++xx) {
    var u = xx / (across - 1);
    var x = (u - 0.5) * across * 5;
    let cube = makeCube(x, 0, z);
    cube.lookAt(...initialTarget);
    scene.add(cube);
    cubeList.push(cube);
  }
}

scene.add(makeCube(initialTarget));

camera.position.x = -10;
camera.position.y = 10;
camera.position.z = 10;

function animate() {
  requestAnimationFrame(animate);

  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  renderer.render(scene, camera);
}
animate();
