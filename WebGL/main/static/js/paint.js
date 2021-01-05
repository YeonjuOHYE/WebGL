import { OrbitControls } from '../jsm/controls/OrbitControls.js';
let scene, renderer, camera, canvas, controls
let pointPos;

start();
update();

function start() {
    console.log("js onload")
    // start
    scene = new THREE.Scene()
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    const w = window.innerWidth
    const h = window.innerHeight
    camera = new THREE.OrthographicCamera(w / -2, w / 2, h / 2, h / -2, 0.1, 200)
    // camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene.background = new THREE.Color(0xD8D7BF)

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvas = renderer.domElement
    document.getElementById("threejs_canvas").appendChild(canvas);

    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
    controls = new OrbitControls(camera, renderer.domElement)
    scene.add(camera);

    //add light to camera
    const light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set(-1, 2, 4);
    camera.add(light);

    //add cube to random position
    const geometry = new THREE.CircleGeometry(391, 32);
    const material = new THREE.MeshPhongMaterial({
        color: randomColor(),
        side: THREE.DoubleSide
    });
    const circle = new THREE.Mesh(geometry, material);
    scene.add(circle)
    // var box = document.querySelector(".box");
    // var pageX = document.getElementById("x");
    // var pageY = document.getElementById("y");

    function updateDisplay(event) {
        console.log(event);
        // circle.position.set(event.pageX, event.pageY, 0);
        // pageY.innerText = event.pageY;
    }

    window.addEventListener("mousemove", updateDisplay, false);
    window.addEventListener("mouseenter", updateDisplay, false);
    window.addEventListener("mouseleave", updateDisplay, false);
    //render를 매 프레임 호출하지 않고, 변화가 있을 시에만 렌더링
    window.addEventListener('resize', onWindowResize);
    update();
}

//update
function update() {
    const time = requestAnimationFrame(update);
    const speed = time * 0.001
    controls.update();
    renderer.render(scene, camera);
}

function rand(min, max) {
    if (max === undefined) {
        max = min;
        min = 0;
    }
    return min + (max - min) * Math.random();
}

function randomColor() {
    return `hsl(${rand(360) | 0}, ${rand(50, 100) | 0}%, 50%)`
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
