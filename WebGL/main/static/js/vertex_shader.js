import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { GUI } from '../jsm/gui/dat.gui.module.js';
let scene, renderer, camera, controls
let mesh_plane, mesh_sphere;
let uniforms, plane_displacement, sphere_displacement;
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
    const plane_g = new THREE.PlaneBufferGeometry(width, height, division);
    const sphere_g = new THREE.SphereBufferGeometry(1, 20, 20);

    //set vertex shader
    uniforms = {
        "amplitude": { value: 1.0 },
        "color": { value: new THREE.Color(0xff22ff) },
        "colorTexture": { value: new THREE.TextureLoader().load('/media/main/vertex_shader/Lenna.png') }
    }
    const vShader = document.getElementById('vertexShader').innerHTML;
    const fShader = document.getElementById('fragmentShader').innerHTML;
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vShader,
        fragmentShader: fShader,
    });

    //add vertex displacement attribute to buffergeometry
    plane_displacement = new Float32Array(plane_g.attributes.position.count);
    sphere_displacement = new Float32Array(sphere_g.attributes.position.count);
    plane_g.setAttribute('displacement', new THREE.BufferAttribute(plane_displacement, 1));
    sphere_g.setAttribute('displacement', new THREE.BufferAttribute(sphere_displacement, 1));

    mesh_plane = new THREE.Mesh(plane_g, material);
    mesh_sphere = new THREE.Mesh(sphere_g, material);
    mesh_plane.rotation.x = -90 * Math.PI / 180;
    mesh_plane.position.x = -1;
    mesh_sphere.position.x = 1;
    mesh_sphere.rotation.x = -90 * Math.PI / 180;
    mesh_sphere.rotation.y = -90 * Math.PI / 180;
    scene.add(mesh_plane);
    scene.add(mesh_sphere);

    //window resize 대응
    window.addEventListener('resize', onWindowResize, false);
}
//update
function update() {
    requestAnimationFrame(update);
    const time = Date.now() * 0.01;

    uniforms["amplitude"].value = 1;
    uniforms["color"].value.offsetHSL(0.0005, 0, 0);

    for (let i = 0; i < plane_displacement.length; i++) {
        plane_displacement[i] = Math.sin(i + time) * 0.1;
    }
    for (let i = 0; i < sphere_displacement.length; i++) {
        sphere_displacement[i] = Math.sin(i * 0.03 + time * 0.5) * 0.05;
    }

    mesh_plane.geometry.attributes.displacement.needsUpdate = true;
    mesh_sphere.geometry.attributes.displacement.needsUpdate = true;
    controls.update();
    renderer.render(scene, camera);
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

