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
