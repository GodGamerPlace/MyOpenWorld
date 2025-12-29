// ===============================
// MAIN GAME CONTROLLER
// ===============================

let scene, camera, renderer, clock;
let player, car, world;
let isInCar = false;

// Expose startGame globally
window.startGame = function() {
    if (window.gameStarted) return;
    window.gameStarted = true;

    initThree();
    initWorld();
    initPlayer();
    initCar();
    animate();
};

// -------------------------------
// THREE.JS SETUP
// -------------------------------
function initThree() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 5, 10);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    clock = new THREE.Clock();

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const sun = new THREE.DirectionalLight(0xffffff, 0.8);
    sun.position.set(50, 100, 50);
    scene.add(sun);

    // Resize
    window.addEventListener("resize", onResize);
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// -------------------------------
// INIT OBJECTS
// -------------------------------
function initWorld() {
    world = createWorld(scene);
}

function initPlayer() {
    player = createPlayer(scene, camera);
}

function initCar() {
    car = createCar(scene);
}

// -------------------------------
// ENTER / EXIT CAR
// -------------------------------
window.addEventListener("keydown", (e) => {
    if (!window.gameStarted) return;

    if (e.key.toLowerCase() === "e") {
        toggleCar();
    }
});

function toggleCar() {
    if (!player || !car || !car.mesh.visible) return;

    const distance = player.mesh.position.distanceTo(car.mesh.position);

    if (!isInCar && distance < 3) {
        isInCar = true;
        player.mesh.visible = false;
        car.isActive = true;
    } else if (isInCar) {
        isInCar = false;
        player.mesh.visible = true;
        player.mesh.position.copy(car.mesh.position);
        player.mesh.position.x += 2;
        car.isActive = false;
    }
}

// -------------------------------
// GAME LOOP
// -------------------------------
function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if (player && !isInCar) {
        player.update(delta);
        followPlayerCamera();
    }

    if (car && isInCar) {
        car.update(delta);
        followCarCamera();
    }

    renderer.render(scene, camera);
}

// -------------------------------
// CAMERA FOLLOW
// -------------------------------
function followPlayerCamera() {
    const offset = new THREE.Vector3(0, 4, 8);
    const target = player.mesh.position.clone().add(offset);
    camera.position.lerp(target, 0.1);
    camera.lookAt(player.mesh.position);
}

function followCarCamera() {
    const offset = new THREE.Vector3(0, 6, 12);
    const target = car.mesh.position.clone().add(offset);
    camera.position.lerp(target, 0.1);
    camera.lookAt(car.mesh.position);
}
