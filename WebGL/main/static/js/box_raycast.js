let scene, renderer, camera, canvas
let cameraPole;
let pickPosition, pickHelper;
start();
update();

function start() {
    console.log("js onload")
    // start
    scene = new THREE.Scene()
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 200)
    scene.background = new THREE.Color(0xD8D7BF)

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvas = renderer.domElement
    document.getElementById("threejs_canvas").appendChild(canvas);

    camera.position.set(0, 0, 30);
    camera.lookAt(0, 0, 0);

    cameraPole = new THREE.Object3D();
    scene.add(cameraPole);
    cameraPole.add(camera);

    //add light to camera
    const light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set(-1, 2, 4);
    camera.add(light);

    //add cube to random position
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const numObjects = 100;
    for (let i = 0; i < numObjects; i++) {
        const material = new THREE.MeshPhongMaterial({
            color: randomColor()
        });

        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        cube.position.set(rand(-20, 20), rand(-20, 20), rand(-20, 20));
        cube.rotation.set(rand(Math.PI), rand(Math.PI), 0);
        cube.scale.set(rand(3, 6), rand(3, 6), rand(3, 6));
    }


    class PickHelper {
        constructor() {
            this.raycaster = new THREE.Raycaster();
            this.pickedObject = null;
            this.pickedObjectSavedColor = 0;
        }
        pick(normalizedPosition, scene, camera, time) {
            // restore the color if there is a picked object
            if (this.pickedObject) {
                this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
                this.pickedObject = undefined;
            }

            // cast a ray through the frustum
            this.raycaster.setFromCamera(normalizedPosition, camera);
            // get the list of objects the ray intersected
            const intersectedObjects = this.raycaster.intersectObjects(scene.children);
            if (intersectedObjects.length) {
                // pick the first object. It's the closest one
                this.pickedObject = intersectedObjects[0].object;
                this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
                console.log(Math.floor(time / 1000) % 2 == 1)
                this.pickedObject.material.emissive.setHex(Math.floor(time / 100) % 2 == 1 ? 0xFFFF00 : 0xFF0000);
            }
        }
    }

    pickPosition = { x: 0, y: 0 };
    pickHelper = new PickHelper();
    clearPickPosition();
    window.addEventListener('mousemove', setPickPosition);
    window.addEventListener('mouseout', clearPickPosition);
    window.addEventListener('mouseleave', clearPickPosition);

    window.addEventListener('touchstart', (event) => {
        // prevent the window from scrolling
        event.preventDefault();
        setPickPosition(pickPosition, event.touches[0]);
    }, { passive: false });

    window.addEventListener('touchmove', (event) => {
        setPickPosition(event.touches[0]);
    });

    window.addEventListener('touchend', clearPickPosition);

    //render를 매 프레임 호출하지 않고, 변화가 있을 시에만 렌더링
    window.addEventListener('resize', onWindowResize);
    update();
}

//update
function update() {
    const time = requestAnimationFrame(update);
    const speed = time * 0.001
    cameraPole.rotation.y = speed;

    pickHelper.pick(pickPosition, scene, camera, time);
    renderer.render(scene, camera);
}
function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (event.clientX - rect.left) * canvas.width / rect.width,
        y: (event.clientY - rect.top) * canvas.height / rect.height,
    };
}
function setPickPosition(event) {
    const pos = getCanvasRelativePosition(event);
    pickPosition.x = (pos.x / canvas.width) * 2 - 1;
    pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
}
function clearPickPosition() {
    // unlike the mouse which always has a position
    // if the user stops touching the screen we want
    // to stop picking. For now we just pick a value
    // unlikely to pick something
    pickPosition.x = -100000;
    pickPosition.y = -100000;
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

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
