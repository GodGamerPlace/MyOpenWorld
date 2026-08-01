// A quick popup to confirm the file is successfully loaded
alert("Camera script loaded successfully!");

const videoElement = document.querySelector("#camera-stream");

// Request permission and start the camera stream
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      videoElement.srcObject = stream;
    })
    .catch((error) => {
      console.error("Camera access error:", error);
      alert("Could not access camera. Make sure you grant permission!");
    });
} else {
  alert("Your browser does not support camera access.");
}
document.getElementById('modal-ok-btn').addEventListener('click', () => {
  const modal = document.getElementById('camera-modal');
  const videoElement = document.querySelector("#camera-stream");

  // 1. Request the camera feed immediately upon user interaction
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoElement.srcObject = stream;
        
        // 2. Remove the UI overlay completely once access is successful
        modal.remove();
      })
      .catch((error) => {
        console.error("Camera access denied:", error);
        alert("Camera access is required to proceed. Please refresh and allow access.");
      });
  } else {
    alert("Your browser does not support camera features.");
    modal.remove();
  }
});
document.getElementById('modal-ok-btn').addEventListener('click', () => {
  const modal = document.getElementById('camera-modal');
  const videoElement = document.querySelector("#camera-stream");

  // 1. IMMEDIATELY remove the dark overlay UI from the screen
  if (modal) {
    modal.remove();
  }

  // 2. Request the camera stream in the background
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoElement.srcObject = stream;
      })
      .catch((error) => {
        console.error("Camera access error or blocked by settings:", error);
        // We log the error to the console instead of a breaking alert, 
        // allowing the player to still see the game grid behind it.
      });
  }
});
