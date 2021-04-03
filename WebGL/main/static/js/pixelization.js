import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { PLYLoader } from '../jsm/loaders/PLYLoader.js';
import { EffectComposer } from '../jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '../jsm/postprocessing/ShaderPass.js';
import { PixelShader } from '../jsm/shaders/PixelShader.js';
let scene, renderer, camera, controls
let composer, pixelPass, pixelSize;
let h=Math.random(),s=0.9,l=0.8;
let randomColor =new THREE.Color(h,s,l)
let m1

start();
update();

function start() {
    console.log("js onload")
    // start
    scene = new THREE.Scene()
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)

    scene.background = randomColor;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("threejs_canvas").appendChild(renderer.domElement);

    camera.position.set(0, 0, -200);
    camera.lookAt(0, 0, 0);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 4;
    controls.rotateSpeed = 1;
    controls.enableDamping = false;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI/2;
    controls.maxPolarAngle = Math.PI/2;
    controls.update();

    const loader = new THREE.CubeTextureLoader();
    loader.load([
        '/media/main/fraction/px.jpg',
        '/media/main/fraction/nx.jpg',
        '/media/main/fraction/py.jpg',
        '/media/main/fraction/ny.jpg',
        '/media/main/fraction/pz.jpg',
        '/media/main/fraction/nz.jpg',
    ], (texture) => {
        // scene.background = texture;
        texture.mapping = THREE.CubeRefractionMapping;
        
        m1 = new THREE.MeshPhongMaterial( { color: randomColor, envMap: texture, refractionRatio: 0.8} );
        const loader = new PLYLoader();
        loader.load( '/media/main/fraction/Lucy100k.ply', function ( geometry ) {

            geometry.computeVertexNormals();

            const s = 0.1;

            let mesh = new THREE.Mesh( geometry, m1 );
            mesh.scale.x = mesh.scale.y = mesh.scale.z = s;
            scene.add( mesh );
            
            changeColor();
        });
    });


    // LIGHTS
    const ambient = new THREE.AmbientLight( 0xffffff );
    scene.add( ambient );

    const pointLight = new THREE.PointLight( 0xffffff, 5 );
    scene.add( pointLight );
    pointLight.position.set(0,0,-50);
    
    controls.addEventListener('change', changeColor);
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener("click", changeColor);

    composer = new EffectComposer( renderer );
    composer.addPass( new RenderPass( scene, camera ) );
    pixelPass = new ShaderPass( PixelShader );
    pixelPass.uniforms[ "resolution" ].value = new THREE.Vector2( window.innerWidth, window.innerHeight );
    pixelPass.uniforms[ "resolution" ].value.multiplyScalar( window.devicePixelRatio );
    composer.addPass( pixelPass );
}

function update(){
    const pos = camera.position.x/200
    pixelSize= pos*pos*pos*15
    pixelPass.uniforms[ "pixelSize" ].value = pixelSize;
    const time = requestAnimationFrame(update) * 0.01;
    controls.update();
    composer.render();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    pixelPass.uniforms[ "resolution" ].value.set( window.innerWidth, window.innerHeight ).multiplyScalar( window.devicePixelRatio );
}

function changeColor(){
    h+=0.003
    randomColor.setHSL( h,s,l );
    
    if(m1 != undefined){
        m1.color = randomColor;
    }
}