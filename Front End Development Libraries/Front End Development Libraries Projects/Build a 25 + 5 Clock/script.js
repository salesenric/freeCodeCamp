let breakLength = 5; // Default break length in minutes
let sessionLength = 25; // Default session length in minutes
let timeLeft = sessionLength * 60; // Time left in seconds (default to sessionLength)
let isRunning = false;
let isBreak = false;
let timerInterval;
const beep = document.getElementById('beep');

// Function to format time in mm:ss
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Format with leading zeroes if needed
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

// Update the time-left display
function updateTimeLeft() {
  document.getElementById("time-left").textContent = formatTime(timeLeft);
}

// Reset the clock to the default session length
function resetClock() {
  clearInterval(timerInterval);
  isRunning = false;
  isBreak = false;
  breakLength = 5;
  sessionLength = 25;
  timeLeft = sessionLength * 60; // Reset timeLeft to default session length in seconds
  updateTimeLeft();
  
  // Reset audio
  beep.pause();
  beep.currentTime = 0;  // Rewind the audio to the beginning
  
  document.getElementById("break-length").textContent = breakLength;
  document.getElementById("session-length").textContent = sessionLength;
  document.getElementById("timer-label").textContent = isBreak ? "Break" : "Session";
}

// Start or pause the timer
function toggleTimer() {
  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
  } else {
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimeLeft();
      } else {
        beep.play();
        isBreak=!isBreak;
        document.getElementById("timer-label").textContent = isBreak ? "Break" : "Session";
        timeLeft= 60 * (isBreak ? breakLength : sessionLength);
        updateTimeLeft();
      }
    }, 1000);
    isRunning = true;
  }
}

// Decrease session length and update time-left display
document
  .getElementById("session-decrement")
  .addEventListener("click", function () {
    if (sessionLength > 1) {
      sessionLength--;
      timeLeft = sessionLength * 60;
      document.getElementById("session-length").textContent = sessionLength;
      updateTimeLeft();
    }
  });

// Increase session length and update time-left display
document
  .getElementById("session-increment")
  .addEventListener("click", function () {
    if (sessionLength < 60) {
      sessionLength++;
      timeLeft = sessionLength * 60;
      document.getElementById("session-length").textContent = sessionLength;
      updateTimeLeft();
    }
  });

// Decrease break length and update time-left display
document
  .getElementById("break-decrement")
  .addEventListener("click", function () {
    if (breakLength > 1) {
      breakLength--;
      document.getElementById("break-length").textContent = breakLength;
    }
  });

// Increase break length and update time-left display
document
  .getElementById("break-increment")
  .addEventListener("click", function () {
    if (breakLength < 60) {
      breakLength++;
      document.getElementById("break-length").textContent = breakLength;
    }
  });

// Add functionality for resetting
document.getElementById("reset").addEventListener("click", resetClock);

// Start/pause functionality
document.getElementById("start_stop").addEventListener("click", toggleTimer);

// Initialize time-left on load
updateTimeLeft();
