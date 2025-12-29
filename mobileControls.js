// ===============================
// MOBILE JOYSTICK & BUTTONS
// ===============================

function setupMobileControls() {
    if (!("ontouchstart" in window)) return; // Only show on touch devices

    // Create joystick container
    const joystickContainer = document.createElement("div");
    joystickContainer.id = "joystickContainer";
    joystickContainer.style.position = "fixed";
    joystickContainer.style.left = "20px";
    joystickContainer.style.bottom = "20px";
    joystickContainer.style.width = "120px";
    joystickContainer.style.height = "120px";
    joystickContainer.style.borderRadius = "50%";
    joystickContainer.style.background = "rgba(0,0,0,0.3)";
    joystickContainer.style.zIndex = "999";
    document.body.appendChild(joystickContainer);

    // Joystick knob
    const knob = document.createElement("div");
    knob.id = "joystickKnob";
    knob.style.width = "60px";
    knob.style.height = "60px";
    knob.style.background = "rgba(0,255,0,0.7)";
    knob.style.borderRadius = "50%";
    knob.style.position = "absolute";
    knob.style.left = "30px";
    knob.style.top = "30px";
    joystickContainer.appendChild(knob);

    let joystickActive = false;
    let startX, startY;

    joystickContainer.addEventListener("touchstart", (e) => {
        joystickActive = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    joystickContainer.addEventListener("touchmove", (e) => {
        if (!joystickActive) return;
        const touch = e.touches[0];
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;

        knob.style.transform = `translate(${dx}px, ${dy}px)`;

        // Update player keys
        keys.forward = dy < -10;
        keys.backward = dy > 10;
        keys.left = dx < -10;
        keys.right = dx > 10;
    });

    joystickContainer.addEventListener("touchend", () => {
        joystickActive = false;
        knob.style.transform = "translate(0px,0px)";
        keys.forward = keys.backward = keys.left = keys.right = false;
    });

    // -------------------------------
    // Jump Button
    const jumpBtn = document.createElement("button");
    jumpBtn.innerText = "Jump";
    jumpBtn.style.position = "fixed";
    jumpBtn.style.right = "20px";
    jumpBtn.style.bottom = "100px";
    jumpBtn.style.width = "80px";
    jumpBtn.style.height = "60px";
    jumpBtn.style.fontSize = "16px";
    jumpBtn.style.background = "#00ff00";
    jumpBtn.style.color = "#000";
    jumpBtn.style.border = "none";
    jumpBtn.style.borderRadius = "10px";
    jumpBtn.style.zIndex = "999";
    document.body.appendChild(jumpBtn);

    jumpBtn.addEventListener("touchstart", () => keys.jump = true);
    jumpBtn.addEventListener("touchend", () => keys.jump = false);

    // -------------------------------
    // Crouch Button
    const crouchBtn = document.createElement("button");
    crouchBtn.innerText = "Crouch";
    crouchBtn.style.position = "fixed";
    crouchBtn.style.right = "20px";
    crouchBtn.style.bottom = "40px";
    crouchBtn.style.width = "80px";
    crouchBtn.style.height = "60px";
    crouchBtn.style.fontSize = "16px";
    crouchBtn.style.background = "#00ff00";
    crouchBtn.style.color = "#000";
    crouchBtn.style.border = "none";
    crouchBtn.style.borderRadius = "10px";
    crouchBtn.style.zIndex = "999";
    document.body.appendChild(crouchBtn);

    crouchBtn.addEventListener("touchstart", () => keys.crouch = true);
    crouchBtn.addEventListener("touchend", () => keys.crouch = false);

    // -------------------------------
    // Enter/Exit Car Button
    const carBtn = document.createElement("button");
    carBtn.innerText = "Car";
    carBtn.style.position = "fixed";
    carBtn.style.right = "120px";
    carBtn.style.bottom = "70px";
    carBtn.style.width = "80px";
    carBtn.style.height = "60px";
    carBtn.style.fontSize = "16px";
    carBtn.style.background = "#ff0000";
    carBtn.style.color = "#fff";
    carBtn.style.border = "none";
    carBtn.style.borderRadius = "10px";
    carBtn.style.zIndex = "999";
    document.body.appendChild(carBtn);

    carBtn.addEventListener("touchstart", () => toggleCar());
}

// Call this after DOM loaded
window.addEventListener("DOMContentLoaded", setupMobileControls);
