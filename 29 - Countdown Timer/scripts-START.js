const clock = document.querySelector(".display__time-left");
const endClock = document.querySelector(".display__end-time");
const buttons = document.querySelectorAll("[data-time]");
let timerInterval;

function timer(seconds) {
  // Clears timers before launching a new one
  clearInterval(timerInterval);
  const now = Date.now();
  const then = now + seconds * 1000;
  // Calls the function to display when to get back
  displayEndTime(then);
  // Displays the remaining time immediatly and not after one second
  displayTimeLeft(seconds);
  timerInterval = setInterval(() => {
    // Substract one second every second
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    // When reaching 0, clears the interval
    if (secondsLeft <= 0) clearInterval(interval);
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  const display = `${minutes}:${
    remainderSeconds < 10 ? "0" : ""
  }${remainderSeconds}`;
  clock.textContent = display;
  document.title = display;
}

function displayEndTime(timeStamp) {
  const end = new Date(timeStamp);
  const hour = end.getHours();
  const minutes = end.getMinutes();
  // Works for european clocks
  endClock.textContent = `Your work awaits you at ${hour}:${
    minutes < 10 ? "0" : ""
  }${minutes}`;
  // For the people that uses 12h clocks
  // endClock.textContent = `Your work awaits you at ${
  //   hour > 12 ? hour - 12 : hour
  // }:${minutes}`;
}

function startTimer() {
  const seconds = parseInt(this.dataset.time);
  timer(seconds);
}
buttons.forEach((button) => button.addEventListener("click", startTimer));
document.customForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const mins = this.minutes.value * 60;
  timer(mins);
  this.reset();
});
