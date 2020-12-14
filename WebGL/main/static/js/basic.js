import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { GUI } from '../jsm/gui/dat.gui.module.js';

let scene, renderer, camera, controls
let cube, plane, line
let planeAnchor

start();
update();

function start() {
    console.log("basic.js onload")
    // start
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    const gui = new GUI();
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene.background = new THREE.Color(0x303030);
    scene.fog = new THREE.FogExp2(0x000000, 0.002);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("threejs_canvas").appendChild(renderer.domElement);

    camera.position.set(0, 3, 5);
    camera.lookAt(0, 0, 0);
    controls = new OrbitControls(camera, renderer.domElement)

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    //create a yellow cube
    const geometry_box = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5);
    const blue_material = new THREE.MeshPhongMaterial({ color: 0x0000ff });
    cube = new THREE.Mesh(geometry_box, blue_material);
    cube.position.set(-1, 0, 0)

    // Turns both axes and grid visible on/off
    // GUI requires a property that returns a bool
    // to decide to make a checkbox so we make a setter
    // can getter for `visible` which we can tell GUI
    // to look at.
    class AxisGridHelper {
        constructor(node, units = 10) {
            const axes = new THREE.AxesHelper();
            axes.material.depthTest = false;
            axes.renderOrder = 2;  // after the grid
            node.add(axes);

            const grid = new THREE.GridHelper(units, units);
            grid.material.depthTest = false;
            grid.renderOrder = 1;
            node.add(grid);

            this.grid = grid;
            this.axes = axes;
            this.visible = true;
        }
        get visible() {
            return this._visible;
        }
        set visible(v) {
            this._visible = v;
            this.grid.visible = v;
            this.axes.visible = v;
        }
    }

    function makeAxisGrid(node, label, units) {
        const helper = new AxisGridHelper(node, units);
        gui.add(helper, 'visible').name(label);
    }

    makeAxisGrid(cube, 'cubeMesh', 5);
    scene.add(cube);


    const geometry_plane = new THREE.PlaneBufferGeometry(1, 1);
    const plane_material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    plane = new THREE.Mesh(geometry_plane, plane_material);
    plane.material.side = THREE.DoubleSide;
    planeAnchor = new THREE.Group();
    plane.position.set(1, 0, 0)
    planeAnchor.add(plane)
    scene.add(planeAnchor);


    //create a blue LineBasicMaterial
    const yellow_material = new THREE.LineBasicMaterial({
        color: 0xffff00,
    });
    const points = [];
    points.push(new THREE.Vector3(- 1.5, 0, 0));
    points.push(new THREE.Vector3(0, 1.5, -1.5));
    points.push(new THREE.Vector3(1.5, 0, 0));
    points.push(new THREE.Vector3(- 1.5, 0, 0));
    const geometry_line = new THREE.BufferGeometry().setFromPoints(points);
    line = new THREE.Line(geometry_line, yellow_material);

    scene.add(line);

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
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    planeAnchor.rotation.y += 0.01;
    plane.rotation.y += 0.01;
    controls.update();

    renderer.render(scene, camera);
};

function makeAxisGrid(node, label, units) {
    const helper = new AxisGridHelper(node, units);
    gui.add(helper, 'visible').name(label);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
