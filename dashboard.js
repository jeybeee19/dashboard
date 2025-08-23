const ctx = document.getElementById("pie-Chart");
const pieChart = new Chart(ctx, {
  type: "pie",
  data: {
    labels: ["Red", "Yellow"],
    datasets: [
      {
        data: [10, 20, 30],
        backgroundColor: ["rgba(255, 99, 132, 0.7)", "rgba(255, 206, 86, 0.7)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(255, 206, 86, 1)"],
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false, // allows it to fill div height
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
  },
});

const lctx = document.getElementById("line-Chart");
const chart = new Chart(lctx, {
  type: "line",
  data: {
    labels: [],
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
    maintainAspectRatio: false, // fills container height
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
