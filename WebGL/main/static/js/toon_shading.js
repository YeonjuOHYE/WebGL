import { GUI } from '../jsm/libs/dat.gui.module.js';
import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { OutlineEffect } from '../jsm/effects/OutlineEffect.js';

let renderer, scene, camera, controls;
let cube;
let effect;
let particleLight;
let usePostProcess;
const guiParams = {
    postprocess: true,
};

start();
update();

function start() {
    usePostProcess = guiParams['postprocess'];
    console.log("basic.js onload")
    //start
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 20000);
    scene.background = new THREE.Color(0xffff43);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("threejs_canvas").appendChild(renderer.domElement);

    camera.position.set(1800, 1800, 1800);
    controls = new OrbitControls(camera, renderer.domElement);

    const cubeWidth = 400;
    const numberOfSphersPerSide = 5;

    const sphereRadius = (cubeWidth / numberOfSphersPerSide) * 0.8 * 0.5;
    const stepSize = 1.0 / numberOfSphersPerSide;

    const sphere_g = new THREE.SphereGeometry(sphereRadius, 32, 16);

    let alphaIndex = 0;
    cube = new THREE.Object3D();
    for (let alpha = 0; alpha <= 1.0; alpha += stepSize) {
        const colors = new Uint8Array(alphaIndex + 2) // +2인 이유? 최소 구분 면적이 2개로 하기 위함

        for (let c = 0; c < colors.length; c++) {
            colors[c] = (c / colors.length) * 256;
        }

        //data, width, height, format
        // reads each element as a single luminance component. 
        // This is then converted to a floating point, clamped to the range [0,1], 
        // and then assembled into an RGBA element by placing the luminance value in the red, 
        // green and blue channels, and attaching 1.0 to the alpha channel.
        const gradientMap = new THREE.DataTexture(colors, colors.length, 1, THREE.LuminanceFormat);

        for (let beta = 0; beta <= 1.0; beta += stepSize) {
            for (let gamma = 0; gamma <= 1.0; gamma += stepSize) {
                const minL = 0.4
                const maxL = 0.7
                const minB = 0.2
                const maxB = 1
                const diffuseColor = new THREE.Color().setHSL(alpha, 0.5, gamma * (maxL - minL) + minL).multiplyScalar(beta * (maxB - minB) + minB);

                const sphere_m = new THREE.MeshToonMaterial({
                    color: diffuseColor,
                    gradientMap: gradientMap
                });

                const mesh = new THREE.Mesh(sphere_g, sphere_m);
                mesh.position.x = (alpha - 0.5) * cubeWidth;
                mesh.position.y = (beta - 0.5) * cubeWidth;
                mesh.position.z = (gamma - 0.5) * cubeWidth;

                cube.add(mesh);
            }
        }
        alphaIndex++;
    }
    scene.add(cube);

    particleLight = new THREE.Mesh(
        new THREE.SphereGeometry(12, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    scene.add(particleLight);
    const pointLight = new THREE.PointLight(0xffffff, 1, 2000);
    particleLight.add(pointLight);
    //light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const gui = new GUI();
    gui.add(guiParams, 'postprocess').onChange((value) => {
        usePostProcess = value;
    });

    effect = new OutlineEffect(renderer);
    //window resize 대응
    window.addEventListener('resize', onWindowResize, false);
}

function update() {
    requestAnimationFrame(update);
    const timer = Date.now() * 0.00025;

    particleLight.position.x = Math.sin(timer * 7) * 300;
    particleLight.position.y = Math.cos(timer * 5) * 400;
    particleLight.position.z = Math.cos(timer * 3) * 300;

    // cube.rotation.y = timer;

    if (usePostProcess)
        effect.render(scene, camera);
    else
        renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

