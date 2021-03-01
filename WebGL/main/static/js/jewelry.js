import { GUI } from '../jsm/libs/dat.gui.module.js';
import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { OutlineEffect } from '../jsm/effects/OutlineEffect.js';
import { OBJLoader } from '../jsm/loaders/OBJLoader.js';

let renderer, scene, camera, controls;
let usePostProcess;
let effect;
const guiParams = {
    postprocess: true,
    color: 0x0000ff,
};

start();
update();

function start() {
    usePostProcess = guiParams['postprocess'];
    console.log("basic.js onload")
    //start
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene.background = new THREE.Color(0x000000);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("threejs_canvas").appendChild(renderer.domElement);

    camera.position.set(50 , 50, 50);
    controls = new OrbitControls(camera, renderer.domElement);

    const gemFrontMaterial = new THREE.MeshPhysicalMaterial( {
        map: null,
        color: 0x00ff00,
        metalness: 0,
        roughness: 0,
        opacity: 0.25,
        side: THREE.FrontSide,
        transparent: true,
        envMapIntensity: 10,
        premultipliedAlpha: true
    } );

    //use loading manager to check whether all resources are loaded
    const manager = new THREE.LoadingManager();
    manager.onStart = function(url, itemsLoaded,itemsTotal){
        console.log( 'Started loading file: ' + url + '.\nLoaded ' + 
        itemsLoaded + ' of ' + itemsTotal + ' files.' );
    };
    manager.onLoad = function ( ) {
        console.log( 'Loading complete!');

    };
    manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
        console.log( 'Loading file: ' + url + '.\nLoaded ' + 
        itemsLoaded + ' of ' + itemsTotal + ' files.' );
    };
    const loader = new OBJLoader(manager);
    loader.load('/media/jewelry/emerald.obj',function(object){
        //모든 child object까지 검색하여 함수를 실행시킴
        const mesh = object.children[0];
        console.log(mesh);
        mesh.material = gemFrontMaterial;
        scene.add(mesh);
    });

    //light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    //attach gui
    const gui = new GUI();
    gui.add(guiParams, 'postprocess').onChange((value) => {
        usePostProcess = value;
    });
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
    const backgroundHelper= new ColorHelper(scene.background)
    const albedoHelper= new ColorHelper(gemFrontMaterial['color'])

    gui.addColor(backgroundHelper, 'color')
    gui.addColor(albedoHelper, 'color')





    effect = new OutlineEffect(renderer);
    //window resize 대응
    window.addEventListener('resize', onWindowResize, false);
}

function update() {
    requestAnimationFrame(update);
    const timer = Date.now() * 0.00025;

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

