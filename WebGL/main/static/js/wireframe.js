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
    
    camera.position.set(0, 0, 30 );

    controls = new OrbitControls( camera, renderer.domElement );

    // Wireframe ( WireframeGeometry2, LineMaterial )
    matLine = new LineMaterial( {
        color: 0x4080ff,
        linewidth: 4, // in pixels
    } );
    matLine.resolution.set( window.innerWidth, window.innerHeight ); 
    
    // Line ( THREE.WireframeGeometry, THREE.LineBasicMaterial ) - rendered with gl.LINE
    matLineBasic = new THREE.LineBasicMaterial( { color: 0x4080ff } )
    const loader = new THREE.FontLoader();
    loader.load( '/media/main/fonts/helvetiker_regular.typeface.json', function ( font ) {
        //make geometries
        let poligon_g = [
            new THREE.BoxGeometry(1,1,1),
            new THREE.CircleGeometry(1,10),
            new THREE.ConeGeometry( 1, 1, 10 ),
            new THREE.CylinderGeometry( 0.5, 1, 1, 10 ),
            new THREE.DodecahedronGeometry( 1),
            new THREE.IcosahedronGeometry(1),
            new THREE.OctahedronGeometry(1),
            new THREE.PlaneGeometry( 2, 1, 5 ),
            new THREE.RingGeometry( 0.5, 1, 10 ),
            new THREE.SphereGeometry( 1, 10, 10 ),
            new THREE.TetrahedronGeometry(1,1),
            new THREE.TextGeometry( '?', {
                font: font,
                size: 1,
                height: 0.5,
            } ),
            new THREE.TorusGeometry(0.5,0.2, 4, 10 ),
        ]
        for (let i = 0; i < poligon_g.length; i++) {
            const poligon_wg_0 = new WireframeGeometry2(poligon_g[i]);
            const wireframe_00 = new Wireframe(poligon_wg_0, matLine );
            wireframe_00.computeLineDistances();
            wireframe_00.position.x = -2;
            wireframe_00.position.y = 2*(i-poligon_g.length/2);
            scene.add( wireframe_00 );

            //make geometries
            const poligon_wg_1 = new THREE.WireframeGeometry(poligon_g[i]);
            const wireframe_10 = new THREE.LineSegments(poligon_wg_1, matLineBasic );
            wireframe_10.computeLineDistances();
            wireframe_10.position.x = 0;
            wireframe_10.position.y = 2*(i-poligon_g.length/2);
            scene.add( wireframe_10 );

            const poligon_wg_2 = new THREE.EdgesGeometry( poligon_g[i] );
            const wireframe_20 = new THREE.LineSegments( poligon_wg_2, matLineBasic );
            wireframe_20.position.x = 2;
            wireframe_20.position.y = 2*(i-poligon_g.length/2);
            scene.add( wireframe_20 );
        }

    });
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

