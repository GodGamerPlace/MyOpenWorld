// ===============================
// GTA-STYLE 3D CAR
// ===============================

let car = null;
let isCarActive = false;

// Secret code tracking
let secretCode = [];
const secretSequence = ["jump","jump","jump","crouch","crouch","jump","jump"];
const secretTimeout = 3000; // 3 seconds
let lastInputTime = 0;

function createCar(scene) {
    // Car body
    const bodyGeo = new THREE.BoxGeometry(2, 0.7, 4);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    body.receiveShadow = true;

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x333333 });

    const wheels = [];
    for (let i = 0; i < 4; i++) {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.castShadow = true;
        wheel.receiveShadow = true;
        wheels.push(wheel);
        scene.add(wheel);
    }

    // Position wheels relative to body
    wheels[0].position.set(-0.9, 0.15, -1.5);
    wheels[1].position.set(0.9, 0.15, -1.5);
    wheels[2].position.set(-0.9, 0.15, 1.5);
    wheels[3].position.set(0.9, 0.15, 1.5);

    body.position.set(5, 0.35, 5);
    scene.add(body);

    car = {
        mesh: body,
        wheels: wheels,
        isActive: false,
        speed: 0,
        update: updateCar
    };

    setupCarControls();
    return car;
}

// -------------------------------
// CAR CONTROLS
// -------------------------------
function setupCarControls() {
    window.addEventListener("keydown", (e) => {
        const now = Date.now();
        if (now - lastInputTime > secretTimeout) secretCode = [];
        lastInputTime = now;

        if (e.key.toLowerCase() === " ") secretCode.push("jump");
        if (e.key.toLowerCase() === "c") secretCode.push("crouch");
        checkSecretCode();

        if (car.isActive) {
            switch (e.key.toLowerCase()) {
                case "w": car.speed = 10; break;
                case "s": car.speed = -5; break;
            }
        }
    });

    window.addEventListener("keyup", (e) => {
        if (car.isActive && (e.key.toLowerCase() === "w" || e.key.toLowerCase() === "s")) {
            car.speed = 0;
        }
    });

    // Mobile input placeholder
}

// -------------------------------
// CHECK SECRET CODE
// -------------------------------
function checkSecretCode() {
    if (secretCode.length > secretSequence.length) secretCode.shift();
    if (secretCode.join(",") === secretSequence.join(",")) {
        spawnCarAtPlayer();
        secretCode = [];
    }
}

// -------------------------------
// SPAWN CAR
// -------------------------------
function spawnCarAtPlayer() {
    if (!player) return;
    car.mesh.position.copy(player.mesh.position);
    car.mesh.position.x += 2;
    car.mesh.position.y = 0.35;
    car.mesh.visible = true;

    // Update wheels position relative to body
    const w = car.wheels;
    w[0].position.set(car.mesh.position.x -0.9, 0.15, car.mesh.position.z -1.5);
    w[1].position.set(car.mesh.position.x +0.9, 0.15, car.mesh.position.z -1.5);
    w[2].position.set(car.mesh.position.x -0.9, 0.15, car.mesh.position.z +1.5);
    w[3].position.set(car.mesh.position.x +0.9, 0.15, car.mesh.position.z +1.5);

    console.log("Car spawned!");
}

// -------------------------------
// UPDATE CAR LOOP
// -------------------------------
function updateCar(delta) {
    if (!car.isActive) return;

    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(car.mesh.quaternion);
    car.mesh.position.add(forward.multiplyScalar(car.speed * delta));

    // Update wheels position relative to body
    const w = car.wheels;
    w[0].position.set(car.mesh.position.x -0.9, 0.15, car.mesh.position.z -1.5);
    w[1].position.set(car.mesh.position.x +0.9, 0.15, car.mesh.position.z -1.5);
    w[2].position.set(car.mesh.position.x -0.9, 0.15, car.mesh.position.z +1.5);
    w[3].position.set(car.mesh.position.x +0.9, 0.15, car.mesh.position.z +1.5);
}
