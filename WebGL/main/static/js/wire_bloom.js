import { GUI } from '../jsm/libs/dat.gui.module.js';

import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../jsm/loaders/GLTFLoader.js';
import { RenderPass } from '../jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '../jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from '../jsm/postprocessing/EffectComposer.js';


let renderer, scene, camera, controls;
let composer, mixer, clock;

let usePostProcess = true;
const params = {
    bloomStrength: 3,
    bloomThreshold: 0,
    bloomRadius: 1,
    exposure: 8,
    postprocess: true,
};

start();
update();

function start() {
    console.log("basic.js onload")
    clock = new THREE.Clock();
    //start
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    // scene.background = new THREE.Color(0x130003);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = params['exposure'];
    document.getElementById("threejs_canvas").appendChild(renderer.domElement);

    camera.position.set(- 5, 2.5, - 3.5);

    controls = new OrbitControls(camera, renderer.domElement);

    //light
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 11);
    camera.add(pointLight);

    const renderScene = new RenderPass(scene, camera);
    console.log(renderScene);

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        params['bloomStrength'],
        params['bloomRadius'],
        params['bloomThreshold']);
    console.log("bloom: ", bloomPass);

    composer = new EffectComposer(renderer);

    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // load .glb model file
    new GLTFLoader().load('/media/main/wire_bloom/PrimaryIonDrive.glb', function (gltf) {
        const model = gltf.scene;
        scene.add(model);

        mixer = new THREE.AnimationMixer(model);
        const clip = gltf.animations[0];
        mixer.clipAction(clip.optimize()).play();

    });

    const gui = new GUI();
    gui.add(params, 'bloomStrength', 0.0, 5.0).onChange((value) => {
        bloomPass.strength = Number(value);
    })
    gui.add(params, 'bloomThreshold', 0.0, 1.0).step(0.01).onChange((value) => {
        bloomPass.threshold = Number(value);
    })
    gui.add(params, 'bloomRadius', 0.0, 1).step(0.01).onChange((value) => {
        bloomPass.radius = Number(value);
    })
    gui.add(params, 'exposure', 0.0, 20.0).onChange((value) => {
        renderer.toneMappingExposure = Number(value);
    })
    gui.add(params, 'postprocess').onChange((value) => {
        usePostProcess = value;
    });


    //window resize 대응
    window.addEventListener('resize', onWindowResize, false);
}

function update() {
    requestAnimationFrame(update);
    const delta = clock.getDelta();

    if (mixer != null)
        mixer.update(delta)
    controls.update();
    if (usePostProcess) {
        composer.render();
    }
    else {
        renderer.render(scene, camera);
    }


}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

