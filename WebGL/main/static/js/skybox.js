import { OrbitControls } from '../jsm/controls/OrbitControls.js';

let scene, renderer, camera, controls

let renderRequested = false;

start();

function start() {
    console.log("js onload")
    // start
    scene = new THREE.Scene()
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100)

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("threejs_canvas").appendChild(renderer.domElement);

    camera.position.set(3, 0, 0);
    camera.lookAt(0, 0, 0);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.update();

    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        '/media/main/skybox/pos-x.jpg',
        '/media/main/skybox/neg-x.jpg',
        '/media/main/skybox/pos-y.jpg',
        '/media/main/skybox/neg-y.jpg',
        '/media/main/skybox/pos-z.jpg',
        '/media/main/skybox/neg-z.jpg',
    ], (texture) => {
        scene.background = texture;
        requestRenderIfNotRequested();
    });


    //render를 매 프레임 호출하지 않고, 변화가 있을 시에만 렌더링
    controls.addEventListener('change', requestRenderIfNotRequested);
    window.addEventListener('resize', requestRenderIfNotRequested);
    render()
}

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height);
    }
    return needResize;
}

function render() {
    renderRequested = undefined;

    if (resizeRendererToDisplaySize(renderer)) {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix();
    }

    controls.update();
    renderer.render(scene, camera);
}

function requestRenderIfNotRequested() {
    if (!renderRequested) {
        renderRequested = true;
        requestAnimationFrame(render);
    }
}
