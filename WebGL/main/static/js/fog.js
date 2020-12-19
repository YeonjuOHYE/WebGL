import { GUI } from '../jsm/gui/dat.gui.module.js';

let scene, renderer, camera
let cubes
start();
update();

function start() {
    console.log("basic.js onload")
    // start

    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    const near = 3
    const far = 8
    const color = 0xafb7a0
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, near, far);
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(color, 4, 5);
    scene.background = new THREE.Color(color);
    camera.position.z = 5;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("threejs_canvas").appendChild(renderer.domElement);

    //attach gui
    class FogGUIHelper {
        constructor(fog, backgroundColor) {
            this.fog = fog;
            this.backgroundColor = backgroundColor;
        }
        get near() {
            return this.fog.near;
        }
        set near(v) {
            this.fog.near = v;
            this.fog.far = Math.max(this.fog.far, v)
        }
        get far() {
            return this.fog.far;
        }
        set far(v) {
            this.fog.far = v;
            this.fog.near = Math.min(this.fog.near, v)
        }
        get color() {
            return `#${this.fog.color.getHexString()}`;
        }
        set color(hexString) {
            this.fog.color.set(hexString);
            this.backgroundColor.set(hexString);
        }
    }
    const gui = new GUI()
    const fogGUIHelper = new FogGUIHelper(scene.fog, scene.background)
    gui.add(fogGUIHelper, 'near', near, far).listen()
    gui.add(fogGUIHelper, 'far', near, far).listen()
    gui.addColor(fogGUIHelper, 'color')

    // cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    function makeInstance(geometry, color, x) {
        const material = new THREE.MeshPhongMaterial({ color });

        const cube = new THREE.Mesh(geometry, material)
        scene.add(cube);

        cube.position.x = x;
        return cube;
    }

    cubes = [
        makeInstance(geometry, 0x8844aa, -2),
        makeInstance(geometry, 0x44aa88, 0),
        makeInstance(geometry, 0xaa8844, 2)
    ];


    // lights
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(-1, 2, 4);
    scene.add(light)

    //window resize 대응
    window.addEventListener('resize', onWindowResize, false);
}
//update
function update() {
    requestAnimationFrame(update);
    cubes.forEach((cube, ndx) => {
        const speed = 0.005

        cube.rotation.x += speed;
        cube.rotation.y += speed;
    })
    renderer.render(scene, camera);
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
