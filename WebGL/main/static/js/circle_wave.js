let renderer, scene, camera;
let uniforms;
let mouseX=0, mouseY=0;
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
    iMouse:  { value: new THREE.Vector4() },
  };
  
  const material = new THREE.ShaderMaterial({
    uniforms:uniforms,
    fragmentShader:fShader,
  });

  scene.add(new THREE.Mesh(plane, material));
  
  //window resize 대응
  window.addEventListener('resize', onWindowResize, false);
  //mouse move 대응
  document.addEventListener("mousemove", function (event) { mouseMove(event); });
}

function update(){
  
  const time = requestAnimationFrame(update) * 0.01;
  
  uniforms.iResolution.value.set(window.innerWidth,  window.innerHeight, 1);
  uniforms.iTime.value = time;
  uniforms.iMouse.value.x = lerp(uniforms.iMouse.value.x, mouseX, 0.12) ;
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
  mouseY = window.innerHeight-event.clientY;
}

function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end
}