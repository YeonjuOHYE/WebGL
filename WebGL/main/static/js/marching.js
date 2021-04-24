import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { MarchingCubes } from '../jsm/objects/MarchingCubes.js';

let camera, scene, renderer;
let h = 0;
let s = 0;
let l = 0.8;
let materials;
let effect;
let time = 0;
const clock = new THREE.Clock();

init();
animate();

function init() {
    console.log("basic.js onload")
    //start
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.outputEncoding = THREE.sRGBEncoding;
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene.background = new THREE.Color(0x111111);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("threejs_canvas").appendChild(renderer.domElement);

    camera.position.set(0, 10, 14);

    // MATERIALS
    materials = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 0,
        vertexColors: true
    });

    // MARCHING CUBES
    const resolution = 60;

    effect = new MarchingCubes(resolution, materials, false, true);
    effect.position.set(0, 0, 0);
    effect.scale.set(7, 7, 7);
    effect.isolation = 70;

    scene.add(effect);

    // CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 5;
    controls.maxDistance = 30;

    // LIGHTS
    const light = new THREE.DirectionalLight(0x7b3352);
    light.position.set(0.5, 0.5, 1);
    scene.add(light);

    const pointLight = new THREE.PointLight(0xca33bb);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // EVENTS
    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function updateCubes(time, numblobs) {

    effect.reset();

    const subtract = 12;
    const strength = 1.2 / ((Math.sqrt(numblobs) - 1) / 4 + 1);

    for (let i = 0; i < numblobs; i++) {

        const ballx = Math.sin(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.27 + 0.5;
        const bally = Math.abs(Math.cos(i + 1.12 * time * Math.cos(1.22 + 0.1424 * i))) * 0.77; // dip into the floor
        const ballz = Math.cos(i + 1.32 * time * 0.1 * Math.sin((0.92 + 0.53 * i))) * 0.27 + 0.5;
        effect.addBall(ballx, bally, ballz, strength, subtract);
    }
    effect.addPlaneY(2, 12);
}

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    time += delta * 0.6;

    updateCubes(time, 20);
    renderer.render(scene, camera);
}
