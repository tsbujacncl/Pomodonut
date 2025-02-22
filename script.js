// Timer variables
let timer;
let pomodoroTime = 25 * 60; // 25 minutes in seconds
let breakTime = 5 * 60; // 5 minutes in seconds
let timeLeft = pomodoroTime;
let isRunning = false;
let isBreakMode = false;

// DOM Elements
const timerText = document.getElementById("timer-text");
const donutImage = document.getElementById("donut-image");
const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");

// Update timer display function
function updateTimerDisplay(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    timerText.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// Start/Pause timer function
function toggleTimer() {
    if (isRunning) {
        clearInterval(timer);
        startButton.textContent = "Start";
    } else {
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay(timeLeft);
            } else {
                clearInterval(timer);
                isRunning = false;
                startButton.textContent = "Start";
                isBreakMode ? switchToPomodoro() : switchToBreak();
            }
        }, 1000);
        startButton.textContent = "Pause";
    }
    isRunning = !isRunning;
}

// Reset timer function
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isBreakMode = false;
    timeLeft = pomodoroTime;
    resetDonutImage();
    updateTimerDisplay(timeLeft);
    startButton.textContent = "Start"; // Ensure button resets to "Start"
}

// Switch to break mode
function switchToBreak() {
    isBreakMode = true;
    timeLeft = breakTime;
    changeImage("assets/coffee-mug.jpg");
    updateTimerDisplay(timeLeft);
    toggleTimer();
}

// Switch back to pomodoro mode
function switchToPomodoro() {
    isBreakMode = false;
    timeLeft = pomodoroTime;
    resetDonutImage();
    updateTimerDisplay(timeLeft);
}

// Image handling functions
function changeImage(src) {
    donutImage.src = src;
}

function resetDonutImage() {
    donutImage.src = "assets/donut.png"; // Updated to use donut.png
}

// Event listeners
startButton.addEventListener("click", toggleTimer);
resetButton.addEventListener("click", resetTimer);

// Initialize timer display
updateTimerDisplay(timeLeft);