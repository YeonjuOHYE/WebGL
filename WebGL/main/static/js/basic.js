function onload() {
    console.log("basic.js onload")
    // start
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("threejs_canvas").appendChild(renderer.domElement);
    camera.position.set(0, 0, 3);
    camera.lookAt(0, 0, 0);

    //create a yellow cube
    const geometry_box = new THREE.BoxGeometry();
    const blue_material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const cube = new THREE.Mesh(geometry_box, blue_material);
    scene.add(cube);

    //create a blue LineBasicMaterial
    const yellow_material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const points = [];
    points.push(new THREE.Vector3(- 1.5, 0, 0));
    points.push(new THREE.Vector3(0, 1.5, -1.5));
    points.push(new THREE.Vector3(1.5, 0, 0));
    const geometry_line = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry_line, yellow_material);
    scene.add(line);

    //update
    const animate = function () {
        requestAnimationFrame(animate);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
    };

    animate();

}