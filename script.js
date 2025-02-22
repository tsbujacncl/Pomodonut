// Timer State Variables
let timer;
let timeLeft;
let isRunning = false;
let isBreakMode = false;
let pomodorosLeft = 4;

// DOM Elements
const timerText = document.getElementById("timer-text");
const startButton = document.getElementById("start");
const skipButton = document.getElementById("skip");
const donutCircle = document.querySelector(".donut-svg circle");
const timerImage = document.getElementById("timer-image");

// Mode Switch Buttons
const pomodoroButton = document.getElementById("pomodoro-mode");
const breakButton = document.getElementById("break-mode");

// Settings Modal Elements
const settingsButton = document.getElementById("settings-button");
const settingsModal = document.getElementById("settings-modal");
const closeModal = document.querySelector(".close");
const saveSettingsButton = document.getElementById("save-settings");

// Settings Inputs
const pomodoroMinutesInput = document.getElementById("pomodoro-minutes");
const pomodoroSecondsInput = document.getElementById("pomodoro-seconds");
const breakMinutesInput = document.getElementById("break-minutes");
const breakSecondsInput = document.getElementById("break-seconds");
const autoStartBreaks = document.getElementById("auto-start-breaks");
const autoStartPomodoros = document.getElementById("auto-start-pomodoros");
const pomodorosLeftInput = document.getElementById("pomodoros-left");
const alarmSoundSelect = document.getElementById("alarm-sound");
const alarmVolume = document.getElementById("alarm-volume");

// Circular Animation Constants
const radius = 340;
const circumference = 2 * Math.PI * radius;
donutCircle.style.strokeDasharray = circumference;

// Load Saved Settings from Local Storage
function loadSettings() {
    pomodoroMinutesInput.value = localStorage.getItem("pomodoroMinutes") || 25;
    pomodoroSecondsInput.value = localStorage.getItem("pomodoroSeconds") || 0;
    breakMinutesInput.value = localStorage.getItem("breakMinutes") || 5;
    breakSecondsInput.value = localStorage.getItem("breakSeconds") || 0;
    autoStartBreaks.checked = localStorage.getItem("autoStartBreaks") === "true";
    autoStartPomodoros.checked = localStorage.getItem("autoStartPomodoros") === "true";
    pomodorosLeft = localStorage.getItem("pomodorosLeft") || 4;
    alarmSoundSelect.value = localStorage.getItem("alarmSound") || "beep";
    alarmVolume.value = localStorage.getItem("alarmVolume") || 50;
    pomodorosLeftInput.value = pomodorosLeft;
}

// Save Settings to Local Storage
function saveSettings() {
    localStorage.setItem("pomodoroMinutes", pomodoroMinutesInput.value);
    localStorage.setItem("pomodoroSeconds", pomodoroSecondsInput.value);
    localStorage.setItem("breakMinutes", breakMinutesInput.value);
    localStorage.setItem("breakSeconds", breakSecondsInput.value);
    localStorage.setItem("autoStartBreaks", autoStartBreaks.checked);
    localStorage.setItem("autoStartPomodoros", autoStartPomodoros.checked);
    localStorage.setItem("pomodorosLeft", pomodorosLeft);
    localStorage.setItem("alarmSound", alarmSoundSelect.value);
    localStorage.setItem("alarmVolume", alarmVolume.value);
}

// Get Timer Duration in Milliseconds
function getPomodoroTime() {
    return ((parseInt(pomodoroMinutesInput.value) || 0) * 60 + (parseInt(pomodoroSecondsInput.value) || 0)) * 1000;
}

function getBreakTime() {
    return ((parseInt(breakMinutesInput.value) || 0) * 60 + (parseInt(breakSecondsInput.value) || 0)) * 1000;
}

// Update Timer Display
function updateTimerDisplay(time) {
    let minutes = Math.floor(time / 60000);
    let seconds = Math.floor((time % 60000) / 1000);
    
    timerText.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    
    // Update circular wipe animation
    let totalTime = isBreakMode ? getBreakTime() : getPomodoroTime();
    let progress = time / totalTime; // Calculate progress (1 → 0)
    donutCircle.style.strokeDashoffset = circumference * progress;
}

