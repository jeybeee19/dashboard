// Get saved moods from localStorage or start with all 0
let moods = JSON.parse(localStorage.getItem("moods")) || {
  Happy: 0,
  Sad: 0,
  Angry: 0,
  Calm: 0,
  Anxious: 0,
  Excited: 0,
};

// Get the pie chart canvas element
const ctx = document.getElementById("pie-Chart");

// Create a pie chart using Chart.js
const pieChart = new Chart(ctx, {
  type: "pie", // chart type
  data: {
    labels: Object.keys(moods), // moods names
    datasets: [
      {
        data: Object.values(moods), // counts of each mood
        backgroundColor: [
          // colors for each mood
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
    responsive: true, // adjust chart size automatically
    maintainAspectRatio: false, // fill the container height
    plugins: {
      legend: {
        labels: {
          color: "white", // legend text color
          usePointStyle: true,
          boxWidth: 20,
          boxHeight: 10,
        },
      },
    },
  },
});

// Get the line chart canvas element
const lctx = document.getElementById("line-Chart");

// Create a line chart for trends
const chart = new Chart(lctx, {
  type: "line",
  data: {
    labels: [], // x-axis labels (empty initially)
    datasets: [
      {
        label: "Mood",
        data: [],
        borderColor: "rgba(255, 206, 86, 0.7)",
        backgroundColor: "rgba(255, 206, 86, 0.7)",
        borderDash: [5, 5],
      },
      {
        label: "Sleep",
        data: [],
        borderColor: "rgba(255, 99, 132, 0.7)",
        backgroundColor: "rgba(255, 99, 132, 0.7)",
        borderDash: [5, 5],
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
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
        ticks: { color: "white" }, // x-axis label color
        grid: { color: "rgba(255,255,255,0.2)" }, // x-axis grid lines
      },
      y: {
        ticks: { color: "white" }, // y-axis label color
        grid: { color: "rgba(255,255,255,0.2)" }, // y-axis grid lines
      },
    },
  },
});

// Get the mood modal element
const moodLog = document.querySelector(".mood-Modal");

// Show mood modal
function openMood() {
  moodLog.style.display = "flex";
}

// Hide mood modal
function closeModal() {
  moodLog.style.display = "none";
}

// Keep track of history for undo
let history = [];

// Log a mood when button clicked
function logMood(mood) {
  history.push({ ...moods }); // save current state before change
  moods[mood]++; // increment the selected mood

  console.log(moods); // debug
  pieChart.data.datasets[0].data = Object.values(moods); // update chart
  pieChart.update(); // redraw chart
  localStorage.setItem("moods", JSON.stringify(moods)); // save to storage
  updatePercentage(); // update percentages below chart
}

// Update percentage display under the chart
function updatePercentage() {
  let html = "";
  const total = Object.values(moods).reduce((a, b) => a + b, 0); // total moods
  for (let [key, val] of Object.entries(moods)) {
    const pct = total ? ((val / total) * 100).toFixed(1) : 0; // calculate %
    html += `<p>${key}: ${val} (${pct}%)</p>`; // create html
  }
  moodRes();
  document.querySelector(".moodResult-Container").innerHTML = html; // show
}

// Reset all moods
function reset() {
  localStorage.clear(); // remove saved moods
  moods = {
    // reset moods to 0
    Happy: 0,
    Sad: 0,
    Angry: 0,
    Calm: 0,
    Anxious: 0,
    Excited: 0,
  };

  pieChart.data.datasets[0].data = Object.values(moods); // update chart
  pieChart.update();
  updatePercentage(); // update percentages
}

// Undo last mood change
function undo() {
  if (history.length > 0) {
    moods = history.pop(); // revert to previous state
    pieChart.data.datasets[0].data = Object.values(moods);
    pieChart.update();
    updatePercentage();
    localStorage.setItem("moods", JSON.stringify(moods)); // save reverted state
  }
}

const resMood = document.querySelector(".moodRes");
function moodRes() {
  const maxValue = Math.max(...Object.values(moods)); // find the largest value ...means spread operator object-> copies all key-value pairs Array → individual items
  const maxKey =
    maxValue > 0
      ? Object.keys(moods).find((key) => moods[key] === maxValue) // get key if value > 0
      : null; // if all are 0, no key

  resMood.textContent = maxKey || "NONE"; // show NONE if all 0
}

// Initial percentage display when page loads
updatePercentage();
