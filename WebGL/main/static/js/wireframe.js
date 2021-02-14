import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { LineMaterial } from '../jsm/lines/LineMaterial.js';
import { Wireframe } from '../jsm/lines/Wireframe.js';
import { WireframeGeometry2 } from '../jsm/lines/WireframeGeometry2.js';

let renderer, scene, camera, controls;
let matLine, matLineBasic;

start();
update();

function start() {
    console.log("basic.js onload")
    //start
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true, preserveDrawingBuffer: true } );
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene.background = new THREE.Color(0x000000);

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById("threejs_canvas").appendChild(renderer.domElement);
    
    camera.position.set(0, 0, 100 );
    camera.lookAt(0, 0, 0);

    controls = new OrbitControls( camera, renderer.domElement );

    // Wireframe ( WireframeGeometry2, LineMaterial )
    matLine = new LineMaterial( {
        color: 0x4080ff,
        linewidth: 4, // in pixels
    } );
    matLine.resolution.set( window.innerWidth, window.innerHeight ); 
    
    // Line ( THREE.WireframeGeometry, THREE.LineBasicMaterial ) - rendered with gl.LINE
    matLineBasic = new THREE.LineBasicMaterial( { color: 0x4080ff } )

    //make geometries
    let poligon_g = new THREE.IcosahedronGeometry( 20, 1 );
    // poligon_g = new THREE.BoxGeometry(1,1,1)
    const poligon_wg_0 = new WireframeGeometry2(poligon_g);
    const wireframe_00 = new Wireframe(poligon_wg_0, matLine );
    wireframe_00.computeLineDistances();
    wireframe_00.position.x = -25;
    scene.add( wireframe_00 );

    //make geometries
    const poligon_wg_1 = new THREE.WireframeGeometry(poligon_g);
    const wireframe_10 = new THREE.LineSegments(poligon_wg_1, matLineBasic );
    wireframe_10.computeLineDistances();
    wireframe_10.position.x = 25;
    scene.add( wireframe_10 );

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
