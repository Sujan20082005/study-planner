// ===== State =====
let selectedLevel = 'beginner';

// ===== Data =====
const tips = [
  "Start with the hardest topic when your mind is fresh.",
  "Use the Pomodoro technique: 25 min focus, 5 min break.",
  "Teach the concept to yourself out loud — it sticks better.",
  "Don't skip revision days — they double your retention.",
  "Practice problems beat re-reading notes every time.",
  "One topic deep is better than five topics shallow.",
  "Write a summary after each session in your own words.",
  "Sleep is part of studying — it consolidates memory.",
  "Take a mock test before the real thing.",
  "Group related topics together for stronger connections."
];

const themes = [
  "Foundations",
  "Core concepts",
  "Deep dive",
  "Problem solving",
  "Advanced topics",
  "Mixed practice",
  "Weak spots",
  "Speed revision",
  "Full revision",
  "Final prep"
];

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {

  // Set default exam date to 14 days from today
  const today = new Date();
  document.getElementById('exam-date').min = today.toISOString().split('T')[0];
  const defaultDate = new Date(today);
  defaultDate.setDate(today.getDate() + 14);
  document.getElementById('exam-date').value = defaultDate.toISOString().split('T')[0];

  // Level tag selection
  document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', () => {
      document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      selectedLevel = tag.dataset.val;
    });
  });

});

// ===== Helpers =====

/**
 * Calculate duration per task based on daily hours and task count
 */
function parseDuration(hours, count) {
  const totalMins = parseInt(hours) * 60;
  const perTask = Math.round(totalMins / count);
  if (perTask >= 60) {
    const h = Math.floor(perTask / 60);
    const m = perTask % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }
  return `${perTask} min`;
}

/**
 * Return priority level based on topic position
 */
function getPriority(index, total) {
  if (index < total * 0.33) return 'high';
  if (index < total * 0.66) return 'med';
  return 'low';
}

/**
 * Show an error message
 */
function showError(message) {
  const errEl = document.getElementById('err');
  errEl.textContent = message;
  errEl.style.display = 'block';
}

// ===== Main Logic =====

/**
 * Validate inputs and kick off plan generation
 */
function generatePlan() {
  const topicsRaw = document.getElementById('topics').value.trim();
  const examDate = document.getElementById('exam-date').value;
  const hours = document.getElementById('hours').value;

  // Reset error
  document.getElementById('err').style.display = 'none';

  // Validate
  if (!topicsRaw) {
    showError('Please enter your topics or syllabus.');
    return;
  }
  if (!examDate) {
    showError('Please select your exam date.');
    return;
  }

  const daysLeft = Math.ceil((new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24));
  if (daysLeft < 1) {
    showError('Exam date must be in the future.');
    return;
  }

  // Show loading
  document.getElementById('gen-btn').disabled = true;
  document.getElementById('form-card').style.display = 'none';
  document.getElementById('loading').style.display = 'block';

  // Simulate processing delay for UX
  setTimeout(() => buildPlan(topicsRaw, daysLeft, hours), 900);
}

/**
 * Build the study plan from user inputs
 */
function buildPlan(topicsRaw, daysLeft, hours) {

  // Parse topics from comma or newline separated input
  const allTopics = topicsRaw
    .split(/[\n,]+/)
    .map(t => t.trim())
    .filter(Boolean);

  const totalTopics = allTopics.length;
  const displayDays = Math.min(daysLeft, 10);

  // Reserve last 1-2 days for revision
  const revisionDays = daysLeft >= 5 ? 2 : 1;
  const studyDays = displayDays - revisionDays;

  const topicsPerDay = Math.ceil(totalTopics / Math.max(studyDays, 1));
  const days = [];

  // Study days — distribute topics evenly
  for (let d = 0; d < studyDays; d++) {
    const dayTopics = allTopics.slice(d * topicsPerDay, (d + 1) * topicsPerDay);
    if (dayTopics.length === 0) continue;

    days.push({
      day: d + 1,
      theme: themes[d % themes.length],
      tasks: dayTopics.map((topic, i) => ({
        topic,
        duration: parseDuration(hours, dayTopics.length),
        priority: getPriority(d * topicsPerDay + i, totalTopics)
      })),
      tip: tips[d % tips.length]
    });
  }

  // Revision days — revisit first N topics
  const revTopics = allTopics.slice(0, Math.min(6, totalTopics));
  for (let r = 0; r < revisionDays; r++) {
    days.push({
      day: studyDays + r + 1,
      theme: r === revisionDays - 1 ? "Final prep" : "Full revision",
      tasks: revTopics.map(topic => ({
        topic: `Revise: ${topic}`,
        duration: parseDuration(hours, revTopics.length),
        priority: 'high'
      })),
      tip: tips[(studyDays + r) % tips.length]
    });
  }

  renderPlan(days, totalTopics, daysLeft, hours);
}

/**
 * Render the plan into the DOM
 */
function renderPlan(days, totalTopics, daysLeft, hours) {

  // Hide loading
  document.getElementById('loading').style.display = 'none';

  // Render stats
  document.getElementById('stats').innerHTML = `
    <div class="stat">
      <div class="stat-num">${daysLeft}</div>
      <div class="stat-lbl">Days to exam</div>
    </div>
    <div class="stat">
      <div class="stat-num">${totalTopics}</div>
      <div class="stat-lbl">Topics covered</div>
    </div>
    <div class="stat">
      <div class="stat-num">${daysLeft * parseInt(hours)}h</div>
      <div class="stat-lbl">Total study time</div>
    </div>
  `;

  // Render day cards
  const daysEl = document.getElementById('days');
  daysEl.innerHTML = '';

  days.forEach(day => {
    const tasksHTML = day.tasks.map(t => `
      <div class="task">
        <div class="dot"></div>
        <span class="task-name">
          ${t.topic}
          <span class="badge badge-${t.priority}">${t.priority}</span>
        </span>
        <span class="task-time">⏱ ${t.duration}</span>
      </div>
    `).join('');

    daysEl.innerHTML += `
      <div class="day-card">
        <div class="day-header">
          <span class="day-badge">Day ${day.day}</span>
          <span class="day-theme">${day.theme}</span>
        </div>
        ${tasksHTML}
        <div class="tip">${day.tip}</div>
      </div>
    `;
  });

  // Show result section
  document.getElementById('result').style.display = 'block';
}

/**
 * Reset form back to initial state
 */
function resetForm() {
  document.getElementById('result').style.display = 'none';
  document.getElementById('form-card').style.display = 'block';
  document.getElementById('gen-btn').disabled = false;
  document.getElementById('topics').value = '';
}
