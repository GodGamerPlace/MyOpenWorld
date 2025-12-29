// ===============================
// CAR SYSTEM + SECRET SPAWN CODE
// ===============================

function createCar(scene) {

    // -------------------------------
    // CAR MESH
    // -------------------------------
    const carGeo = new THREE.BoxGeometry(2, 1, 4);
    const carMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(carGeo, carMat);

    mesh.visible = false;
    scene.add(mesh);

    // -------------------------------
    // STATE
    // -------------------------------
    let isActive = false;
    let speed = 0;
    let rotation = 0;

    // -------------------------------
    // RANDOM SPAWN POSITIONS
    // -------------------------------
    const spawnPoints = [];
    for (let i = 0; i < 20; i++) {
        spawnPoints.push({
            x: (Math.random() - 0.5) * 160,
            z: (Math.random() - 0.5) * 160
        });
    }

    function spawnCar() {
        const p = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
        mesh.position.set(p.x, 0.5, p.z);
        mesh.visible = true;
        isActive = false;
        speed = 0;
        rotation = 0;
        console.log("🚗 Car Spawned");
    }

    // -------------------------------
    // SECRET CODE SYSTEM
    // -------------------------------
    const secretCode = ["J","J","J","C","C","J","J"];
    let inputBuffer = [];

    function registerInput(type) {
        inputBuffer.push(type);
        if (inputBuffer.length > secretCode.length) {
            inputBuffer.shift();
        }

        if (inputBuffer.join("") === secretCode.join("")) {
            spawnCar();
            inputBuffer = [];
        }
    }

    // -------------------------------
    // PC INPUT
    // -------------------------------
    window.addEventListener("keydown", (e) => {
        if (e.code === "Space") registerInput("J");
        if (e.key.toLowerCase() === "c") registerInput("C");
    });

    // -------------------------------
    // MOBILE INPUT UI
    // -------------------------------
    const isTouchDevice =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0;

    if (isTouchDevice) {

        function createButton(text, right, bottom, onPress) {
            const btn = document.createElement("div");
            btn.innerText = text;
            btn.style.position = "fixed";
            btn.style.right = right;
            btn.style.bottom = bottom;
            btn.style.width = "70px";
            btn.style.height = "70px";
            btn.style.borderRadius = "50%";
            btn.style.background = "rgba(255,255,255,0.25)";
            btn.style.color = "#fff";
            btn.style.display = "flex";
            btn.style.alignItems = "center";
            btn.style.justifyContent = "center";
            btn.style.fontSize = "14px";
            btn.style.zIndex = "1000";

            btn.addEventListener("touchstart", (e) => {
                e.preventDefault();
                onPress();
            }, { passive: false });

            document.body.appendChild(btn);
        }

        createButton("JUMP", "20px", "110px", () => registerInput("J"));
        createButton("CROUCH", "100px", "20px", () => registerInput("C"));
    }

    // -------------------------------
    // CAR DRIVING (WHEN ACTIVE)
    // -------------------------------
    function update(delta) {
        if (!isActive || !mesh.visible) return;

        mesh.position.x += Math.sin(rotation) * speed * delta;
        mesh.position.z += Math.cos(rotation) * speed * delta;

        speed *= 0.98;
    }

    // -------------------------------
    // RETURN CAR
    // -------------------------------
    return {
        mesh,
        isActive,
        update
    };
}
