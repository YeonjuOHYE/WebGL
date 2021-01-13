import { OrbitControls } from '../jsm/controls/OrbitControls.js';

let scene, renderer, camera, controls

let lion
let body
let leg_anchor_l;
let leg_anchor_r;
let hair_list;
let beard_list_r, beard_list_l


start();
update();

function start() {
    console.log("basic.js onload")
    // start
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene.background = new THREE.Color(0xebe5e7);
    scene.fog = new THREE.FogExp2(0x000000, 0.002);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("threejs_canvas").appendChild(renderer.domElement);

    camera.position.set(0, 3, 10);
    camera.lookAt(0, 5, 0);

    //set camera for mouse rotation
    controls = new OrbitControls(camera, renderer.domElement)

    {
        //make lion
        lion = new THREE.Object3D();
        const body_m = new THREE.MeshPhongMaterial({ color: 0xffd377 });
        const hair_m = new THREE.MeshPhongMaterial({ color: 0xff553e });
        const eye_m = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const nose_m = new THREE.MeshPhongMaterial({ color: 0xb07388 });
        const mouth_m = new THREE.MeshPhongMaterial({ color: 0x000000 });

        //foot
        const foot_anchor = new THREE.Object3D();
        const foot_g = new THREE.BoxGeometry(1, 0.5, 0.5);
        const foot1 = new THREE.Mesh(foot_g, body_m)
        const foot2 = new THREE.Mesh(foot_g, body_m)
        const foot3 = new THREE.Mesh(foot_g, body_m)
        const foot4 = new THREE.Mesh(foot_g, body_m)
        foot1.position.set(0.55, 0, 0)
        foot2.position.set(-0.55, 0, 0)
        foot3.position.set(2, 0, -0.4)
        foot4.position.set(-2, 0, -0.4)
        foot_anchor.add(foot1)
        foot_anchor.add(foot2)
        foot_anchor.add(foot3)
        foot_anchor.add(foot4)
        lion.add(foot_anchor)

        //body
        const body_g = new THREE.ConeGeometry(2.5, 4, 3);
        body = new THREE.Mesh(body_g, body_m);
        body.position.set(0, 2, -1)
        body.scale.z = 0.3
        lion.add(body)

        //leg
        leg_anchor_l = new THREE.Object3D();
        leg_anchor_r = new THREE.Object3D();
        const leg_g = new THREE.BoxGeometry(0.7, 2, 0.7)
        const leg_l = new THREE.Mesh(leg_g, body_m)
        const leg_r = new THREE.Mesh(leg_g, body_m)
        leg_anchor_l.position.set(1.8, 0, - 1)
        leg_l.position.set(0, 1, 0)
        leg_anchor_l.rotation.z = -15 * Math.PI / 180
        leg_anchor_l.add(leg_l)
        leg_anchor_r.position.set(-1.8, 0, - 1)
        leg_r.position.set(0, 1, 0)
        leg_anchor_r.rotation.z = 15 * Math.PI / 180
        leg_anchor_r.add(leg_r)
        lion.add(leg_anchor_l)
        lion.add(leg_anchor_r)

        const head_anchor = new THREE.Object3D();
        //hair
        const hair_g = new THREE.BoxGeometry(1, 1, 0.3)
        hair_list = []
        const hair_anchor = new THREE.Object3D();
        for (let i = 0; i < 16; i++) {
            const hair = new THREE.Mesh(hair_g, hair_m)
            const quotient = (i - i % 4) / 4;
            const remainder = i % 4;
            hair.position.set(remainder - 1.5, quotient - 1.5, 0)
            hair_list.push(hair)
            hair_anchor.add(hair)
        }
        head_anchor.position.set(0, 3.5, -0.5)
        head_anchor.add(hair_anchor)
        lion.add(head_anchor)

        //face
        const face_g = new THREE.BoxGeometry(2.1, 2.1, 2.1)
        const face_anchor = new THREE.Object3D();
        const face = new THREE.Mesh(face_g, body_m)
        face.position.set(0, 0, 1.05)

        //nose
        const nose_g = new THREE.BoxGeometry(1, 1, 0.5)
        const nose = new THREE.Mesh(nose_g, nose_m)
        nose.position.set(0, 0.65, 0.9)
        face.add(nose)

        //chin
        const chin_g = new THREE.BoxGeometry(1, 0.35, 0.5)
        const chin = new THREE.Mesh(chin_g, body_m)
        chin.position.set(0, -1.225, 0.8)
        face.add(chin)

        //mouth
        const mouth_g = new THREE.BoxGeometry(0.25, 0.25, 0.1)
        const mouth = new THREE.Mesh(mouth_g, mouth_m)
        mouth.position.set(0, -0.8, 1.1)
        face.add(mouth)

        //left beard
        const beard_g = new THREE.BoxGeometry(0.8, 0.04, 0.04)
        beard_list_r = []
        beard_list_l = []
        for (let i = 0; i < 3; i++) {
            const beard_anchor_r = new THREE.Object3D();
            const beard_r = new THREE.Mesh(beard_g, nose_m)
            beard_r.position.set(-0.4, 0, 0)
            beard_list_r.push(beard_r)
            beard_anchor_r.add(beard_r)
            beard_anchor_r.position.set(-0.75 - i % 2 * 0.15, -0.17 * (i + 1), 1.05)
            face.add(beard_anchor_r)

            const beard_anchor_l = new THREE.Object3D();
            const beard_l = new THREE.Mesh(beard_g, nose_m)
            beard_l.position.set(0.4, 0, 0)
            beard_list_l.push(beard_l)
            beard_anchor_l.add(beard_l)
            beard_anchor_l.position.set(0.75 + i % 2 * 0.15, -0.17 * (i + 1), 1.05)
            face.add(beard_anchor_l)
        }

        //dot
        // const dot_g = new THREE.BoxGeometry((2.1, 2.1, 2.1)



        face_anchor.add(face)
        head_anchor.add(face_anchor)
    }


    scene.add(lion)


    // lights
    const dirLight1 = new THREE.DirectionalLight(0xffffff);
    dirLight1.position.set(1, 1, 1);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff);
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
    const speed = 1

    // leg_anchor_l.rotation.z += speed * Math.PI / 180
    // body.rotation.y += speed * Math.PI / 180
    controls.update();
    renderer.render(scene, camera);
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
