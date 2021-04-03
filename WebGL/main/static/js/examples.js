let scene, renderer, camera
let cube;

$(function () {
    start();
    update();
});
function start() {
    console.log("basic.js onload")

    const loadManager = new THREE.LoadingManager();
    const loader = new THREE.TextureLoader(loadManager);

    loadManager.onProgress = (url, itemsLoaded, itemsTotal) => {
        // console.log(url + " " + itemsLoaded + " " + itemsTotal);
    }
    loadManager.onLoad = () => {
        // console.log("end");
    }
    const titles = []
    const urls = []
    const authors = []
    const imageURLs = []
    $('.project .project_name').text(function (index, attr) {
        titles.push(attr.trim());
    });
    $('.project .project_url').text(function (index, attr) {
        urls.push(attr.trim());
    });
    $('.project .project_author').text(function (index, attr) {
        authors.push(attr.trim());
    });
    $('.project img').attr("src", function (index, attr) {
        imageURLs.push(new THREE.MeshPhongMaterial({ map: loader.load(attr) }));
    });
    // for (let i = 0; i < projects.length; i++) {
    //     const project = projects[i];
    //     const img = project;
    //     console.log(project);
    // }
    // start
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene.background = new THREE.Color(0x303030);
    scene.fog = new THREE.FogExp2(0x000000, 0.002);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("threejs_canvas").appendChild(renderer.domElement);

    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    //create a yellow cube
    const geometry_box = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5);
    const blue_material = new THREE.MeshPhongMaterial({ color: 0x0000ff });
    cube = new THREE.Mesh(geometry_box, blue_material);

    scene.add(cube);

    const item_g = new THREE.CircleGeometry(1, 64);
    const item_m_list = [
        new THREE.MeshPhongMaterial({ map: loader.load('/media/main/list_viewer/1.jpg') }),
        new THREE.MeshPhongMaterial({ map: loader.load('/media/main/list_viewer/2.jpg') }),
        new THREE.MeshPhongMaterial({ map: loader.load('/media/main/list_viewer/3.jpg') }),
        new THREE.MeshPhongMaterial({ map: loader.load('/media/main/list_viewer/4.jpg') }),
        new THREE.MeshPhongMaterial({ map: loader.load('/media/main/list_viewer/5.jpg') }),
        new THREE.MeshPhongMaterial({ map: loader.load('/media/main/list_viewer/6.jpg') }),
        new THREE.MeshPhongMaterial({ map: loader.load('/media/main/list_viewer/7.jpg') }),
        new THREE.MeshPhongMaterial({ map: loader.load('/media/main/list_viewer/8.jpg') }),
        new THREE.MeshPhongMaterial({ map: loader.load('/media/main/list_viewer/9.jpg') }),

    ];
    const item = new THREE.Mesh(item_g, imageURLs[1]);
    scene.add(item);
    const item2 = new THREE.Mesh(item_g, imageURLs[2]);
    scene.add(item2);
    const item3 = new THREE.Mesh(item_g, imageURLs[3]);
    scene.add(item3);
    item2.position.set(2, 0, 0);
    item3.position.set(1, -Math.sqrt(3), 0);

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
    document.addEventListener("mousemove", function (event) { mouseMove(event); });
}
function mouseMove(event) {
    const mouse_x = event.clientX * 2 / window.innerWidth - 1; //-1 ~1
    const mouse_y = event.clientY * 2 / window.innerHeight - 1; //-1 ~1
    // console.log(mouse_x);
    // console.log(mouse_y);
}

//update
function update() {
    requestAnimationFrame(update);

    renderer.render(scene, camera);
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
