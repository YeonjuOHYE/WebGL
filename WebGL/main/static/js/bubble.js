import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { RGBELoader } from '../jsm/loaders/RGBELoader.js';

let renderer, scene, camera, controls;
let bubble;
let cloud_texture;
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

    camera.position.set(0, 0, 40);
    controls = new OrbitControls(camera, renderer.domElement);


    const bubble_g = new THREE.SphereGeometry(5,32,32);

    const  bubble_m = new THREE.MeshPhysicalMaterial({
        map: null,
        color: 0xffffff,
        metalness: 1,
        roughness: 0.13,
        opacity: 0.1,
        side: THREE.FrontSide,
        transparent: true,
        envMapIntensity: 1,
        premultipliedAlpha: true,
        reflectivity: 0
    });
    console.log(bubble_m);
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    new RGBELoader()
        .setDataType(THREE.UnsignedByteType)
        .setPath('/media/main/jewelry/')
        .load('royal_esplanade_1k.hdr', function (hdrEquirect) {

            const hdrCubeRenderTarget = pmremGenerator.fromEquirectangular(hdrEquirect);
            pmremGenerator.dispose();

            bubble_m.envMap = hdrCubeRenderTarget.texture;
            bubble_m.needsUpdate = true;
            hdrEquirect.dispose();
        });
    bubble = new THREE.Mesh(bubble_g,bubble_m);
    scene.add(bubble);

    //create a cube after texture loaded
    const loader = new THREE.TextureLoader();
    loader.load('/media/main/bubble/background.jpg', (texture) => {
    const plane_g = new THREE.PlaneBufferGeometry(20,20,1);
        const plane_m = new THREE.MeshPhongMaterial({
            map: texture
        });
        const plane = new THREE.Mesh(plane_g, plane_m);
        plane.position.z = -2;
        scene.add(plane);
    });
    cloud_texture = loader.load('/media/main/bubble/cloud.jpg', (texture) => {

        // texture wrap
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping

        // texture repeat
        texture.repeat.set(4, 2)

        const bubble_m2 = new THREE.MeshPhongMaterial({
            alphaMap: texture,
            transparent: true
        });
        console.log(bubble_m2);
        const bubble_2 = new THREE.Mesh(bubble_g, bubble_m2);
        scene.add(bubble_2);
    });

    //light
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);


    renderer.shadowMap.enabled = true;
    renderer.outputEncoding = THREE.sRGBEncoding;

    //window resize 대응
    window.addEventListener('resize', onWindowResize, false);
}

function update() {
    requestAnimationFrame(update);
    
    const timer = Date.now() * 0.00025;
    
    cloud_texture.offset.x = Math.sin(timer*6)/4 + Math.cos(timer*2)/1.5;
    cloud_texture.offset.y = Math.sin(timer*2)/4 + Math.cos(timer*3)/3;

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

