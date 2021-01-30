import { OrbitControls } from '../jsm/controls/OrbitControls.js';
let scene, renderer, camera, controls

let lion
let body, ear_r, ear_l, eye, pupil_l, pupil_r;
let leg_anchor_l, leg_anchor_r;
let hair_list, beard_list_r, beard_list_l;
let head_anchor
let hair_anchor
let face_anchor
let face
let cross_anchor, propeller_anchor;

let blowing = false
let currentspeed = 0

let eye_pos = [new THREE.Vector3(0, 0.64, -0.3), new THREE.Vector3(0, 0.72, -0.3)];
let eye_scale = [new THREE.Vector3(2.25, 0.8, 0.8), new THREE.Vector3(2.25, 0.07, 0.8)];
let pupil_l_pos = [new THREE.Vector3(1, 0.64, -0.3), new THREE.Vector3(1, 0.6, -0.3)];
let pupil_l_scale = [new THREE.Vector3(0.3, 0.25, 0.25), new THREE.Vector3(0.3, 0.05, 0.8)];
let pupil_r_pos = [new THREE.Vector3(-1, 0.64, -0.3), new THREE.Vector3(-1, 0.6, -0.3)];
let pupil_r_scale = [new THREE.Vector3(0.3, 0.25, 0.25), new THREE.Vector3(0.3, 0.05, 0.8)];

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

    camera.position.set(0, 7, 20);
    camera.lookAt(0, 0, 0);

    //set camera for mouse rotation
    // controls = new OrbitControls(camera, renderer.domElement)

    const body_m = new THREE.MeshPhongMaterial({ color: 0xffd377 });
    const body_m2 = new THREE.MeshBasicMaterial({ color: 0xffe785 });
    const hair_m = new THREE.MeshPhongMaterial({ color: 0xff553e });
    const eye_m = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const nose_m = new THREE.MeshPhongMaterial({ color: 0xb07388 });
    const mouth_m = new THREE.MeshPhongMaterial({ color: 0x000000 });



    //make lion
    {
        lion = new THREE.Object3D();

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
        body = new THREE.Mesh(body_g, body_m2);
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

        head_anchor = new THREE.Object3D();
        //hair
        const hair_g = new THREE.BoxGeometry(1, 1, 0.3)
        hair_list = []
        hair_anchor = new THREE.Object3D();
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
        face_anchor = new THREE.Object3D();
        face = new THREE.Mesh(face_g, body_m)
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
            beard_anchor_r.add(beard_r)
            beard_list_r.push(beard_anchor_r)
            beard_anchor_r.position.set(-0.75 - i % 2 * 0.15, -0.17 * (i + 1), 1.05)
            face.add(beard_anchor_r)

            const beard_anchor_l = new THREE.Object3D();
            const beard_l = new THREE.Mesh(beard_g, nose_m)
            beard_l.position.set(0.4, 0, 0)
            beard_anchor_l.add(beard_l)
            beard_list_l.push(beard_anchor_l)
            beard_anchor_l.position.set(0.75 + i % 2 * 0.15, -0.17 * (i + 1), 1.05)
            face.add(beard_anchor_l)
        }

        //dot
        const dot_g = new THREE.BoxGeometry(2.2, 0.1, 0.1)
        const dot1 = new THREE.Mesh(dot_g, hair_m)
        const dot2 = new THREE.Mesh(dot_g, hair_m)
        const dot3 = new THREE.Mesh(dot_g, hair_m)
        const dot4 = new THREE.Mesh(dot_g, hair_m)
        dot1.position.set(0, 0, 0.5)
        dot2.position.set(0, -0.6, 0.5)
        dot3.position.set(0, -0.3, 0.7)
        dot4.position.set(0, -0.4, 0.2)
        face.add(dot1)
        face.add(dot2)
        face.add(dot3)
        face.add(dot4)

        //ear
        const ear_g = new THREE.BoxGeometry(0.6, 0.6, 0.2)
        ear_r = new THREE.Mesh(ear_g, body_m)
        ear_l = new THREE.Mesh(ear_g, body_m)
        ear_r.position.set(-1.2, 1.1, -0.8)
        ear_l.position.set(1.2, 1.1, -0.8)
        face.add(ear_r)
        face.add(ear_l)

        //eye & pupil
        const eye_g = new THREE.BoxGeometry(1, 1, 1)
        const pupil_g = new THREE.BoxGeometry(1, 1, 1)
        eye = new THREE.Mesh(eye_g, eye_m)
        pupil_l = new THREE.Mesh(pupil_g, nose_m)
        pupil_r = new THREE.Mesh(pupil_g, nose_m)
        eye.position.copy(eye_pos[0])
        eye.scale.copy(eye_scale[0])

        pupil_l.position.copy(pupil_l_pos[0])
        pupil_r.position.copy(pupil_r_pos[0])
        pupil_l.scale.copy(pupil_l_scale[0])
        pupil_r.scale.copy(pupil_r_scale[0])

        face.add(eye)
        face.add(pupil_l)
        face.add(pupil_r)

        face_anchor.add(face)
        head_anchor.add(face_anchor)

    }
    lion.position.set(0, -1, 0)
    // lion.rotation.set(0.3, 0.3, 0)
    scene.add(lion)

    //make crosshair
    {
        const cross_center_g = new THREE.BoxGeometry(0.25, 0.25, 0.1)
        cross_anchor = new THREE.Object3D()
        const cross_center = new THREE.Mesh(cross_center_g, body_m)

        const cross_handle_g = new THREE.BoxGeometry(0.25, 0.25, 0.7)
        const cross_handle = new THREE.Mesh(cross_handle_g, nose_m)
        cross_handle.position.set(0, 0, 0.55)
        cross_center.add(cross_handle)

        propeller_anchor = new THREE.Object3D()

        const wing_vg = new THREE.BoxGeometry(0.25, 0.8, 0.05)
        const wing_hg = new THREE.BoxGeometry(0.8, 0.25, 0.05)
        const wing_1 = new THREE.Mesh(wing_vg, hair_m)
        const wing_2 = new THREE.Mesh(wing_hg, hair_m)
        const wing_3 = new THREE.Mesh(wing_vg, hair_m)
        const wing_4 = new THREE.Mesh(wing_hg, hair_m)
        wing_1.position.set(0, 0.7, 0)
        wing_2.position.set(0.7, 0, 0)
        wing_3.position.set(0, -0.7, 0)
        wing_4.position.set(-0.7, 0, 0)

        propeller_anchor.add(wing_1)
        propeller_anchor.add(wing_2)
        propeller_anchor.add(wing_3)
        propeller_anchor.add(wing_4)
        cross_center.add(propeller_anchor)
        cross_center.position.set(0, 0, 10)
        cross_anchor.add(cross_center)
    }
    cross_anchor.position.set(0, 2, 0)
    scene.add(cross_anchor)

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

    //headpose
    var propeller = new THREE.Vector3(); // create once an reuse it
    propeller_anchor.getWorldPosition(propeller)
    head_anchor.lookAt(propeller)
    head_anchor.rotation.z += mouse_x * mouse_y * 45 * Math.PI / 180
    // animation
    if (blowing) {
        //hair
        for (let i = 0; i < hair_list.length; i++) {
            hair_list[i].position.z = Math.cos(timer * 0.4 + i) * 0.2
        }
        //beard
        for (let i = 0; i < beard_list_r.length; i++) {
            beard_list_r[i].rotation.y = Math.cos(timer * 0.4 + i) * 0.25 + 0.25
            beard_list_l[i].rotation.y = Math.cos(timer * 0.4 + i) * 0.25 - 0.25
        }
        //ear
        ear_r.rotation.x = (Math.cos(timer * 0.5) - 0.5) * 0.1
        ear_l.rotation.x = (Math.sin(timer * 0.5) - 0.5) * 0.1
        //eye
        eye.position.lerp(eye_pos[1], 0.05)
        eye.scale.lerp(eye_scale[1], 0.05)
        pupil_l.position.lerp(pupil_l_pos[1], 0.2)
        pupil_l.scale.lerp(pupil_l_scale[1], 0.05)
        pupil_r.position.lerp(pupil_r_pos[1], 0.2)
        pupil_r.scale.lerp(pupil_r_scale[1], 0.05)

        head_anchor.position.lerp(new THREE.Vector3(0, 4, 1), 0.1)
        head_anchor.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1)
        hair_anchor.rotation.y = lerp(hair_anchor.rotation.y, mouse_x * -70 * Math.PI / 180, 0.1)
        hair_anchor.rotation.x = lerp(hair_anchor.rotation.x, mouse_y * -90 * Math.PI / 180, 0.1)
        face.position.z = lerp(face.position.z, 1.5, 0.1)
        face_anchor.rotation.x = lerp(face_anchor.rotation.x, mouse_y * -120 * Math.PI / 180, 0.1)
        face_anchor.rotation.y = lerp(face_anchor.rotation.y, mouse_x * -120 * Math.PI / 180, 0.1)


        leg_anchor_l.rotation.z = lerp(leg_anchor_l.rotation.z, (-15 + mouse_x * -30) * Math.PI / 180, 0.1)
        leg_anchor_r.rotation.z = lerp(leg_anchor_r.rotation.z, (15 + mouse_x * -30) * Math.PI / 180, 0.1)
    }
    else {
        for (let i = 0; i < hair_list.length; i++) {
            hair_list[i].position.z = 0
        }
        for (let i = 0; i < beard_list_r.length; i++) {
            beard_list_r[i].rotation.y = 0
            beard_list_l[i].rotation.y = 0
        }
        eye.position.lerp(eye_pos[0], 0.05)
        eye.scale.lerp(eye_scale[0], 0.05)
        pupil_l.position.lerp(pupil_l_pos[0], 0.2)
        pupil_l.scale.lerp(pupil_l_scale[0], 0.05)
        pupil_r.position.lerp(pupil_r_pos[0], 0.2)
        pupil_r.scale.lerp(pupil_r_scale[0], 0.05)

        head_anchor.position.lerp(new THREE.Vector3(0, 3.5, 0), 0.1)
        head_anchor.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
        hair_anchor.rotation.y = lerp(hair_anchor.rotation.y, 0, 0.1)
        hair_anchor.rotation.x = lerp(hair_anchor.rotation.x, 0, 0.1)
        face.position.z = lerp(face.position.z, 1.05, 0.1)
        face_anchor.rotation.y = lerp(face_anchor.rotation.y, 0, 0.1)
        face_anchor.rotation.x = lerp(face_anchor.rotation.x, 0, 0.1)
        leg_anchor_l.rotation.z = lerp(leg_anchor_l.rotation.z, (-15 + mouse_x * 30) * Math.PI / 180, 0.3)
        leg_anchor_r.rotation.z = lerp(leg_anchor_r.rotation.z, (15 + mouse_x * 30) * Math.PI / 180, 0.3)
    }

    //propeller blowing
    const targetSpeed = blowing ? 20 : 0;
    currentspeed = lerp(currentspeed, targetSpeed, 0.05)
    propeller_anchor.rotation.z += currentspeed * Math.PI / 180

    renderer.render(scene, camera);
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function mouseDown() {
    blowing = true
}

function mouseUp() {
    blowing = false
}

function mouseMove(event) {
    mouse_x = event.clientX * 2 / window.innerWidth - 1; //-1 ~1
    mouse_y = event.clientY * 2 / window.innerHeight - 1; //-1 ~1

    const pupil_z_l = -mouse_x * 0.55 / 2 - 0.3// -1 1 to -0.575 -0.025 
    const pupil_z_r = mouse_x * 0.55 / 2 - 0.3
    const pupil_y = -mouse_y * 0.55 / 2 + 0.64// -1 1 to 0.365 0.915
    //pupil
    pupil_l_pos[0] = new THREE.Vector3(1, pupil_y, pupil_z_l)
    pupil_r_pos[0] = new THREE.Vector3(-1, pupil_y, pupil_z_r)

    //cross_anchor
    cross_anchor.rotation.y = mouse_x
    cross_anchor.rotation.x = mouse_y

}

function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end
}
