import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { GUI } from '../jsm/gui/dat.gui.module.js';
let scene, renderer, camera, controls

start();
update();


function start() {
    console.log("basic.js onload")
    // start
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene.background = new THREE.Color(0x202020);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("threejs_canvas").appendChild(renderer.domElement);

    camera.position.set(0, 5, 5);
    camera.lookAt(0, 0, 0);


    //set camera for mouse rotation
    controls = new OrbitControls(camera, renderer.domElement)

    const width = 2, height = 2, division = 1;
    const geometry = new THREE.PlaneBufferGeometry(width, height, division);
    const geometry2 = new THREE.SphereGeometry(2, 2, 2);
    const uniforms = {
        "amplitude": { value: 1.0 },
        "color": { value: new THREE.Color(0xff22ff) },
        "colorTexture": { value: new THREE.TextureLoader().load('/media/main/vertex_shader/Lenna.png') }
    }
    uniforms["colorTexture"].value.wrapS = THREE.RepeatWrapping;
    uniforms["colorTexture"].value.wrapT = THREE.RepeatWrapping;
    const vShader = document.getElementById('vertexShader').innerHTML;
    const fShader = document.getElementById('fragmentShader').innerHTML;

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vShader,
        fragmentShader: fShader,
    });

    console.log(geometry);
    console.log(geometry.attributes);
    console.log(geometry2);
    const displacement = new Float32Array(geometry.attributes.position.count);
    const noise = new Float32Array(geometry.attributes.position.count);


    for (let i = 0; i < displacement.length; i++) {
        noise[i] = Math.random();
    }

    geometry.setAttribute('displacement', new THREE.BufferAttribute(displacement, 1));

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -90 * Math.PI / 180;
    scene.add(mesh);

    //window resize 대응
    window.addEventListener('resize', onWindowResize, false);
}
//update
function update() {
    const timer = requestAnimationFrame(update);
    renderer.render(scene, camera);
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

