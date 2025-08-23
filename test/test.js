// --- DOM Elements ---
const flipBtn = document.querySelector(".flip");
const addBtn = document.querySelector(".add-btn");
const card = document.getElementById("card");
const modal = document.getElementById("modal");
const modalText = document.getElementById("modalText");

// Input elements
const moodInput = document.getElementById("mood");
const sleepInput = document.getElementById("sleep");
const stressInput = document.getElementById("stress");

let ifFlip = false; // track card state
let data = []; // store all entries

// --- Chart.js Setup ---
const ctx = document.getElementById("chart");
const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Mood",
        data: [],
        borderColor: "#00FFFF",
        backgroundColor: "rgba(0,255,255,0.2)",
        borderDash: [5, 5],
      },
      {
        label: "Sleep",
        data: [],
        borderColor: "#7CFC00",
        backgroundColor: "rgba(124,252,0,0.2)",
        borderDash: [5, 5],
      },
      {
        label: "Stress",
        data: [],
        borderColor: "#FF4500",
        backgroundColor: "rgba(255,69,0,0.2)",
        borderDash: [5, 5],
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "white",
          usePointStyle: true,
          boxWidth: 20,
          boxHeight: 10,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "white" },
        grid: { color: "rgba(255,255,255,0.2)" },
      },
      y: {
        ticks: { color: "white" },
        grid: { color: "rgba(255,255,255,0.2)" },
      },
    },
  },
});

// --- Event Listeners ---

// Flip card
flipBtn.addEventListener("click", (e) => {
  e.preventDefault();
  card.classList.toggle("flipped");
  ifFlip = !ifFlip;
});

// Add Data button
addBtn.addEventListener("click", (e) => {
  e.preventDefault();
  addData();

  // If card is flipped, flip back to front
  if (ifFlip) {
    card.classList.toggle("flipped");
    ifFlip = false;
  }
});

// --- Functions ---

function addData() {
  // Get values
  const mood = Number(moodInput.value);
  const sleep = Number(sleepInput.value);
  const stress = Number(stressInput.value);

  // Validate inputs
  if (!validateInputs(mood, sleep, stress)) return;

  // Clear inputs
  moodInput.value = "";
  sleepInput.value = "";
  stressInput.value = "";

  // Save new entry
  data.push({ mood, sleep, stress });

  // Update chart
  updateChart(mood, sleep, stress);

  // Generate insights and show modal
  const insight = generateInsights(mood, sleep, stress);
  modalText.innerText = insight;
  modal.style.display = "flex";
}

// Validate input values
function validateInputs(mood, sleep, stress) {
  if (!mood || !sleep || !stress) return false; // empty
  if (mood <= 0 || sleep < 0 || stress <= 0) return false; // negative
  if (mood > 10 || sleep > 24 || stress > 10) return false; // exceeds max
  return true;
}

// Update chart with new values
function updateChart(mood, sleep, stress) {
  chart.data.labels.push("Day " + data.length);
  chart.data.datasets[0].data.push(mood);
  chart.data.datasets[1].data.push(sleep);
  chart.data.datasets[2].data.push(stress);
  chart.update();
}

// Generate insights message
function generateInsights(mood, sleep, stress) {
  if (mood < 5 && sleep < 5 && stress > 7)
    return "⚠️ Bad day! Mood low, little sleep, high stress. Take care of yourself!";
  if (mood < 5 && sleep < 5)
    return "⚠️ Low mood and poor sleep. Rest and relax!";
  if (mood < 5 && stress > 7)
    return "⚠️ Low mood and high stress. Try to relax and stay positive!";
  if (sleep < 5 && stress > 7)
    return "⚠️ Lack of sleep and high stress. Prioritize rest!";
  if (mood < 5) return "🙂 Mood is low. Take breaks and stay positive!";
  if (sleep < 5) return "😴 Sleep is too low. Try to rest more!";
  if (stress > 7) return "⚠️ Stress is high. Relax and take care!";
  if (mood >= 8 && sleep >= 7 && stress <= 4)
    return "💪 Great! Mood good, enough sleep, low stress!";
  return "✔ Data logged. Keep tracking your health!";
}
