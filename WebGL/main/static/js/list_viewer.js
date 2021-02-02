import { OrbitControls } from '../jsm/controls/OrbitControls.js';
let scene, renderer, camera, controls

let mouse_x = 0, mouse_y = 0;
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

    camera.position.set(-2, 10, 5);
    camera.lookAt(0, 0, 0);

    //set camera for mouse rotation
    controls = new OrbitControls(camera, renderer.domElement)

    //add fog Text

    //add waving plane
    const textureWidth = 320
    const textureHeight = 240
    const dessertNum = 5;
    const meshDivide = 32;

    const loadManager = new THREE.LoadingManager();
    const loader = new THREE.TextureLoader(loadManager);

    const wave_g = new THREE.PlaneGeometry(textureWidth * dessertNum / 50, textureHeight / 50, dessertNum * meshDivide);
    const wave_m_list = [
        new THREE.MeshPhongMaterial({ map: loader.load('/media/main/list_viewer/1.jpg') }),
        new THREE.MeshPhongMaterial({ map: loader.load('/media/main/list_viewer/2.jpg') }),
        new THREE.MeshPhongMaterial({ map: loader.load('/media/main/list_viewer/3.jpg') }),
        new THREE.MeshPhongMaterial({ map: loader.load('/media/main/list_viewer/4.jpg') }),
        new THREE.MeshPhongMaterial({ map: loader.load('/media/main/list_viewer/5.jpg') }),
    ];
    loadManager.onLoad = () => {
        const wave = new THREE.Mesh(wave_g, wave_m_list);
        wave.rotation.set(-90 * Math.PI / 180, 0, 0);

        //set vertex pos
        const halfIndex = wave.geometry.vertices.length / 2
        for (let i = 0; i < halfIndex; i++) {
            wave.geometry.vertices[i].z = Math.sin((i / meshDivide) * 2 * Math.PI) / 2;
            wave.geometry.vertices[i + halfIndex].z = Math.sin((i / meshDivide) * 2 * Math.PI) / 2;
        }
        //set face texture
        const faceUnit = wave.geometry.faces.length / dessertNum;
        for (let i = 0; i < wave.geometry.faces.length; i++) {
            wave.geometry.faces[i].materialIndex = Math.floor(i / faceUnit);
        }
        //set vertex uv
        const faceUvUnit = wave.geometry.faceVertexUvs[0].length / dessertNum;
        for (let i = 0; i < wave.geometry.faceVertexUvs[0].length; i++) {
            const quotient = Math.floor(i / faceUvUnit)
            const uvUnit = 1 / dessertNum;
            const v1 = wave.geometry.faceVertexUvs[0][i][0]
            const v2 = wave.geometry.faceVertexUvs[0][i][1]
            const v3 = wave.geometry.faceVertexUvs[0][i][2]
            v1.x = dessertNum * (v1.x - quotient * uvUnit)
            v2.x = dessertNum * (v2.x - quotient * uvUnit)
            v3.x = dessertNum * (v3.x - quotient * uvUnit)
        }
        console.log(wave)

        scene.add(wave);

    }

    // lights
    const dirLight1 = new THREE.DirectionalLight(0xffffff);
    dirLight1.position.set(0, 1, 1);
    scene.add(dirLight1);

    const ambientLight = new THREE.AmbientLight(0x8c8c8c);
    scene.add(ambientLight);

    //window resize 대응
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener("mousedown", mouseDown);
    document.addEventListener("mouseup", mouseUp);

    document.addEventListener("mousemove", function (event) { mouseMove(event); });
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

function mouseDown() {
}

function mouseUp() {
}

function mouseMove(event) {
    mouse_x = event.clientX * 2 / window.innerWidth - 1; //-1 ~1
    mouse_y = event.clientY * 2 / window.innerHeight - 1; //-1 ~1

}

function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end
}
