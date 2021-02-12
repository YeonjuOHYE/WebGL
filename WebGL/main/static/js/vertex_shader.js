import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { GUI } from '../jsm/gui/dat.gui.module.js';
let scene, renderer, camera, controls

start();
update();

function start() {
    console.log("basic.js onload")
    // start
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene.background = new THREE.Color(0x202020);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("threejs_canvas").appendChild(renderer.domElement);

    camera.position.set(-2, 10, 5);
    camera.lookAt(0, 0, 0);

    //set camera for mouse rotation
    controls = new OrbitControls(camera, renderer.domElement)

    const cube_g = new THREE.BoxGeometry(1, 1, 1);
    const cube_m = new THREE.MeshPhongMaterial({
        color: 0xeeeeee
    });
    const cube = new THREE.Mesh(cube_g, cube_m);
    scene.add(cube);

    // lights
    const dirLight1 = new THREE.DirectionalLight(0xffffff);
    dirLight1.position.set(0, 1, 1);
    scene.add(dirLight1);

    const ambientLight = new THREE.AmbientLight(0x8c8c8c);
    scene.add(ambientLight);

    //window resize 대응
    window.addEventListener('resize', onWindowResize, false);
}
//update
function update() {
    const timer = requestAnimationFrame(update);
    renderer.render(scene, camera);
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

