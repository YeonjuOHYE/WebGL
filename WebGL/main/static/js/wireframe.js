import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { LineMaterial } from '../jsm/lines/LineMaterial.js';
import { Wireframe } from '../jsm/lines/Wireframe.js';
import { WireframeGeometry2 } from '../jsm/lines/WireframeGeometry2.js';

let wireframe, renderer, scene, camera, controls;
let wireframe1;
let matLine, matLineBasic, matLineDashed;
let gui;

// viewport
let insetWidth;
let insetHeight;

start();
update();

function start() {

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearColor( 0x000000, 0.0 );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set(0, 0, 300 );

    controls = new OrbitControls( camera, renderer.domElement );


    // Wireframe ( WireframeGeometry2, LineMaterial )

    let geo = new THREE.IcosahedronGeometry( 20, 1 );
    const geometry = new WireframeGeometry2( geo );

    matLine = new LineMaterial( {
        color: 0x4080ff,
        linewidth: 4, // in pixels
    } );

    wireframe = new Wireframe( geometry, matLine );
    wireframe.computeLineDistances();
    wireframe.scale.set( 1, 1, 1 );
    wireframe.position.x = -25;
    scene.add( wireframe );


    // Line ( THREE.WireframeGeometry, THREE.LineBasicMaterial ) - rendered with gl.LINE

    geo = new THREE.WireframeGeometry( geo );

    matLineBasic = new THREE.LineBasicMaterial( { color: 0x4080ff } );
    matLineDashed = new THREE.LineDashedMaterial( { scale: 2, dashSize: 1, gapSize: 1 } );

    wireframe1 = new THREE.LineSegments( geo, matLineBasic );
    wireframe1.computeLineDistances();
    wireframe1.position.x = 25;
    scene.add( wireframe1 );

    //window resize 대응
    window.addEventListener('resize', onWindowResize, false);
}

function update() {

    requestAnimationFrame( update );

    // main scene

    renderer.setClearColor( 0x000000, 0 );

    renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight );

    // renderer will set this eventually
    matLine.resolution.set( window.innerWidth, window.innerHeight ); // resolution of the viewport

    renderer.render( scene, camera );

    // inset scene

    renderer.setClearColor( 0x222222, 1 );

    renderer.clearDepth(); // important!

    renderer.setScissorTest( true );

    renderer.setScissor( 20, 20, insetWidth, insetHeight );

    renderer.setViewport( 20, 20, insetWidth, insetHeight );

    // renderer will set this eventually
    matLine.resolution.set( insetWidth, insetHeight ); // resolution of the inset viewport

 

    renderer.setScissorTest( false );

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
