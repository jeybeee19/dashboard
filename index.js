// -------------------- MOOD CHART --------------------

// Load saved moods from localStorage or start with all moods at 0
let moods = JSON.parse(localStorage.getItem("moods")) || {
  Happy: 0,
  Sad: 0,
  Angry: 0,
  Calm: 0,
  Anxious: 0,
  Excited: 0,
};

// Get the canvas element for pie chart
const ctx = document.getElementById("pie-Chart");

// Create pie chart using Chart.js
const pieChart = new Chart(ctx, {
  type: "pie", // Pie chart
  data: {
    labels: Object.keys(moods), // Names of moods
    datasets: [
      {
        data: Object.values(moods), // Count of each mood
        backgroundColor: [
          // Colors for each slice
          "#FFEB3B", // Happy
          "#2196F3", // Sad
          "#F44336", // Angry
          "#4CAF50", // Calm
          "#9C27B0", // Anxious
          "#FF9800", // Excited
        ],
      },
    ],
  },
  options: {
    responsive: true, // Chart resizes automatically
    maintainAspectRatio: true, // Keep aspect ratio
    plugins: {
      legend: {
        labels: {
          color: "white", // Legend text color
          usePointStyle: true, // Show small points instead of boxes
          boxWidth: 20,
          boxHeight: 10,
        },
      },
    },
  },
});

// -------------------- MODAL ELEMENTS --------------------

// Get modal elements
const moodLog = document.querySelector(".mood-Modal"); // Mood modal
const taskLog = document.querySelector(".task-Modal"); // Task modal
const historyLog = document.querySelector(".history-Modal"); // History modal

// Function to open modal
function openMood(type) {
  if (type === "mood") moodLog.style.display = "flex"; // show mood modal
  else if (type === "task") taskLog.style.display = "flex"; // show task modal
  else if (type === "history") historyLog.style.display = "flex"; // show history modal
  localStorage.setItem("modalOpen", "true"); // remember modal is open
}

// Function to close modal
function closeModal(type) {
  if (type === "mood") moodLog.style.display = "none";
  else if (type === "task") taskLog.style.display = "none";
  else if (type === "history") historyLog.style.display = "none";
  localStorage.setItem("modalOpen", "false"); // remember modal is closed
}

// Scroll to line chart when "Analytics" button clicked
document.querySelector(".analytics").addEventListener("click", () => {
  const lineChart = document.querySelector(".line-Chart"); // target chart
  const topPos = lineChart.getBoundingClientRect().top + window.scrollY;
  const centerPos =
    topPos - window.innerHeight / 2 + lineChart.offsetHeight / 2;
  window.scrollTo({ top: centerPos, behavior: "smooth" }); // smooth scroll
});

// Scroll to mood results when "Mood Log" button clicked
document.querySelector(".moodLog").addEventListener("click", () => {
  const moodResults = document.querySelector(".moodResults");
  const topPos = moodResults.getBoundingClientRect().top + window.scrollY;
  const centerPos =
    topPos - window.innerHeight / 2 + moodResults.offsetHeight / 2;
  window.scrollTo({ top: centerPos, behavior: "smooth" });
});

// -------------------- MOOD LOGIC --------------------

// Load history of moods from localStorage or start empty
let history = JSON.parse(localStorage.getItem("history")) || [];
function updateTotalEntries() {
  const moodTotal = Object.values(moods).reduce((a, b) => a + b, 0);
  const taskTotal = JSON.parse(localStorage.getItem("tasks"))?.length || 0;
  const sleepTotal = sleepData.length;

  const totalEntries = moodTotal + taskTotal + sleepTotal;
  document.getElementById("totalEntries").textContent =
    totalEntries > 0 ? totalEntries : "NONE";
}
// Add a mood entry
function logMood(mood) {
  history.push({ ...moods });
  localStorage.setItem("history", JSON.stringify(history));
  moods[mood]++;
  pieChart.data.datasets[0].data = Object.values(moods);
  pieChart.update();
  localStorage.setItem("moods", JSON.stringify(moods));
  updatePercentage();
  updateMoodHistory();
  updateTotalEntries(); // ✅ update total entries here
}

// Show percentages for each mood
function updatePercentage() {
  let html = "";
  const total = Object.values(moods).reduce((a, b) => a + b, 0); // total count
  for (let [key, val] of Object.entries(moods)) {
    const pct = total ? ((val / total) * 100).toFixed(1) : 0; // calculate %
    html += `<p>${key}: ${val} (${pct}%)</p>`; // create HTML
  }
  moodRes(); // update most frequent mood
  document.querySelector(".moodResult-Container").innerHTML = html; // show on page
}

// Reset all moods and history
function reset() {
  moods = { Happy: 0, Sad: 0, Angry: 0, Calm: 0, Anxious: 0, Excited: 0 }; // reset moods
  history = []; // reset history
  localStorage.clear(); // clear storage
  localStorage.setItem("history", JSON.stringify(history)); // keep empty history
  pieChart.data.datasets[0].data = Object.values(moods); // reset chart
  pieChart.update();
  updatePercentage(); // update UI
  updateMoodHistory(); // clear mood history display
  updateTaskHistory(); // clear task history display
  updateSleepHistory(); // clear sleep history display
}

