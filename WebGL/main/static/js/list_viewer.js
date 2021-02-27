import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { EffectComposer } from '../jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '../jsm/postprocessing/ShaderPass.js';
import { GUI } from '../jsm/gui/dat.gui.module.js';
let scene, renderer, camera, controls
let composer, colorPass;
let wave;

let wheel_pos;
let clamp_x;

let meshDivide;
start();
update();

function start() {
    window.scroll(0, 0);
    console.log("basic.js onload")
    // start
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);

    const background_color = new THREE.Color(0x202020);
    const foreground_color = new THREE.Color(0x666666);

    scene.background = background_color

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("threejs_canvas").appendChild(renderer.domElement);

    camera.position.set(-5, 10, 10);
    camera.lookAt(0, 0, 0);

    //set camera for mouse rotation
    // controls = new OrbitControls(camera, renderer.domElement)

    //add foggy Text
    const loader = new THREE.FontLoader();
    loader.load('/media/main/fonts/helvetiker_regular.typeface.json', function (font) {
        const message = "WEB\nGRAPHIC\nEXPERIMANT";
        const text_g = new THREE.TextGeometry(message, {
            font: font,
            size: 4,
            height: 0.04,
        });

        const text_m = []
        const text = []
        for (let i = 0; i < 20; i++) {
            text_m.push(new THREE.MeshBasicMaterial({ color: ColorLerp(background_color, foreground_color, i * 1 / 20) }))
            text.push(new THREE.Mesh(text_g, text_m[i]))
        }

        for (let i = 0; i < text.length; i++) {
            text[i].rotation.x = - 90 * Math.PI / 180;
            text[i].position.set(-9, -1.2 + i * 0.04, -7);
            scene.add(text[i]);
        }
    });

    //add waving plane
    {
        const textureWidth = 320
        const textureHeight = 240
        const rightMargin = 50
        const dessertNum = 10;
        meshDivide = (textureWidth + rightMargin) / 10;


        const loadManager = new THREE.LoadingManager();
        const loader = new THREE.TextureLoader(loadManager);

        const pos_x = (textureWidth + rightMargin) * dessertNum / 50 / 2
        wheel_pos = clamp_x = pos_x
        const wave_g = new THREE.PlaneGeometry((textureWidth + rightMargin) * dessertNum / 50, textureHeight / 50, dessertNum * meshDivide);
        const wave_m_list = [
            new THREE.MeshPhongMaterial({ map: loader.load('/media/main/list_viewer/1.jpg') }),
            new THREE.MeshPhongMaterial({ map: loader.load('/media/main/list_viewer/2.jpg') }),
            new THREE.MeshPhongMaterial({ map: loader.load('/media/main/list_viewer/3.jpg') }),
            new THREE.MeshPhongMaterial({ map: loader.load('/media/main/list_viewer/4.jpg') }),
            new THREE.MeshPhongMaterial({ map: loader.load('/media/main/list_viewer/5.jpg') }),
            new THREE.MeshPhongMaterial({ map: loader.load('/media/main/list_viewer/6.jpg') }),
            new THREE.MeshPhongMaterial({ map: loader.load('/media/main/list_viewer/7.jpg') }),
            new THREE.MeshPhongMaterial({ map: loader.load('/media/main/list_viewer/8.jpg') }),
            new THREE.MeshPhongMaterial({ map: loader.load('/media/main/list_viewer/9.jpg') }),
            new THREE.MeshPhongMaterial({ map: loader.load('/media/main/list_viewer/10.jpg') }),
        ];
        wave = new THREE.Mesh(wave_g, wave_m_list);
        loadManager.onLoad = () => {
            // wave = new THREE.Mesh(wave_g, wave_m_list);
            wave.rotation.set(-90 * Math.PI / 180, 0, 0);
            wave.position.x = pos_x;
            //set vertex pos
            const halfIndex = wave.geometry.vertices.length / 2
            for (let i = 0; i < halfIndex; i++) {
                wave.geometry.vertices[i].z = Math.sin((i / meshDivide) * 1.5 * Math.PI) * 2 / 3;
                wave.geometry.vertices[i + halfIndex].z = Math.sin((i / meshDivide) * 1.5 * Math.PI) * 2 / 3;
            }
            //set face texture
            const faceUvUnit = 2 * meshDivide;
            const contentUnit = faceUvUnit * (textureWidth / (textureWidth + rightMargin))
            for (let i = 0; i < wave.geometry.faces.length; i++) {
                wave.geometry.faces[i].materialIndex = Math.floor(i / faceUvUnit);
                //inverse face order (transparent)
                if (i % faceUvUnit >= contentUnit) {
                    const temp = wave.geometry.faces[i].a;
                    wave.geometry.faces[i].a = wave.geometry.faces[i].b;
                    wave.geometry.faces[i].b = temp
                }
            }

            //set vertex uv
            for (let i = 0; i < wave.geometry.faceVertexUvs[0].length; i++) {
                const quotient = Math.floor(i / (faceUvUnit))
                const uvUnit = 1 / dessertNum;
                const v1 = wave.geometry.faceVertexUvs[0][i][0]
                const v2 = wave.geometry.faceVertexUvs[0][i][1]
                const v3 = wave.geometry.faceVertexUvs[0][i][2]
                v1.x = dessertNum * (v1.x - quotient * uvUnit) * faceUvUnit / contentUnit
                v2.x = dessertNum * (v2.x - quotient * uvUnit) * faceUvUnit / contentUnit
                v3.x = dessertNum * (v3.x - quotient * uvUnit) * faceUvUnit / contentUnit
            }
            console.log(wave)

            scene.add(wave);
        }
    }

    // lights
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    //post processing
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    var pixelRatio = renderer.getPixelRatio();
    const colorShader = {
        uniforms: {
            tDiffuse: { value: null },
            color: { value: new THREE.Color(0x000000) },
            resolution: {
                value: {
                    x: 1 / (window.innerWidth * pixelRatio),
                    y: 1 / (window.innerHeight * pixelRatio)
                }
            }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            uniform sampler2D tDiffuse;
            varying vec2 vUv;
            void main() {
            vec4 previousPassColor = texture2D(tDiffuse, vUv);
            gl_FragColor = vec4(
                previousPassColor.rgb * color,
                previousPassColor.a);
            }
        `,
    };

    var pixelRatio = renderer.getPixelRatio();

    colorPass = new ShaderPass(colorShader);
    colorPass.renderToScreen = true;
    var uniforms = colorPass.material.uniforms;
    uniforms['resolution'].value.x = 1 / (window.innerWidth * pixelRatio);
    uniforms['resolution'].value.y = 1 / (window.innerHeight * pixelRatio);
    composer.addPass(colorPass);
    //window resize 대응
    window.addEventListener('resize', onWindowResize, false);
    // document.addEventListener("mousewheel", mouseWheel, false );
}
//update
function update() {
    const timer = requestAnimationFrame(update);
    wave.geometry.verticesNeedUpdate = true;
    // controls.update()
    colorPass.uniforms.color.value.setHSL(timer % 1000 / 1000, 0.4, 0.8)

    //mouse scroll event
    const numerator = window.scrollY
    const denominator = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    wheel_pos = -clamp_x * 2 * (numerator / denominator - 0.5) //0~1 to 37 ~-37 
    const pos_x = Lerp(wave.position.x, wheel_pos, 0.05);
    wave.position.x = pos_x
    const halfIndex = wave.geometry.vertices.length / 2
    for (let i = 0; i < halfIndex; i++) {
        wave.geometry.vertices[i].z = Math.sin(((i / meshDivide) * 1.5 + pos_x * 0.2 - timer * 0.003) * Math.PI) / 3;
        wave.geometry.vertices[i + halfIndex].z = Math.sin(((i / meshDivide) * 1.5 + pos_x * 0.2 - timer * 0.003) * Math.PI) / 3;
    }


    // renderer.render(scene, camera);
    composer.render(timer);
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function ColorLerp(start, end, amt) {
    return start.clone().lerpHSL(end, amt)
}
function Lerp(start, end, amt) {
    return (1 - amt) * start + amt * end
}