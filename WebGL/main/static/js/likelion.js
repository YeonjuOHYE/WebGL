import { OrbitControls } from '../jsm/controls/OrbitControls.js';

let scene, renderer, camera, controls
let cube;

start();
update();

function start() {
    console.log("basic.js onload")
    // start
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene.background = new THREE.Color(0xebe5e7);
    scene.fog = new THREE.FogExp2(0x000000, 0.002);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("threejs_canvas").appendChild(renderer.domElement);

    camera.position.set(0, 3, 10);
    camera.lookAt(0, 5, 0);

    //set camera for mouse rotation
    controls = new OrbitControls(camera, renderer.domElement)

    const lion = new THREE.Object3D();

    //foot
    const foot_anchor = new THREE.Object3D();
    const foot_g = new THREE.BoxGeometry(1, 0.5, 0.5);
    const body_m = new THREE.MeshPhongMaterial({ color: 0xffd377 });
    const foot1 = new THREE.Mesh(foot_g, body_m)
    const foot2 = new THREE.Mesh(foot_g, body_m)
    const foot3 = new THREE.Mesh(foot_g, body_m)
    const foot4 = new THREE.Mesh(foot_g, body_m)
    foot1.position.set(0.55, 0, 0)
    foot2.position.set(-0.55, 0, 0)
    foot3.position.set(2, 0, -0.4)
    foot4.position.set(-2, 0, -0.4)
    foot_anchor.add(foot1)
    foot_anchor.add(foot2)
    foot_anchor.add(foot3)
    foot_anchor.add(foot4)
    lion.add(foot_anchor)

    //body
    const body_g = new THREE.ConeGeometry(2.5, 4, 3);
    const body = new THREE.Mesh(body_g, body_m);
    body.position.set(0, 2, -1)
    body.scale.z = 0.3
    lion.add(body)

    //leg
    const leg_anchor_l = new THREE.Object3D();
    const leg_anchor_r = new THREE.Object3D();
    const leg_g = new THREE.BoxGeometry(1, 1, 1)

    scene.add(lion)


    // lights
    const dirLight1 = new THREE.DirectionalLight(0xffffff);
    dirLight1.position.set(1, 1, 1);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff);
    dirLight2.position.set(- 1, - 1, - 1);
    scene.add(dirLight2);

    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);

    //window resize 대응
    window.addEventListener('resize', onWindowResize, false);
}
//update
function update() {
    requestAnimationFrame(update);
    const speed = 0.01

    controls.update();
    renderer.render(scene, camera);
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
