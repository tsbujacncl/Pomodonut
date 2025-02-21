let timer;
let timeLeft = 25 * 60; // 25 minutes in seconds
let coffeeTimeLeft = 5 * 60; // 5 minutes in seconds
let isRunning = false;
let isCoffeeMode = false;

const timerText = document.getElementById("timer-text");
const donutImage = document.getElementById("donut-image");

const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");

function updateTimerDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerText.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function updateCoffeeTimerDisplay() {
    let minutes = Math.floor(coffeeTimeLeft / 60);
    let seconds = coffeeTimeLeft % 60;
    timerText.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(() => {
            if (!isCoffeeMode) {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateTimerDisplay();
                } else {
                    clearInterval(timer);
                    isRunning = false;
                    switchToCoffeeBreak();
                }
            } else {
                if (coffeeTimeLeft > 0) {
                    coffeeTimeLeft--;
                    updateCoffeeTimerDisplay();
                } else {
                    clearInterval(timer);
                    isRunning = false;
                    switchToPomodoro();
                }
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isCoffeeMode = false;
    timeLeft = 25 * 60;
    coffeeTimeLeft = 5 * 60;
    donutImage.src = "assets/donut.jpg"; // Reset to donut image
    updateTimerDisplay();
}

function switchToCoffeeBreak() {
    isCoffeeMode = true;
    coffeeTimeLeft = 5 * 60;

    // Change the image to the coffee mug
    donutImage.src = "assets/coffee-mug.png";

    // Hide the donut hole when switching to coffee mode
    document.querySelector(".donut-hole").style.display = "none";

    updateCoffeeTimerDisplay();
    startTimer();
}

function switchToPomodoro() {
    isCoffeeMode = false;
    timeLeft = 25 * 60;

    // Switch back to the donut image
    donutImage.src = "assets/donut.jpg";

    // Show the donut hole again
    document.querySelector(".donut-hole").style.display = "block";

    updateTimerDisplay();
}

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);

updateTimerDisplay();