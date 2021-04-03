import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { PLYLoader } from '../jsm/loaders/PLYLoader.js';
let scene, renderer, camera, controls
let h=Math.random(),s=0.9,l=0.9;
let randomColor =new THREE.Color(h,s,l)
let m1

start();
update();

function start() {
    changeColor();
    console.log("js onload")
    // start
    scene = new THREE.Scene()
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("threejs_canvas").appendChild(renderer.domElement);

    camera.position.set(0, 0, -200);
    camera.lookAt(0, 0, 0);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.3;
    controls.enableDamping = false;
    controls.enablePan = false;
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
        scene.background = texture;
        texture.mapping = THREE.CubeRefractionMapping;
        
        m1 = new THREE.MeshPhongMaterial( { color: randomColor, envMap: texture, refractionRatio: 0.99} );
        const loader = new PLYLoader();
        console.log(m1);
        loader.load( '/media/main/fraction/Lucy100k.ply', function ( geometry ) {

            geometry.computeVertexNormals();

            const s = 0.1;

            let mesh = new THREE.Mesh( geometry, m1 );
            mesh.scale.x = mesh.scale.y = mesh.scale.z = s;
            scene.add( mesh );
        });
    });


    // LIGHTS
    const ambient = new THREE.AmbientLight( 0xffffff );
    scene.add( ambient );

    const pointLight = new THREE.PointLight( 0xffffff, 2 );
    scene.add( pointLight );
    pointLight.position.set(0,0,-50);
    
    controls.addEventListener('change', changeColor);
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener("click", changeColor);
}

function update(){
  
    const time = requestAnimationFrame(update) * 0.01;
    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function changeColor(){
    h+=0.003
    randomColor.setHSL( h,s,l );
    
    if(m1 != undefined){
        m1.color = randomColor;
    }
}