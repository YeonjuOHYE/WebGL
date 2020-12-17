import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { GUI } from '../jsm/gui/dat.gui.module.js';


let scene, renderer, camera, controls
let cube;

start();
update();

function start() {
    console.log("basic.js onload")
    // start
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene.background = new THREE.Color(0xffcc33);
    scene.fog = new THREE.FogExp2(0x000000, 0.002);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("threejs_canvas").appendChild(renderer.domElement);

    camera.position.set(0, 0, 3);
    camera.lookAt(0, 0, 0);

    //set camera for mouse rotation
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    //create a cube after texture loaded
    const loader = new THREE.TextureLoader();
    const lenna_texture = loader.load('/media/main/texture_gui/Lenna.png', (texture) => {
        const geometry_box = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({
            map: texture
        });
        cube = new THREE.Mesh(geometry_box, material);
        scene.add(cube);
    });

    // texture wrap
    lenna_texture.wrapS = THREE.RepeatWrapping
    lenna_texture.wrapT = THREE.RepeatWrapping

    // texture repeat
    const timesToRepeatHorizontally = 1
    const timesToRepeatVertically = 1
    lenna_texture.repeat.set(timesToRepeatHorizontally, timesToRepeatVertically)

    // texture offset
    const xoffset = 0
    const yoffset = 0
    lenna_texture.offset.set(xoffset, yoffset)

    // texture rotation
    lenna_texture.center.set(.5, .5)
    lenna_texture.rotation = THREE.MathUtils.degToRad(0)

    class DegRadHelper {
        constructor(obj, prop) {
            this.obj = obj;
            this.prop = prop;
        }
        get value() {
            return THREE.MathUtils.radToDeg(this.obj[this.prop])
        }
        set value(v) {
            this.obj[this.prop] = THREE.MathUtils.degToRad(v)
        }
    }

    class StringToFloatHelper {
        constructor(obj, prop) {
            this.obj = obj
            this.prop = prop
        }
        get value() {
            return this.obj[this.prop]
        }
        set value(v) {
            this.obj[this.prop] = parseFloat(v)
        }
    }

    const wrapModes = {
        'ClampToEdgeWrapping': THREE.ClampToEdgeWrapping,
        'RepeatWrapping': THREE.RepeatWrapping,
        'mirrordRepeatWrapping': THREE.MirroredRepeatWrapping,
    }

    function updateTexture() {
        lenna_texture.needsUpdate = true;
    }

    const gui = new GUI()
    gui.add(new StringToFloatHelper(lenna_texture, 'wrapS'), 'value', wrapModes)
        .name('texture.wrapS')
        .onChange(updateTexture)
    gui.add(new StringToFloatHelper(lenna_texture, 'wrapT'), 'value', wrapModes)
        .name('texture.wrapT')
        .onChange(updateTexture)
    gui.add(lenna_texture.repeat, 'x', 0, 5, 0.1).name('texture.repeat.x')
    gui.add(lenna_texture.repeat, 'y', 0, 5, .1).name('texture.repeat.y');
    gui.add(lenna_texture.offset, 'x', -2, 2, .1).name('texture.offset.x');
    gui.add(lenna_texture.offset, 'y', -2, 2, .1).name('texture.offset.y');
    gui.add(lenna_texture.center, 'x', -.5, 1.5, .1).name('texture.center.x');
    gui.add(lenna_texture.center, 'y', -.5, 1.5, .1).name('texture.center.y');
    gui.add(new DegRadHelper(lenna_texture, 'rotation'), 'value', -360, 360)
        .name('texture.rotation');

    // lights
    const dirLight1 = new THREE.DirectionalLight(0xffffff);
    dirLight1.position.set(1, 1, 1);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x002288);
    dirLight2.position.set(- 1, - 1, - 1);
    scene.add(dirLight2);

    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);

    //window resize 대응
    window.addEventListener('resize', onWindowResize, false);
}
//update
function update() {
    requestAnimationFrame(update);
    const speed = 0.01
    if (cube) {
        cube.rotation.x += speed;
        cube.rotation.y += speed;
    }
    controls.update();
    renderer.render(scene, camera);
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
