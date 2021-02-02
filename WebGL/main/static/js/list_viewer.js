import { OrbitControls } from '../jsm/controls/OrbitControls.js';
let scene, renderer, camera, controls

let mouse_x = 0, mouse_y = 0;
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

    camera.position.set(0, 7, 20);
    camera.lookAt(0, 0, 0);

    //set camera for mouse rotation
    controls = new OrbitControls(camera, renderer.domElement)

    // lights
    const dirLight1 = new THREE.DirectionalLight(0xffffff);
    dirLight1.position.set(0, 1, 1);
    scene.add(dirLight1);

    const ambientLight = new THREE.AmbientLight(0x8c8c8c);
    scene.add(ambientLight);

    //window resize 대응
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener("mousedown", mouseDown);
    document.addEventListener("mouseup", mouseUp);

    document.addEventListener("mousemove", function (event) { mouseMove(event); });
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

function mouseDown() {
}

function mouseUp() {
}

function mouseMove(event) {
    mouse_x = event.clientX * 2 / window.innerWidth - 1; //-1 ~1
    mouse_y = event.clientY * 2 / window.innerHeight - 1; //-1 ~1

}

function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end
}
