let renderer, scene, camera;
let uniforms;
start();
update();

function start() {
  console.log("basic.js onload")
  //start
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  camera = new THREE.OrthographicCamera(
    -1, // left
      1, // right
      1, // top
    -1, // bottom
    -1, // near,
      1, // far
  );
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("threejs_canvas").appendChild(renderer.domElement);

  const plane = new THREE.PlaneGeometry(2, 2);
  const fShader = document.getElementById('fragmentShader').innerHTML;

  uniforms = {
    iTime: { value: 0 },
    iResolution:  { value: new THREE.Vector3() },
  };

  const material = new THREE.ShaderMaterial({
    uniforms:uniforms,
    fragmentShader:fShader,
  });

  scene.add(new THREE.Mesh(plane, material));
  
  // add text
  const loader = new THREE.FontLoader();
  loader.load('/media/main/fonts/helvetiker_regular.typeface.json', function (font) {
    const message = "SHADER TOY";
    const text_g = new THREE.TextGeometry(message, {
        font: font,
        size: 0.15,
        height: 1,
    });

    const text_m = new THREE.MeshBasicMaterial({
      color : 0xffffff,
      opacity: 0.5,
      transparent : true})
    const text = new THREE.Mesh(text_g, text_m)
    text.position.set(-0.55,-0.05,0)
    text.scale.set(0.8,1,1)
    scene.add(text);
  });

  //window resize 대응
  window.addEventListener('resize', onWindowResize, false);
}

function update(){
  
  const time = requestAnimationFrame(update) * 0.01;
  
  uniforms.iResolution.value.set(window.innerWidth,  window.innerHeight, 1);
  uniforms.iTime.value = time;
  
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

