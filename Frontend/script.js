const API_URL = "http://127.0.0.1:8000/tasks";
let tasks = [];
let filter = "all";

const themeBtn = document.getElementById("toggle-theme");
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  themeBtn.textContent = document.body.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";
});

// Load all tasks
async function loadTasks() {
  const res = await fetch(API_URL);
  tasks = await res.json();
  renderTasks();
}

function renderTasks() {
  const ul = document.getElementById("task-list");
  ul.innerHTML = "";

  let filteredTasks = tasks;
  if (filter === true) filteredTasks = tasks.filter(t => t.completed);
  else if (filter === false) filteredTasks = tasks.filter(t => !t.completed);

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-card";
    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTask(${task.id})">
      <span class="task-title ${task.completed ? "task-completed" : ""}">${task.title}</span>
      <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
      <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
    `;
    ul.appendChild(li);
  });
}

// Add new task
async function addTask() {
  const input = document.getElementById("new-task");
  const title = input.value.trim();
  if (!title) return alert("Enter a task!");
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, completed: false })
  });
  input.value = "";
  loadTasks();
}

// Toggle completed status
async function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: task.title, completed: !task.completed })
  });
  loadTasks();
}

// Delete task
async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadTasks();
}

// Edit task
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newTitle = prompt("Edit task:", task.title);
  if (newTitle === null) return;
  fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: newTitle, completed: task.completed })
  }).then(loadTasks);
}

// Filter tasks
function filterTasks(f) {
  filter = f;
  renderTasks();
}

// Search tasks
function searchTasks() {
  const query = document.getElementById("search-task").value.toLowerCase();
  const ul = document.getElementById("task-list");
  ul.innerHTML = "";
  tasks.filter(t => t.title.toLowerCase().includes(query))
       .forEach(task => {
         const li = document.createElement("li");
         li.className = "task-card";
         li.innerHTML = `
          <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTask(${task.id})">
          <span class="task-title ${task.completed ? "task-completed" : ""}">${task.title}</span>
          <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
          <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
         `;
         ul.appendChild(li);
       });
}

// Clear completed tasks
async function clearCompleted() {
  const completedTasks = tasks.filter(t => t.completed);
  for (const t of completedTasks) {
    await fetch(`${API_URL}/${t.id}`, { method: "DELETE" });
  }
  loadTasks();
}

// Clear all tasks
async function clearAll() {
  for (const t of tasks) {
    await fetch(`${API_URL}/${t.id}`, { method: "DELETE" });
  }
  loadTasks();
}

// Initialize
loadTasks();

