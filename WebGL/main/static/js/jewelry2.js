import { GUI } from '../jsm/libs/dat.gui.module.js';
import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { OBJLoader } from '../jsm/loaders/OBJLoader.js';
import { RGBELoader } from '../jsm/loaders/RGBELoader.js';

const params = {
	projection: 'normal',
	autoRotate: true,
	reflectivity: 1.0,
	background: false,
	exposure: 1.0,
	gemColor: 'Green'
};
let camera, scene, renderer;
let gemBackMaterial, gemFrontMaterial;
let hdrCubeRenderTarget;

const objects = [];

init();
animate();

function init() {

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
    const controls = new OrbitControls(camera, renderer.domElement);
    
	gemBackMaterial = new THREE.MeshPhysicalMaterial( {
		map: null,
		color: 0x0000ff,
		metalness: 1,
		roughness: 0,
		opacity: 0.5,
		side: THREE.BackSide,
		transparent: true,
		envMapIntensity: 5,
		premultipliedAlpha: true
		// TODO: Add custom blend mode that modulates background color by this materials color.
	} );

	gemFrontMaterial = new THREE.MeshPhysicalMaterial( {
		map: null,
		color: 0x0000ff,
		metalness: 0,
		roughness: 0,
		opacity: 0.25,
		side: THREE.FrontSide,
		transparent: true,
		envMapIntensity: 10,
		premultipliedAlpha: true
	} );

	const manager = new THREE.LoadingManager();
	manager.onProgress = function ( item, loaded, total ) {

		console.log( item, loaded, total );

	};

	const loader = new OBJLoader( manager );
	loader.load( '/media/jewelry/emerald.obj', function ( object ) {
		const child = object.children[0];
		child.material = gemBackMaterial;
		const second = child.clone();
		second.material = gemFrontMaterial;

		const parent = new THREE.Group();
		parent.add( second );
		parent.add( child );
		scene.add( parent );

		objects.push( parent );


	} );
	const geometry_box = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshPhongMaterial({
	});
	const cube = new THREE.Mesh(geometry_box, material);
	scene.add(cube);
	new RGBELoader()
		.setDataType( THREE.UnsignedByteType )
		.setPath( '/media/jewelry/' )
		.load( 'royal_esplanade_1k.hdr', function ( hdrEquirect ) {

			hdrCubeRenderTarget = pmremGenerator.fromEquirectangular( hdrEquirect );
			pmremGenerator.dispose();

			gemFrontMaterial.envMap = gemBackMaterial.envMap = hdrCubeRenderTarget.texture;
			gemFrontMaterial.needsUpdate = gemBackMaterial.needsUpdate = true;

			hdrEquirect.dispose();

		} );

	const pmremGenerator = new THREE.PMREMGenerator( renderer );
	pmremGenerator.compileEquirectangularShader();

	// Lights

	scene.add( new THREE.AmbientLight( 0xffffff ) );

	const pointLight1 = new THREE.PointLight( 0xffffff );
	pointLight1.position.set( 150, 10, 0 );
	pointLight1.castShadow = false;
	scene.add( pointLight1 );

	const pointLight2 = new THREE.PointLight( 0xffffff );
	pointLight2.position.set( - 150, 0, 0 );
	scene.add( pointLight2 );

	const pointLight3 = new THREE.PointLight( 0xffffff );
	pointLight3.position.set( 0, - 10, - 150 );
	scene.add( pointLight3 );

	const pointLight4 = new THREE.PointLight( 0xffffff );
	pointLight4.position.set( 0, 0, 150 );
	scene.add( pointLight4 );

	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true;

	renderer.outputEncoding = THREE.sRGBEncoding;


	window.addEventListener( 'resize', onWindowResize );

	const gui = new GUI();

	gui.add( params, 'reflectivity', 0, 1 );
	gui.add( params, 'exposure', 0.1, 2 );
	gui.add( params, 'autoRotate' );
	gui.add( params, 'gemColor', [ 'Blue', 'Green', 'Red', 'White', 'Black' ] );
	gui.open();

}

function onWindowResize() {

	const width = window.innerWidth;
	const height = window.innerHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize( width, height );

}

//

function animate() {
	requestAnimationFrame( animate );

	render();

}

function render() {

	if ( gemBackMaterial !== undefined && gemFrontMaterial !== undefined ) {

		gemFrontMaterial.reflectivity = gemBackMaterial.reflectivity = params.reflectivity;

		let newColor = gemBackMaterial.color;
		switch ( params.gemColor ) {

			case 'Blue': newColor = new THREE.Color( 0x000088 ); break;
			case 'Red': newColor = new THREE.Color( 0x880000 ); break;
			case 'Green': newColor = new THREE.Color( 0x008800 ); break;
			case 'White': newColor = new THREE.Color( 0x888888 ); break;
			case 'Black': newColor = new THREE.Color( 0x0f0f0f ); break;

		}

		gemBackMaterial.color = gemFrontMaterial.color = newColor;

	}

	renderer.toneMappingExposure = params.exposure;

	camera.lookAt( scene.position );

	if ( params.autoRotate ) {

		for ( let i = 0, l = objects.length; i < l; i ++ ) {

			const object = objects[ i ];
			object.rotation.y += 0.005;

		}

	}

	renderer.render( scene, camera );

}