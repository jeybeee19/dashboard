// When "tasksBtn" is clicked, scroll smoothly to the tasks container
document.getElementById("tasksBtn").addEventListener("click", () => {
  document
    .querySelector(".tasks-Conatiner")
    .scrollIntoView({ behavior: "smooth" });
});

// Save all tasks to localStorage
function saveTasks() {
  // Get all task elements from the DOM
  const taskElements = document.querySelectorAll(".task");

  // Create an array of task objects
  const tasks = Array.from(taskElements).map((taskDiv) => ({
    text: taskDiv
      .querySelector("span")
      .textContent.replace(" ✅ Task Done!", ""), // remove "Task Done" from text
    progress: parseInt(taskDiv.querySelector("progress").value, 10), // task progress value
    isComplete: taskDiv.closest(".completeTask") !== null, // check if task is in completed section
  }));

  // Save tasks array in localStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Also save task history if it exists
  localStorage.setItem("taskHistory", JSON.stringify(taskHistory));
}

// Add new task when "Add" button is clicked
document.querySelector("#addBtn").addEventListener("click", () => {
  const noteInput = document.getElementById("noteInput");
  const text = noteInput.value.trim(); // remove extra spaces
  if (!text) return; // do nothing if input is empty

  const newTask = { text, progress: 0, isComplete: false }; // create task object
  createTaskElement(newTask); // create its DOM element
  saveTasks(); // save tasks to localStorage

  // Log this action to task history
  if (typeof logTask === "function") logTask("Added", text);

  noteInput.value = ""; // clear input
});

// Function to create a task element in the DOM
function createTaskElement(task) {
  const taskDiv = document.createElement("div");
  taskDiv.className = "task"; // add class for styling

  // Create span for task text
  const span = document.createElement("span");
  span.textContent = task.text;
  taskDiv.appendChild(span);

  // Create progress container
  const progressContainer = document.createElement("div");
  progressContainer.classList.add("task-progress");

  // Create progress bar
  const progress = document.createElement("progress");
  progress.value = task.progress;
  progress.max = 100;
  progressContainer.appendChild(progress);

  // Create progress status text
  const status = document.createElement("span");
  status.textContent =
    task.progress >= 100 ? "100% ✅ Task Done!" : task.progress + "%";
  progressContainer.appendChild(status);

  taskDiv.appendChild(progressContainer);

  // Create buttons container
  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("task-buttons");

  // Remove button
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.classList.add("removeBtn");
  removeBtn.onclick = () => {
    taskDiv.remove(); // remove task from DOM
    saveTasks(); // save changes

    // Log removal to task history
    if (typeof logTask === "function") logTask("Removed", task.text);
  };
  buttonsContainer.appendChild(removeBtn);

  // Only add Increase/Decrease buttons if task is incomplete
  if (task.progress < 100) {
    const increaseBtn = document.createElement("button");
    increaseBtn.textContent = "Increase";
    increaseBtn.classList.add("increaseBtn");
    increaseBtn.onclick = () => {
      if (progress.value < 100) progress.value += 10; // increase by 10
      if (progress.value >= 100) {
        progress.value = 100;
        status.textContent = "100% ✅ Task Done!";
        buttonsContainer.innerHTML = ""; // remove other buttons
        buttonsContainer.appendChild(removeBtn); // keep only remove button
        document.querySelector(".completeTask").appendChild(taskDiv); // move to complete section

        // Log completion
        if (typeof logTask === "function") logTask("Completed", task.text);
      } else {
        status.textContent = progress.value + "%"; // update status
      }
      saveTasks(); // save after changes
    };
    buttonsContainer.appendChild(increaseBtn);

    const decreaseBtn = document.createElement("button");
    decreaseBtn.textContent = "Decrease";
    decreaseBtn.classList.add("decreaseBtn");
    decreaseBtn.onclick = () => {
      if (progress.value > 0) progress.value -= 10; // decrease by 10
      status.textContent = progress.value + "%"; // update status
      saveTasks(); // save changes
    };
    buttonsContainer.appendChild(decreaseBtn);
  }

  taskDiv.appendChild(buttonsContainer);

  // Append task to the correct section based on progress
  if (task.progress >= 100 || task.isComplete) {
    document.querySelector(".completeTask").appendChild(taskDiv);
  } else {
    document.querySelector(".incompleteTask").appendChild(taskDiv);
  }
}
