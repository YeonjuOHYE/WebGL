import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { BufferGeometryUtils } from '../jsm/utils/BufferGeometryUtils.js'
let scene, renderer, camera, controls
let cube, plane, line
let planeAnchor


let renderRequested = false;

start();

function start() {
    console.log("js onload")
        // start
    scene = new THREE.Scene()
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100)
    scene.background = new THREE.Color(0x000000)

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("threejs_canvas").appendChild(renderer.domElement);

    camera.position.set(0, 0, 3);
    camera.lookAt(0, 0, 0);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 1.2;
    controls.maxDistance = 4;
    controls.update();

    loadFile('/media/main/earth_globe/gpw_v4_basic_demographic_characteristics_rev10_a000_14mt_2010_cntm_1_deg.asc')
        .then(parseData)
        .then(addBoxes)
        .then(render);

    // lights
    const dirLight1 = new THREE.DirectionalLight(0xffffff);
    dirLight1.position.set(1, 1, 1);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x002288);
    dirLight2.position.set(-1, -1, -1);
    scene.add(dirLight2);

    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);

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

function addBoxes(file) {
    // object 형식은 다음과 같이 변수명이 같으면 리턴 가능.. 신기 ..
    const { min, max, data } = file;
    const range = max - min;

    //longitude (y 축 회전 yaw-도리도리)
    const lonHelper = new THREE.Object3D();
    scene.add(lonHelper);
    // latitude (x 축 회전 pitch-끄덕끄덕)
    const latHelper = new THREE.Object3D();
    lonHelper.add(latHelper)

    const positionHelper = new THREE.Object3D();
    positionHelper.position.z = 1;
    latHelper.add(positionHelper)

    const originHelper = new THREE.Object3D();
    originHelper.position.z = 0.5;
    positionHelper.add(originHelper);

    const color = new THREE.Color();

    //data offset for texture mapping
    const lonFudge = Math.PI * -0.7;
    const latFudge = Math.PI * -0.05;

    const geometries = [];

    data.forEach((row, latNdx) => {
        row.forEach((value, lonNdx) => {
            if (value == undefined) {
                // foreach문에서 람다는 continue 가 아니라 return이다.
                return;
            }
            //0~1 normalization
            const amount = (value - min) / range;

            const geometry = new THREE.BoxBufferGeometry(1, 1, 1);

            // adjust the helpers to point to the latitude and longitude
            lonHelper.rotation.y = THREE.MathUtils.degToRad(lonNdx + file.xllcorner) + lonFudge;
            latHelper.rotation.x = THREE.MathUtils.degToRad(latNdx + file.yllcorner) + latFudge;

            positionHelper.scale.set(0.005, 0.005, THREE.MathUtils.lerp(0.01, 0.5, amount));

            //recursively updates global transform of ancestors.
            originHelper.updateWorldMatrix(true, false);
            geometry.applyMatrix4(originHelper.matrixWorld);

            //calculate color
            const hue = THREE.MathUtils.lerp(0.1, 0.4, amount);
            const saturation = 1;
            const lightness = THREE.MathUtils.lerp(0.4, 1, amount);
            color.setHSL(hue, saturation, lightness);

            //get rgb (0~255)
            // 차후에 0~1로 normalize (0~255할 것이지만, 우리는 한 color 당 8bit 만 쓰면 되므로 float를 쓰지 않는다.

            const rgb = color.toArray().map(v => v * 255) //rgba

            //save color for each vertex
            const numVerts = geometry.getAttribute('position').count; //24 정육면체
            const itemSize = 3; //rgb
            //256 float는 기본 32bit다.
            const colors = new Uint8Array(itemSize * numVerts); //vertex * 3 개의 색상 어레이 생성

            colors.forEach((v, ndx) => {
                colors[ndx] = rgb[ndx % 3] //vertexcolor는 순서대로 8bit rgb를 가진다. 
            });

            const normalized = true; //0~255를 0~1 값으로 normalize 하기 위함.
            //https://threejs.org/docs/#api/en/core/BufferAttribute
            const colorAttrib = new THREE.BufferAttribute(colors, itemSize, normalized);
            geometry.setAttribute('color', colorAttrib);

            geometries.push(geometry);
        });
    });

    // ## merge geometry to one object ##
    // geometries -- Array of BufferGeometry instances.
    // useGroups -- Whether groups should be generated for the merged geometry or not.
    const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries, false);
    const material = new THREE.MeshPhongMaterial({
        vertexColors: THREE.VertexColors
    });
    const mesh = new THREE.Mesh(mergedGeometry, material);
    scene.add(mesh);
}

async function loadFile(url) {
    const req = await fetch(url);
    return req.text()
}

function parseData(text) {
    const data = [];
    const settings = { data };
    let max;
    let min;
    //split into lines
    text.split('\n').forEach((line) => {
        //split the line by whitespace
        const parts = line.trim().split(/\s+/);
        if (parts.length === 2) {
            //only 2 parts, must be a key/value pair
            settings[parts[0]] = parseFloat(parts[1])
        } else if (parts.length > 2) {
            //more than 2 parts, must be data
            const values = parts.map((v) => {
                // parts list를 순회하면서 해당하는 파라미터를 넣은 리스트 생성
                const value = parseFloat(v);
                // -9999
                if (value === settings.NODATA_value) {
                    return undefined;
                }
                max = Math.max(max === undefined ? value : max, value);
                min = Math.min(min === undefined ? value : min, value);
                return value;
            });
            data.push(values)
        }
    });
    // dictionary 재생성. 첫 인자 memory에 추가로 덧붙임
    return Object.assign(settings, { min, max });
}