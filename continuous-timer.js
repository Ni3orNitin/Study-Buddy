// continuous-timer.js
document.addEventListener("DOMContentLoaded", () => {
  const contTimerDisplay = document.getElementById('continuous-timer-display');
  const contStartBtn = document.getElementById('cont-start-btn');
  const contPauseBtn = document.getElementById('cont-pause-btn');
  const contResetBtn = document.getElementById('cont-reset-btn');
  const badgesDisplay = document.getElementById('badges-display');
  const usernameInput = document.getElementById('user-name-input');


  if (!contTimerDisplay || !contStartBtn || !contPauseBtn || !contResetBtn || !badgesDisplay || !usernameInput) {
    console.error("continuous-timer.js: Missing one of the required DOM elements. Check IDs in HTML.");
    return;
  }

  // Load saved name if exists
  usernameInput.value = localStorage.getItem('username') || '';

  let contTimer = null;
  let totalSeconds = 0;
  let isRunning = false;
  let badges = JSON.parse(localStorage.getItem('badges')) || [];

  const badgeThresholds = [
    { label: "30-Minute Guru", seconds: 30 * 60, img: "badge-30min.png" },
    { label: "1-Hour Hero", seconds: 60 * 60, img: "badge-1hr.png" },
    { label: "1.5-Hour Achiever", seconds: 90 * 60 , img: "badge-1_5hr.png" },
    { label: "2-Hour Champion", seconds: 1 * 60, img: "badge-2hr.png" },
    { label: "3-Hour Legend", seconds: 1 * 60, img: "badge-3hr.png" },
    { label: "4-Hour Legend", seconds: 2 * 60, img: "badge-3hr.png" }
  ];

  function renderTime() {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    contTimerDisplay.textContent =
      `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  function saveProgress() {
    localStorage.setItem('continuousTime', totalSeconds);
    localStorage.setItem('badges', JSON.stringify(badges));
    localStorage.setItem('username', usernameInput.value.trim());
  }

  function loadProgress() {
    totalSeconds = parseInt(localStorage.getItem('continuousTime')) || 0;
    badges = JSON.parse(localStorage.getItem('badges')) || [];
    renderTime();
    renderBadges();
    updateButtons();
  }

  function generateBadgeImage(badge) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 400;

    const img = new Image();
    img.src = `assets/badges/${badge.img}`;

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const userName = usernameInput.value.trim() || "Student"; // use input or fallback
      ctx.fillStyle = "#000";
      ctx.font = "22px Arial Bold";
      ctx.textAlign = "center";
      ctx.fillText(userName, canvas.width / 2, canvas.height - 70);

      const today = new Date().toLocaleDateString();
      ctx.font = "18px Arial";
      ctx.fillText(today, canvas.width / 2, canvas.height - 40);

      const link = document.createElement("a");
      link.download = `${badge.label}-${userName}.png`;
      link.href = canvas.toDataURL("image/png");
      link.textContent = "⬇️ Download";
      link.className = "download-link";

      const badgeDiv = document.getElementById(`badge-${badge.label.replace(/\s+/g, '-')}`);
      if (badgeDiv) badgeDiv.appendChild(link);
    };
  }

  function checkBadges() {
    badgeThresholds.forEach(th => {
      if (totalSeconds >= th.seconds && !badges.includes(th.label)) {
        badges.push(th.label);
        saveProgress();
        renderBadges();
        generateBadgeImage(th);
      }
    });
  }

  function renderBadges() {
    badgesDisplay.innerHTML = '';
    if (badges.length === 0) {
      badgesDisplay.innerHTML = '<div style="color:#888">No badges yet</div>';
      return;
    }
    badges.forEach(b => {
      const div = document.createElement('div');
      div.className = 'badge unlocked';
      div.id = `badge-${b.replace(/\s+/g, '-')}`;
      div.textContent = b;
      badgesDisplay.appendChild(div);
    });
  }

  function updateButtons() {
    contStartBtn.disabled = isRunning;
    contPauseBtn.disabled = !isRunning;
  }

  function startContinuousTimer() {
    if (isRunning) return;
    contTimer = setInterval(() => {
      totalSeconds++;
      saveProgress();
      checkBadges();
      renderTime();
    }, 1000);
    isRunning = true;
    updateButtons();
  }

  function pauseContinuousTimer() {
    if (!isRunning) return;
    clearInterval(contTimer);
    contTimer = null;
    isRunning = false;
    updateButtons();
  }

  function resetContinuousTimer() {
    clearInterval(contTimer);
    contTimer = null;
    isRunning = false;
    totalSeconds = 0;
    saveProgress();
    renderTime();
    updateButtons();
  }

  // Save username whenever it changes
  usernameInput.addEventListener('input', saveProgress);

  contStartBtn.addEventListener('click', startContinuousTimer);
  contPauseBtn.addEventListener('click', pauseContinuousTimer);
  contResetBtn.addEventListener('click', resetContinuousTimer);

  loadProgress();
});
