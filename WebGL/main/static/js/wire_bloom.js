import { GUI } from '../jsm/libs/dat.gui.module.js';
import { OrbitControls } from '../jsm/controls/OrbitControls.js';


let renderer, scene, camera, controls;

start();
update();

function start() {

    console.log("basic.js onload")
    //start
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true, preserveDrawingBuffer: true } );
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene.background = new THREE.Color(0x130003);

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById("threejs_canvas").appendChild(renderer.domElement);
    
    camera.position.set(0, 0, 30 );

    controls = new OrbitControls( camera, renderer.domElement );

    //window resize 대응
    window.addEventListener('resize', onWindowResize, false);
}

function update() {
    requestAnimationFrame(update);

    controls.update();
    renderer.render( scene, camera );
}

function onWindowResize() {
    matLine.resolution.set( window.innerWidth, window.innerHeight ); 
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

