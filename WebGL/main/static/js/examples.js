import { OrbitControls } from '../jsm/controls/OrbitControls.js';

let scene, renderer, camera, controls
let cube, plane, line
let planeAnchor



$(function(){
    start();
    update();
});
function start() {
    console.log("basic.js onload")
    const items = $('.project');
    for (let i = 0; i < items.length; i++) {
        const element = items[i];
        
        console.log(element);
    }
    // start
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene.background = new THREE.Color(0x303030);
    scene.fog = new THREE.FogExp2(0x000000, 0.002);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("threejs_canvas").appendChild(renderer.domElement);
    
    camera.position.set(0, 3, 5);
    camera.lookAt(0, 0, 0);
    controls = new OrbitControls(camera, renderer.domElement)

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    //create a yellow cube
    const geometry_box = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5);
    const blue_material = new THREE.MeshPhongMaterial({ color: 0x0000ff });
    cube = new THREE.Mesh(geometry_box, blue_material);
    
    scene.add(cube);


    // lights
    const dirLight1 = new THREE.DirectionalLight(0xffffff);
    dirLight1.position.set(1, 1, 1);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x002288);
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

    renderer.render(scene, camera);
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
