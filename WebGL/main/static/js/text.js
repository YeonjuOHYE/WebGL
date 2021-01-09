import { OrbitControls } from '../jsm/controls/OrbitControls.js';

let scene, renderer, camera, controls

start();
update();

function start() {
    console.log("basic.js onload")
    // start
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    camera = new THREE.PerspectiveCamera(130, window.innerWidth / window.innerHeight, 0.1, 10000);
    scene.background = new THREE.Color(0xed8c33);
    scene.fog = new THREE.FogExp2(0x000000, 0.002);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("threejs_canvas").appendChild(renderer.domElement);

    camera.position.set(0, 0, 60);
    camera.lookAt(0, 0, 0);

    //set camera for mouse rotation
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    //create a cube after texture loaded
    const loader = new THREE.FontLoader();
    loader.load('/media/main/fonts/helvetiker_regular.typeface.json', function (font) {
        const color = 0x006699;
        const matDark = new THREE.LineBasicMaterial({
            color: color,
            side: THREE.DoubleSide
        });
        const matLite = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        });

        const message = "Happy\n2021.";
        const shapes = font.generateShapes(message, 100);
        const geometry = new THREE.ShapeBufferGeometry(shapes);

        geometry.computeBoundingBox();
        const xMid = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
        geometry.translate(xMid, 0, 0);

        // make shape 
        const text = new THREE.Mesh(geometry, matLite);
        text.position.z = - 150;
        scene.add(text);

        // make line shape 
        const holeShapes = [];
        for (let i = 0; i < shapes.length; i++) {
            const shape = shapes[i];
            if (shape.holes && shape.holes.length > 0) {
                for (let j = 0; j < shape.holes.length; j++) {
                    const hole = shape.holes[j];
                    holeShapes.push(hole);
                }
            }
        }

        shapes.push.apply(shapes, holeShapes);
        const lineText = new THREE.Object3D();

        for (let i = 0; i < shapes.length; i++) {
            const shape = shapes[i];
            const points = shape.getPoints();
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            geometry.translate(xMid, 0, 0);
            const lineMesh = new THREE.Line(geometry, matDark);
            lineText.add(lineMesh);
        }
        scene.add(lineText);
    }); //end load function

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
    controls.update();
    renderer.render(scene, camera);
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
