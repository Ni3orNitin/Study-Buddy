const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

let timer;
let timeLeft = 1500; // 25 minutes in seconds
let isPaused = false;

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (timer) return; // Prevent multiple timers
    isPaused = false;
    timer = setInterval(() => {
        if (!isPaused && timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else if (timeLeft <= 0) {
            clearInterval(timer);
            alert("Time's up! Take a break.");
        }
    }, 1000);
}

function pauseTimer() {
    isPaused = true;
}

function resetTimer() {
    clearInterval(timer);
    timer = null;
    timeLeft = 1500;
    isPaused = false;
    updateDisplay();
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

updateDisplay();