let renderer, scene, camera;
let uniforms;
let mouseX = 0, mouseY = 0;
start();
update();

function start() {
  console.log("basic.js onload")
  //start
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("threejs_canvas").appendChild(renderer.domElement);
  scene.background = new THREE.Color(0x017143);
  camera.position.set(0, 0, 20);
  camera.lookAt(0, 0, 0);

  const fShader = document.getElementById('fragmentShader').innerHTML;
  const vShader = document.getElementById('vertexShader').innerHTML;

  // const texture = loader.load('/media/main/glitch/starbucks.jpg');
  const loader = new THREE.TextureLoader();
  const texture = loader.load('/media/main/glitch/starbucks.jpg', (texture) => {
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    const plane = new THREE.PlaneGeometry(10, 10);
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vShader,
      fragmentShader: fShader,
    });

    scene.add(new THREE.Mesh(plane, material));
  });

  uniforms = {
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector3() },
    iChannel0: { value: texture },
    iMouse: { value: new THREE.Vector4() },
    iRandNum: { value: 0 },
  };

  //window resize 대응
  window.addEventListener('resize', onWindowResize, false);
  //mouse move 대응
  document.addEventListener("mousemove", function (event) { mouseMove(event); });
}

function update() {

  const time = requestAnimationFrame(update) * 0.01;

  uniforms.iResolution.value.set(window.innerWidth, window.innerHeight, 1);
  uniforms.iTime.value = time;
  uniforms.iRandNum.value = Math.random();
  uniforms.iMouse.value.x = lerp(uniforms.iMouse.value.x, mouseX, 0.12);
  uniforms.iMouse.value.y = lerp(uniforms.iMouse.value.y, mouseY, 0.12);

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function mouseMove(event) {
  mouseX = event.clientX;
  mouseY = window.innerHeight - event.clientY;
}

function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end
}