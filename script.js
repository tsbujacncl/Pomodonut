// Timer variables
let timer;
let startTime;
let timeLeft;
let isRunning = false;
let isBreakMode = false;

// DOM Elements
const timerText = document.getElementById("timer-text");
const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const donutCircle = document.querySelector(".donut-svg circle");
const timerImage = document.getElementById("timer-image");

// Input fields for time adjustments
const pomodoroMinutesInput = document.getElementById("pomodoro-minutes");
const pomodoroSecondsInput = document.getElementById("pomodoro-seconds");
const breakMinutesInput = document.getElementById("break-minutes");
const breakSecondsInput = document.getElementById("break-seconds");

// Constants for circular wipe animation
const radius = 140;
const circumference = 2 * Math.PI * radius;
donutCircle.style.strokeDasharray = circumference;

// Function to get user-defined Pomodoro time in milliseconds
function getPomodoroTime() {
    let minutes = parseInt(pomodoroMinutesInput.value) || 0;
    let seconds = parseInt(pomodoroSecondsInput.value) || 0;
    return (minutes * 60 + seconds) * 1000; // Convert to milliseconds
}

// Function to get user-defined Break time in milliseconds
function getBreakTime() {
    let minutes = parseInt(breakMinutesInput.value) || 0;
    let seconds = parseInt(breakSecondsInput.value) || 0;
    return (minutes * 60 + seconds) * 1000; // Convert to milliseconds
}

// Function to update the image and rotate coffee mug
function updateTimerImage() {
    if (isBreakMode) {
        timerImage.setAttribute("href", "assets/coffee-mug.png");
        timerImage.style.transform = "rotate(180deg)"; // Rotate 180 degrees to the right
        donutCircle.style.stroke = "none"; // Hide wipe effect during break
    } else {
        timerImage.setAttribute("href", "assets/donut.png");
        timerImage.style.transform = "rotate(0deg)"; // Keep donut upright
        donutCircle.style.stroke = "#f8e5c0"; // Restore wipe effect for Pomodoro
        donutCircle.style.strokeDashoffset = circumference; // Reset wipe effect
    }

    // Force refresh of the image
    let tempSrc = timerImage.getAttribute("href");
    timerImage.setAttribute("href", "");
    setTimeout(() => timerImage.setAttribute("href", tempSrc), 50);
}

// Function to smoothly update the wipe effect (only in Pomodoro mode)
function updateDonutWipe() {
    if (!isRunning || isBreakMode) return; // Stop updating if paused or in break mode

    let elapsedTime = Date.now() - startTime;
    let totalDuration = getPomodoroTime();
    let progress = Math.min(elapsedTime / totalDuration, 1);
    let offset = circumference * (1 - progress);

    donutCircle.style.strokeDashoffset = offset;

    if (progress < 1) {
        requestAnimationFrame(updateDonutWipe);
    } else {
        isRunning = false;
        startButton.textContent = "Start";
    }
}

// Function to start/reset timer based on user inputs
function initializeTimer() {
    let pomodoroTime = getPomodoroTime();
    let breakTime = getBreakTime();
    timeLeft = isBreakMode ? breakTime : pomodoroTime;
    startTime = Date.now();
    updateTimerDisplay(timeLeft);
    updateTimerImage();
}

// Start/Pause timer function
function toggleTimer() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        startButton.textContent = "Start";
    } else {
        startTime = Date.now() - (getPomodoroTime() - timeLeft);
        isRunning = true;
        requestAnimationFrame(updateDonutWipe);

        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft -= 1000;
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
}

// Function to update the timer display
function updateTimerDisplay(time) {
    let minutes = Math.floor(time / 60000);
    let seconds = Math.floor((time % 60000) / 1000);
    timerText.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// Reset timer function
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isBreakMode = false;
    initializeTimer();
    startButton.textContent = "Start";
}

// Switch to break mode
function switchToBreak() {
    isBreakMode = true;
    initializeTimer();
    toggleTimer();
}

// Switch back to pomodoro mode
function switchToPomodoro() {
    isBreakMode = false;
    initializeTimer();
    toggleTimer();
}

// Event listeners
startButton.addEventListener("click", toggleTimer);
resetButton.addEventListener("click", resetTimer);
pomodoroMinutesInput.addEventListener("change", initializeTimer);
pomodoroSecondsInput.addEventListener("change", initializeTimer);
breakMinutesInput.addEventListener("change", initializeTimer);
breakSecondsInput.addEventListener("change", initializeTimer);

// Initialize timer display on page load
initializeTimer();