// Undo last mood
function undo() {
  if (history.length > 0) {
    moods = history.pop(); // restore last state
    localStorage.setItem("history", JSON.stringify(history));
    pieChart.data.datasets[0].data = Object.values(moods);
    pieChart.update();
    updatePercentage();
    localStorage.setItem("moods", JSON.stringify(moods));
    updateMoodHistory();
  }
}

// Show most frequent mood
const resMood = document.querySelector(".moodRes");
function moodRes() {
  const maxValue = Math.max(...Object.values(moods));
  const maxKey =
    maxValue > 0 ? Object.keys(moods).find((k) => moods[k] === maxValue) : null;
  resMood.textContent = maxKey || "NONE"; // display most frequent mood
}

// Update mood history display
function updateMoodHistory() {
  const container = document.querySelector(".moodHistory");
  container.innerHTML = "";
  history.forEach((h, i) => {
    const total = Object.values(h).reduce((a, b) => a + b, 0);
    let entry = `<p><strong>Entry ${i + 1}:</strong> `;
    entry += Object.entries(h)
      .map(([key, val]) => `${key}: ${val}`)
      .join(", ");
    entry += ` (Total: ${total})</p>`;
    container.innerHTML += entry;
  });
}

// Update percentage display on page load
updatePercentage();

// Show modal if it was open before reload
if (localStorage.getItem("modalOpen") === "true")
  moodLog.style.display = "flex";
else moodLog.style.display = "none";

// -------------------- TASK HISTORY --------------------

// Load task history or start empty
let taskHistory = JSON.parse(localStorage.getItem("taskHistory")) || [];

// Add a task log
function logTask(action, taskName) {
  taskHistory.push({ action, taskName, time: new Date().toLocaleString() });
  localStorage.setItem("taskHistory", JSON.stringify(taskHistory));
  updateTaskHistory();
  updateTotalEntries(); // ✅ update total entries here
}

// Update task history display
function updateTaskHistory() {
  const container = document.querySelector(".taskHistory");
  container.innerHTML = "";
  taskHistory.forEach((entry, i) => {
    container.innerHTML += `<p><strong>Entry ${i + 1}:</strong> ${
      entry.action
    } "${entry.taskName}" at ${entry.time}</p>`;
  });
}

// -------------------- SLEEP LINE CHART --------------------

// Get sleep modal and button
const sleepModal = document.querySelector(".sleep-Modal");
const sleepBtn = document.getElementById("sleepBtn");
sleepBtn.onclick = () => (sleepModal.style.display = "flex"); // open modal

// Close sleep modal
function closeSleepModal() {
  sleepModal.style.display = "none";
}

// Load sleep data or start empty
let sleepData = JSON.parse(localStorage.getItem("sleepData")) || [];
let sleepLineChart; // variable for line chart

// Update sleep chart and dashboard
function updateSleepDashboard() {
  const sleepTotal = sleepData.length;
  const sleepAverage = sleepTotal
    ? (sleepData.reduce((a, b) => a + b, 0) / sleepTotal).toFixed(1)
    : "NONE";

  // Display average sleep
  document.getElementById("sleepAverage").textContent =
    sleepAverage !== "NONE" ? sleepAverage + " hrs" : "NONE";

  // Display total entries
  const moodTotal = Object.values(moods).reduce((a, b) => a + b, 0);
  const totalEntries = moodTotal + sleepTotal;
  document.getElementById("totalEntries").textContent =
    totalEntries > 0 ? totalEntries : "NONE";

  // Draw or update line chart
  const lctx = document.getElementById("line-Chart").getContext("2d");
  if (sleepLineChart) sleepLineChart.destroy(); // destroy old chart if exists

  sleepLineChart = new Chart(lctx, {
    type: "line",
    data: {
      labels: sleepData.map((_, i) => `Entry ${i + 1}`), // x-axis labels
      datasets: [
        {
          label: "Hours Slept",
          data: sleepData,
          borderColor: "rgba(255, 99, 132, 0.7)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderDash: [5, 5],
          fill: false,
          tension: 0.3,
          pointRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: "white" } } },
      scales: {
        x: {
          ticks: { color: "white" },
          grid: { color: "rgba(255,255,255,0.2)" },
        },
        y: {
          beginAtZero: true,
          max: 24,
          ticks: { color: "white" },
          grid: { color: "rgba(255,255,255,0.2)" },
        },
      },
    },
  });

  updateSleepHistory(); // update sleep history display
}

// Display sleep history
function updateSleepHistory() {
  const container = document.querySelector(".sleepHistory");
  container.innerHTML = "";
  sleepData.forEach((hours, i) => {
    container.innerHTML += `<p><strong>Entry ${
      i + 1
    }:</strong> Slept ${hours} hrs</p>`;
  });
}

// Add sleep entry
document.getElementById("addSleepBtn").addEventListener("click", () => {
  const hours = parseFloat(document.getElementById("sleepHours").value);
  if (!hours || hours < 0 || hours > 24) return alert("Enter valid hours");
  sleepData.push(hours);
  localStorage.setItem("sleepData", JSON.stringify(sleepData));
  document.getElementById("sleepHours").value = "";
  updateSleepDashboard();
  closeSleepModal();
  updateTotalEntries(); // ✅ update total entries here
});

// -------------------- INIT --------------------

// On page load, restore tasks and update all dashboards
window.onload = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => createTaskElement(task)); // recreate task elements
  updateSleepDashboard();
  updateMoodHistory();
  updateTaskHistory();
  updateSleepHistory();
};
