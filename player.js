// ===============================
// PLAYER CONTROLLER (PC + MOBILE)
// ===============================

function createPlayer(scene, camera) {

    // -------------------------------
    // PLAYER MESH
    // -------------------------------
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 1, 0);
    scene.add(mesh);

    // -------------------------------
    // DEVICE DETECTION
    // -------------------------------
    const isTouchDevice =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0;

    // -------------------------------
    // MOVEMENT STATE
    // -------------------------------
    let moveX = 0;
    let moveZ = 0;
    const speed = 6;
    let rotationY = 0;

    // ===============================
    // PC CONTROLS (KEYBOARD)
    // ===============================
    if (!isTouchDevice) {
        const keys = { w: false, a: false, s: false, d: false };

        window.addEventListener("keydown", (e) => {
            if (e.key === "w") keys.w = true;
            if (e.key === "a") keys.a = true;
            if (e.key === "s") keys.s = true;
            if (e.key === "d") keys.d = true;
        });

        window.addEventListener("keyup", (e) => {
            if (e.key === "w") keys.w = false;
            if (e.key === "a") keys.a = false;
            if (e.key === "s") keys.s = false;
            if (e.key === "d") keys.d = false;
        });

        setInterval(() => {
            moveX = 0;
            moveZ = 0;
            if (keys.w) moveZ -= 1;
            if (keys.s) moveZ += 1;
            if (keys.a) moveX -= 1;
            if (keys.d) moveX += 1;
        }, 16);
    }

    // ===============================
    // MOBILE CONTROLS (JOYSTICK)
    // ===============================
    if (isTouchDevice) {

        // Joystick UI
        const joystick = document.createElement("div");
        joystick.style.position = "fixed";
        joystick.style.left = "20px";
        joystick.style.bottom = "20px";
        joystick.style.width = "120px";
        joystick.style.height = "120px";
        joystick.style.borderRadius = "50%";
        joystick.style.background = "rgba(255,255,255,0.2)";
        joystick.style.zIndex = "1000";

        const stick = document.createElement("div");
        stick.style.position = "absolute";
        stick.style.left = "40px";
        stick.style.top = "40px";
        stick.style.width = "40px";
        stick.style.height = "40px";
        stick.style.borderRadius = "50%";
        stick.style.background = "rgba(255,255,255,0.6)";

        joystick.appendChild(stick);
        document.body.appendChild(joystick);

        let startX = 0, startY = 0;

        joystick.addEventListener("touchstart", (e) => {
            const t = e.touches[0];
            startX = t.clientX;
            startY = t.clientY;
        });

        joystick.addEventListener("touchmove", (e) => {
            e.preventDefault();
            const t = e.touches[0];
            const dx = t.clientX - startX;
            const dy = t.clientY - startY;

            const max = 40;
            const clampedX = Math.max(-max, Math.min(max, dx));
            const clampedY = Math.max(-max, Math.min(max, dy));

            stick.style.transform =
                `translate(${clampedX}px, ${clampedY}px)`;

            moveX = clampedX / max;
            moveZ = clampedY / max;
        }, { passive: false });

        joystick.addEventListener("touchend", () => {
            stick.style.transform = "translate(0,0)";
            moveX = 0;
            moveZ = 0;
        });
    }

    // ===============================
    // UPDATE LOOP
    // ===============================
    function update(delta) {

        if (moveX !== 0 || moveZ !== 0) {
            rotationY = Math.atan2(moveX, moveZ);
            mesh.rotation.y = rotationY;
        }

        const dirX = Math.sin(rotationY);
        const dirZ = Math.cos(rotationY);

        mesh.position.x += dirX * speed * delta * moveZ;
        mesh.position.z += dirZ * speed * delta * moveZ;

        mesh.position.x += Math.cos(rotationY) * speed * delta * moveX * 0.6;
        mesh.position.z -= Math.sin(rotationY) * speed * delta * moveX * 0.6;

        // Ground lock
        mesh.position.y = 1;
    }

    // ===============================
    // RETURN PLAYER
    // ===============================
    return {
        mesh,
        update
    };
}
