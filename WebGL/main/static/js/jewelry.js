import { GUI } from '../jsm/libs/dat.gui.module.js';
import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { OBJLoader } from '../jsm/loaders/OBJLoader.js';
import { RGBELoader } from '../jsm/loaders/RGBELoader.js';

let renderer, scene, camera, controls;
let gemBackMaterial, gemFrontMaterial;
let parent;
const guiParams = {
    reflectivity: 0.5,
    color: 0x0000ff,
};
start();
update();

function start() {
    console.log("basic.js onload")
    //start
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene.background = new THREE.Color(0x000000);

    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("threejs_canvas").appendChild(renderer.domElement);

    camera.position.set(50, 50, 50);
    controls = new OrbitControls(camera, renderer.domElement);

    gemBackMaterial = new THREE.MeshPhysicalMaterial({
        map: null,
        color: 0x008800,
        metalness: 1,
        roughness: 0,
        opacity: 0.5,
        side: THREE.BackSide,
        transparent: true,
        envMapIntensity: 5,
        premultipliedAlpha: true,
        reflectivity: guiParams.reflectivity
    });

    gemFrontMaterial = new THREE.MeshPhysicalMaterial({
        map: null,
        color: 0x00b2ff,
        metalness: 0,
        roughness: 0,
        opacity: 0.25,
        side: THREE.FrontSide,
        transparent: true,
        envMapIntensity: 10,
        premultipliedAlpha: true,
        reflectivity: guiParams.reflectivity
    });

    //use loading manager to check whether all resources are loaded
    const manager = new THREE.LoadingManager();
    manager.onStart = function (url, itemsLoaded, itemsTotal) {
        console.log('Started loading file: ' + url + '.\nLoaded ' +
            itemsLoaded + ' of ' + itemsTotal + ' files.');
    };
    manager.onLoad = function () {
        console.log('Loading complete!');

    };
    manager.onProgress = function (url, itemsLoaded, itemsTotal) {
        console.log('Loading file: ' + url + '.\nLoaded ' +
            itemsLoaded + ' of ' + itemsTotal + ' files.');
    };
    const loader = new OBJLoader(manager);
    loader.load('/media/main/jewelry/emerald.obj', function (object) {
        //모든 child object까지 검색하여 함수를 실행시킴
        const mesh_back = object.children[0];
        const mesh_front = mesh_back.clone()
        mesh_back.material = gemBackMaterial;
        mesh_front.material = gemFrontMaterial;

        parent = new THREE.Object3D()
        parent.add(mesh_front)
        parent.add(mesh_back)


        scene.add(parent);
    });

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    new RGBELoader()
        .setDataType(THREE.UnsignedByteType)
        .setPath('/media/main/jewelry/')
        .load('royal_esplanade_1k.hdr', function (hdrEquirect) {

            const hdrCubeRenderTarget = pmremGenerator.fromEquirectangular(hdrEquirect);
            pmremGenerator.dispose();

            gemFrontMaterial.envMap = gemBackMaterial.envMap = hdrCubeRenderTarget.texture;
            gemFrontMaterial.needsUpdate = gemBackMaterial.needsUpdate = true;

            hdrEquirect.dispose();

        });


    //light
    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffffff);
    pointLight1.position.set(150, 10, 0);
    pointLight1.castShadow = false;
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff);
    pointLight2.position.set(- 150, 0, 0);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xffffff);
    pointLight3.position.set(0, - 10, - 150);
    scene.add(pointLight3);

    const pointLight4 = new THREE.PointLight(0xffffff);
    pointLight4.position.set(0, 0, 150);
    scene.add(pointLight4);

    renderer.shadowMap.enabled = true;
    renderer.outputEncoding = THREE.sRGBEncoding;

    //attach gui
    class ColorHelper {
        constructor(target) {
            this.target = target;
        }
        get color() {
            return `#${this.target.getHexString()}`;
        }
        set color(hexString) {
            this.target.set(hexString);
        }
    }
    const backgroundHelper = new ColorHelper(scene.background)
    const albedoHelper = new ColorHelper(gemFrontMaterial['color'])

    const gui = new GUI();
    gui.add(guiParams, 'reflectivity', 0, 1);
    gui.addColor(backgroundHelper, 'color')
    gui.addColor(albedoHelper, 'color')


    //window resize 대응
    window.addEventListener('resize', onWindowResize, false);
}

function update() {
    requestAnimationFrame(update);
    gemFrontMaterial.reflectivity = gemBackMaterial.reflectivity = guiParams.reflectivity;

    // parent.rotation.y += 0.005
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

