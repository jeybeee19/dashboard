// When the element with ID "logEntry" is clicked
document.querySelector("#logEntry").addEventListener("click", () => {
  // Select the first element with class "log-Button"
  const logButton = document.querySelector(".log-Button");

  // Get the distance from the top of the page to the element
  const topPos = logButton.getBoundingClientRect().top + window.scrollY;

  // Calculate the center position of the element relative to the viewport
  const centerPos =
    topPos - window.innerHeight / 2 + logButton.offsetHeight / 2;

  // Scroll the page smoothly to center the element
  window.scrollTo({
    top: centerPos,
    behavior: "smooth",
  });
});

// When the element with class "home" is clicked
document.querySelector(".home").addEventListener("click", () => {
  // Select the element with class "dashboard"
  const dashboard = document.querySelector(".dashboard");

  // Get the distance from the top of the page to the element
  const topPos = dashboard.getBoundingClientRect().top + window.scrollY;

  // Calculate the center position of the element relative to the viewport
  const centerPos =
    topPos - window.innerHeight / 2 + dashboard.offsetHeight / 2;

  // Scroll the page smoothly to center the element
  window.scrollTo({
    top: centerPos,
    behavior: "smooth",
  });
});
