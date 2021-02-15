// TODO: Add a fullScreen button

// Query Selector Zone
const player = document.querySelector(".player");
const video = player.querySelector(".viewer");
const progress = player.querySelector(".progress");
const progressFilled = player.querySelector(".progress__filled");
const toggleButton = player.querySelector(".toggle");
const sliders = player.querySelectorAll(".player__slider");
const skips = player.querySelectorAll("[data-skip]");

// Functions Zone

function togglePlay() {
  // Ternary to toggle play and pause
  const play = video.paused ? "play" : "pause";
  // Calling of function depending on ternary result
  video[play]();
}

function updateButton() {
  const icon = this.paused ? "►" : "❚ ❚";
  toggleButton.textContent = icon;
}

function skip() {
  //Is getting the datasets from the pointing of the event listener
  video.currentTime += parseInt(this.dataset.skip);
}

function handleSlide() {
  video[this.name] = this.value;
}

function progressBar() {
  const percent = (video.currentTime / video.duration) * 100;
  progressFilled.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

// Event Listener Zone
video.addEventListener("click", togglePlay);
video.addEventListener("pause", updateButton);
video.addEventListener("play", updateButton);
video.addEventListener("timeupdate", progressBar);

toggleButton.addEventListener("click", togglePlay);

skips.forEach((skipEl) => {
  skipEl.addEventListener("click", skip);
});

sliders.forEach((slider) => slider.addEventListener("change", handleSlide));

progress.addEventListener("click", scrub);

// It checks for the flag first before running function scrub
progress.addEventListener("mousemove", (e) => userClicking && scrub(e));

// Toggling flag
let userClicking = false;
progress.addEventListener("mousedown", () => (userClicking = true));
progress.addEventListener("mouseup", () => (userClicking = false));
