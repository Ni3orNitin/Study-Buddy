const contTimerDisplay = document.getElementById('continuous-timer-display');
const contStartBtn = document.getElementById('cont-start-btn');
const contPauseBtn = document.getElementById('cont-pause-btn');
const contResetBtn = document.getElementById('cont-reset-btn');
const badgesDisplay = document.getElementById('badges-display');

let contTimer;
let totalSeconds = 0;
let isRunning = false;
let badges = JSON.parse(localStorage.getItem('badges')) || [];

const badgeThresholds = {
    "30-Minute Guru": 30 * 60, // 30 minutes in seconds
    "1-Hour Hero": 60 * 60,   // 1 hour
    "2-Hour Champion": 2 * 60 * 60, // 2 hours
    "3-Hour Legend": 3 * 60 * 60 // 3 hours
};

// Functions for the timer
function updateContinuousTimer() {
    totalSeconds++;
    saveProgress();
    checkBadges();
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    contTimerDisplay.textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startContinuousTimer() {
    if (isRunning) return;
    isRunning = true;
    contTimer = setInterval(updateContinuousTimer, 1000);
}

function pauseContinuousTimer() {
    clearInterval(contTimer);
    isRunning = false;
}

function resetContinuousTimer() {
    clearInterval(contTimer);
    isRunning = false;
    totalSeconds = 0;
    saveProgress();
    loadProgress();
}

// Functions for saving and loading progress
function saveProgress() {
    localStorage.setItem('continuousTime', totalSeconds);
    localStorage.setItem('badges', JSON.stringify(badges));
}

function loadProgress() {
    totalSeconds = parseInt(localStorage.getItem('continuousTime')) || 0;
    updateContinuousTimer();
    renderBadges();
}

// Functions for badges
function checkBadges() {
    for (const badgeName in badgeThresholds) {
        if (totalSeconds >= badgeThresholds[badgeName] && !badges.includes(badgeName)) {
            badges.push(badgeName);
            renderBadges();
        }
    }
}

function renderBadges() {
    badgesDisplay.innerHTML = '';
    for (const badgeName of badges) {
        const badgeDiv = document.createElement('div');
        badgeDiv.className = 'badge unlocked';
        badgeDiv.textContent = badgeName;
        badgesDisplay.appendChild(badgeDiv);
    }
}

// Event listeners
contStartBtn.addEventListener('click', startContinuousTimer);
contPauseBtn.addEventListener('click', pauseContinuousTimer);
contResetBtn.addEventListener('click', resetContinuousTimer);

// Initial load
document.addEventListener('DOMContentLoaded', loadProgress);