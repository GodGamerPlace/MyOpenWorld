// ===============================
// MAIN GAME CONTROLLER
// ===============================

let scene, camera, renderer, clock;
let playerObj, carObj, worldObj;
let isInCar = false;

// Expose startGame globally for Play button
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
    worldObj = createWorld(scene);
}

function initPlayer() {
    playerObj = createPlayer(scene, camera);
}

function initCar() {
    carObj = createCar(scene);
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
    if (!playerObj || !carObj || !carObj.mesh.visible) return;

    const distance = playerObj.mesh.position.distanceTo(carObj.mesh.position);

    if (!isInCar && distance < 3) {
        isInCar = true;
        playerObj.mesh.visible = false;
        carObj.isActive = true;
    } else if (isInCar) {
        isInCar = false;
        playerObj.mesh.visible = true;
        playerObj.mesh.position.copy(carObj.mesh.position);
        playerObj.mesh.position.x += 2;
        carObj.isActive = false;
    }
}

// -------------------------------
// GAME LOOP
// -------------------------------
function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if (playerObj && !isInCar) {
        playerObj.update(delta);
    }

    if (carObj && isInCar) {
        carObj.update(delta);
    }

    updateCamera();

    renderer.render(scene, camera);
}

// -------------------------------
// CAMERA FOLLOW
// -------------------------------
function updateCamera() {
    if (isInCar && carObj) {
        const offset = new THREE.Vector3(0, 6, 12);
        const target = carObj.mesh.position.clone().add(offset);
        camera.position.lerp(target, 0.1);
        camera.lookAt(carObj.mesh.position);
    } else if (playerObj) {
        const offset = new THREE.Vector3(0, 4, 8);
        const target = playerObj.mesh.position.clone().add(offset);
        camera.position.lerp(target, 0.1);
        camera.lookAt(playerObj.mesh.position);
    }
}
