const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((localMediaStream) => {
      console.log(localMediaStream);

      // DEPRECATED
      // video.src = window.URL.createObjectURL(localMediaStream)

      // New Syntax
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}

// Adjust the canvas size to the webcam video stream and put that stream into the canvas
function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);

    // get the pixels
      let pixels = ctx.getImageData(0, 0, width, height);

    // Red Effect
      // pixels = redEffect(pixels);

    // Stroboscopic effect with opacity of old frames
      pixels = rgbSplit(pixels);
      ctx.globalAlpha = 0.1;

    // Green screen
      //pixels = greenScreen(pixels)

    // Put the pixels back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  snap.currentTime = 0;
  snap.play();

  // Defines the format of the image
  const data = canvas.toDataURL("image/png");
  //Creating a clickable link for download
  const link = document.createElement("a");
  link.href = data;
  // Making it downloadable
  link.setAttribute("download", "test");
  link.textContent = "Download your face";
  link.innerHTML = `<img src="${data}" alt="You"/>`;
  // Insert it below the canvas
  strip.insertBefore(link, strip.firstChild);
}

// Red overlay
function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }
  return pixels;
}

// RGB split
function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 200] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 350] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

// Green screen effect
function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll(".rgb input").forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}
// Get the video stream from the webcam
getVideo();
// When the stream is ready, execute the paintToCanvas function
video.addEventListener("canplay", paintToCanvas);
