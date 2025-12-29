// ===============================
// GTA-STYLE 3D PLAYER
// ===============================

let player = null;
let moveSpeed = 5;
let runSpeed = 8;
let jumpSpeed = 8;
let gravity = 20;
let isJumping = false;
let isCrouching = false;
let velocityY = 0;

// Create player capsule
function createPlayer(scene, camera) {
    // Capsule geometry for humanoid
    const geometry = new THREE.CapsuleGeometry(0.5, 1.5, 4, 8);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 1.5, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    player = {
        mesh: mesh,
        camera: camera,
        velocity: new THREE.Vector3(),
        update: updatePlayer
    };

    setupControls();
    return player;
}

// -------------------------------
// CONTROLS
// -------------------------------
const keys = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    crouch: false
};

function setupControls() {
    // PC
    window.addEventListener("keydown", (e) => {
        switch (e.key.toLowerCase()) {
            case "w": keys.forward = true; break;
            case "s": keys.backward = true; break;
            case "a": keys.left = true; break;
            case "d": keys.right = true; break;
            case " ": keys.jump = true; break;
            case "c": keys.crouch = true; break;
        }
    });

    window.addEventListener("keyup", (e) => {
        switch (e.key.toLowerCase()) {
            case "w": keys.forward = false; break;
            case "s": keys.backward = false; break;
            case "a": keys.left = false; break;
            case "d": keys.right = false; break;
            case " ": keys.jump = false; break;
            case "c": keys.crouch = false; break;
        }
    });

    // Mobile joystick placeholder (update keys.forward/backward/left/right)
}

// -------------------------------
// UPDATE PLAYER
// -------------------------------
function updatePlayer(delta) {
    let speed = moveSpeed;

    // Direction vector
    const direction = new THREE.Vector3();
    if (keys.forward) direction.z -= 1;
    if (keys.backward) direction.z += 1;
    if (keys.left) direction.x -= 1;
    if (keys.right) direction.x += 1;
    direction.normalize();

    // Move
    player.mesh.position.x += direction.x * speed * delta;
    player.mesh.position.z += direction.z * speed * delta;

    // Jump
    if (keys.jump && !isJumping) {
        velocityY = jumpSpeed;
        isJumping = true;
    }

    // Crouch
    if (keys.crouch && !isCrouching) {
        isCrouching = true;
        player.mesh.scale.y = 0.6;
        player.mesh.position.y -= 0.5;
    } else if (!keys.crouch && isCrouching) {
        isCrouching = false;
        player.mesh.scale.y = 1;
        player.mesh.position.y += 0.5;
    }

    // Gravity
    if (isJumping) {
        velocityY -= gravity * delta;
        player.mesh.position.y += velocityY * delta;
        if (player.mesh.position.y <= 1.5) {
            player.mesh.position.y = 1.5;
            isJumping = false;
            velocityY = 0;
        }
    }

    // Camera follow
    const offset = new THREE.Vector3(0, 4, 8);
    const target = player.mesh.position.clone().add(offset);
    player.camera.position.lerp(target, 0.1);
    player.camera.lookAt(player.mesh.position);
}
