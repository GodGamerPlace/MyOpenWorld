// ===============================
// MAIN GAME CONTROLLER
// ===============================

let scene, camera, renderer, clock;
let player, car, world;
let isInCar = false;
let gameStarted = false;

// Called ONLY when Play button is clicked
function startGame() {
    if (gameStarted) return; // prevent double start
    gameStarted = true;

    initThree();
    initWorld();
    initPlayer();
    initCar();
    animate();
}

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
    renderer.setSize(w
