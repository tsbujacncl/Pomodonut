// Sound Effects
const playSound = new Audio("assets/sounds/play.mp3");
const pauseSound = new Audio("assets/sounds/pause.mp3");
const alarmSound = new Audio("assets/sounds/alarm.mp3");

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
const coffeeMugImage = document.getElementById("coffee-mug-image");
const donutSvg = document.querySelector(".donut-svg");
const breakProgressBar = document.getElementById("break-progress-bar");
const steamGif = document.getElementById("steam-gif");

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
function updateTimerDisplay(displayTime, animationTime = displayTime) {
    let minutes = Math.floor(displayTime / 60000);
    let seconds = Math.floor((displayTime % 60000) / 1000);
    let timeString = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    let modeLabel = isBreakMode ? "Coffee Break" : "Donut Time";
    
    // Update the center timer display (just time)
    timerText.textContent = timeString;
    
    // Update the browser tab title with time and mode
    document.title = `${timeString} - ${modeLabel}`;
    
    // Use animation time for progress calculations so animations start immediately
    if (!isBreakMode) {
        let totalTime = getPomodoroTime();
        let progress = animationTime / totalTime; // Calculate progress (1 → 0)
        donutCircle.style.strokeDashoffset = circumference * progress;
    } else {
        // Update break progress bar height based on remaining time
        let totalTime = getBreakTime();
        let progress = animationTime / totalTime; // Calculate progress (1 → 0)
        let maxHeight = 354; // Maximum height in pixels
        let heightPixels = Math.max(0, progress * maxHeight); // Convert to pixels
        breakProgressBar.style.height = `${heightPixels}px`;
        
        // Update steam opacity based on remaining time (fade from 0.9-0.8 to 0.2 at the end)
        if (steamGif.style.display !== "none") {
            let maxStartOpacity = 0.9; // Starting max opacity
            let minStartOpacity = 0.8; // Starting min opacity
            let endOpacity = 0.2; // Ending opacity
            
            // Calculate current max and min opacities based on progress
            let currentMaxOpacity = endOpacity + (progress * (maxStartOpacity - endOpacity));
            let currentMinOpacity = endOpacity + (progress * (minStartOpacity - endOpacity));
            
            // Update CSS custom properties to control the animation opacity range
            document.documentElement.style.setProperty('--steam-max-opacity', currentMaxOpacity);
            document.documentElement.style.setProperty('--steam-min-opacity', currentMinOpacity);
            
            // Apply the current max opacity directly to the element
            steamGif.style.opacity = currentMaxOpacity;
        }
    }
}

// Update Timer Image Based on Mode
function updateTimerImage() {
    if (isBreakMode) {
        // Hide the circular SVG and show separate coffee mug image and progress bar
        donutSvg.style.display = "none";
        coffeeMugImage.style.display = "block";
        breakProgressBar.style.display = "block";
        steamGif.style.display = "block";
        // Reset steam opacity to initial values when starting break
        steamGif.style.opacity = 0.9;
        document.documentElement.style.setProperty('--steam-max-opacity', 0.9);
        document.documentElement.style.setProperty('--steam-min-opacity', 0.8);
        // Initialize progress bar to full height
        breakProgressBar.style.height = "354px";
    } else {
        // Show the circular SVG and hide coffee mug image and progress bar
        donutSvg.style.display = "block";
        coffeeMugImage.style.display = "none";
        breakProgressBar.style.display = "none";
        steamGif.style.display = "none";
        timerImage.setAttribute("href", "assets/donut.png");
        donutCircle.style.stroke = "#f8e5c0";
        donutCircle.style.strokeDashoffset = circumference;
    }
}

function toggleTimer() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        startButton.textContent = "Start";

        // Play Pause Sound
        pauseSound.currentTime = 0; // Reset sound position
        pauseSound.play();
    } else {
        let totalTime = isBreakMode ? getBreakTime() : getPomodoroTime();

        isRunning = true;
        startButton.textContent = "Pause";

        // Play Start Sound
        playSound.currentTime = 0;
        playSound.play();

        // Start animations immediately, but delay countdown display by 1 second
        let startTime = Date.now();
        let realEndTime = startTime + timeLeft; // Real timer for animations
        let originalTimeLeft = timeLeft; // Store original time for display

        timer = setInterval(() => {
            let now = Date.now();
            let realTimeLeft = Math.max(0, realEndTime - now); // For animations
            let elapsedTime = now - startTime;
            
            // Display time: show original time for first 1000ms, then countdown from that point
            let displayTimeLeft;
            if (elapsedTime < 1000) {
                displayTimeLeft = originalTimeLeft; // Stay on original time for first second
            } else {
                // After first second, countdown from original time minus elapsed time since the delay
                displayTimeLeft = Math.max(0, originalTimeLeft - (elapsedTime - 1000));
            }
            
            // Stop display at 0:01, but keep animations running
            if (displayTimeLeft <= 1000) {
                displayTimeLeft = 1000; // Lock display at 0:01
            }
            
            timeLeft = displayTimeLeft;

            // Use real time for animations, display time for text
            updateTimerDisplay(displayTimeLeft, realTimeLeft);

            // Finish when animations are complete (real time reaches 0)
            if (realTimeLeft <= 0) {
                clearInterval(timer);
                isRunning = false;
                startButton.textContent = "Start";

                // Play Alarm Sound for 2 Seconds
                alarmSound.currentTime = 0;
                alarmSound.play();
                setTimeout(() => alarmSound.pause(), 1850); // Stop after 1.7 seconds

                // Automatically switch to next mode
                if (isBreakMode) {
                    pomodorosLeft--;
                    pomodorosLeftInput.value = pomodorosLeft;
                    switchToPomodoro();
                } else {
                    switchToBreak();
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
    console.log("Switching to Pomodoro mode");
    clearInterval(timer);
    isRunning = false;
    startButton.textContent = "Start";
    
    isBreakMode = false;
    timeLeft = getPomodoroTime();
    updateTimerDisplay(timeLeft);
    updateTimerImage();
    
    document.body.classList.remove("break-mode");
    document.querySelector(".container").classList.remove("break-mode");
    
    if (autoStartPomodoros.checked) toggleTimer();
}

// Switch to Break Mode
function switchToBreak() {
    console.log("Switching to Break mode");
    clearInterval(timer);
    isRunning = false;
    startButton.textContent = "Start";
    
    isBreakMode = true;
    timeLeft = getBreakTime();
    updateTimerDisplay(timeLeft);
    updateTimerImage();
    
    document.body.classList.add("break-mode");
    document.querySelector(".container").classList.add("break-mode");
    
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