// Update Timer Image Based on Mode
function updateTimerImage() {
    if (isBreakMode) {
        timerImage.setAttribute("href", "assets/coffee-mug.png");
        donutCircle.style.stroke = "none";
    } else {
        timerImage.setAttribute("href", "assets/donut.png");
        donutCircle.style.stroke = "#f8e5c0";
        donutCircle.style.strokeDashoffset = circumference;
    }
}

// Start/Pause Timer
function toggleTimer() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        startButton.textContent = "Start";
    } else {
        let totalTime = isBreakMode ? getBreakTime() : getPomodoroTime();
        let endTime = Date.now() + timeLeft;

        isRunning = true;
        startButton.textContent = "Pause";

        // Smooth animation: refresh every 10ms instead of 1000ms
        timer = setInterval(() => {
            let now = Date.now();
            timeLeft = Math.max(0, endTime - now); // Prevent negative values

            updateTimerDisplay(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(timer);
                isRunning = false;
                startButton.textContent = "Start";

                if (isBreakMode) {
                    pomodorosLeft--;
                    pomodorosLeftInput.value = pomodorosLeft;
                    if (autoStartPomodoros.checked) switchToPomodoro();
                } else {
                    if (autoStartBreaks.checked) switchToBreak();
                }
            }
        }, 10);
    }
}

// Skip to Next Mode (Pomodoro -> Break, Break -> Pomodoro)
function skipToNextMode() {
    clearInterval(timer);
    isRunning = false;

    if (isBreakMode) {
        switchToPomodoro();
    } else {
        switchToBreak();
    }
}

// Switch to Pomodoro Mode
function switchToPomodoro() {
    isBreakMode = false;
    timeLeft = getPomodoroTime();
    updateTimerDisplay(timeLeft);
    updateTimerImage();
    if (autoStartPomodoros.checked) toggleTimer();
}

// Switch to Break Mode
function switchToBreak() {
    isBreakMode = true;
    timeLeft = getBreakTime();
    updateTimerDisplay(timeLeft);
    updateTimerImage();
    if (autoStartBreaks.checked) toggleTimer();
}

// Handle Settings Modal Opening & Closing
settingsButton.addEventListener("click", () => {
    settingsModal.style.display = "flex";
});

function closeModalHandler(event) {
    if (event.target === settingsModal || event.target.classList.contains("close")) {
        settingsModal.style.display = "none";
    }
}

// Event Listeners for Modal Closing
closeModal.addEventListener("click", closeModalHandler);
settingsModal.addEventListener("click", closeModalHandler);
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        settingsModal.style.display = "none";
    }
});

// Save Settings Button
saveSettingsButton.addEventListener("click", () => {
    saveSettings();
    settingsModal.style.display = "none";
});

// Attach Event Listeners
startButton.addEventListener("click", toggleTimer);
skipButton.addEventListener("click", skipToNextMode);
pomodoroButton.addEventListener("click", switchToPomodoro);
breakButton.addEventListener("click", switchToBreak);
pomodoroMinutesInput.addEventListener("change", switchToPomodoro);
pomodoroSecondsInput.addEventListener("change", switchToPomodoro);
breakMinutesInput.addEventListener("change", switchToBreak);
breakSecondsInput.addEventListener("change", switchToBreak);

// Initialize Timer on Page Load
document.addEventListener("DOMContentLoaded", () => {
    loadSettings();
    switchToPomodoro();
});

// Switch to Break Mode
function switchToBreak() {
    isBreakMode = true;
    timeLeft = getBreakTime();
    updateTimerDisplay(timeLeft);
    updateTimerImage();
    
    document.body.classList.add("break-mode"); // Apply light blue to background
    document.querySelector(".container").classList.add("break-mode"); // Apply lighter blue to container

    if (autoStartBreaks.checked) toggleTimer();
}

// Switch to Pomodoro Mode
function switchToPomodoro() {
    isBreakMode = false;
    timeLeft = getPomodoroTime();
    updateTimerDisplay(timeLeft);
    updateTimerImage();

    document.body.classList.remove("break-mode"); // Revert background
    document.querySelector(".container").classList.remove("break-mode"); // Revert container

    if (autoStartPomodoros.checked) toggleTimer();
}