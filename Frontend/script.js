const API_URL = "http://127.0.0.1:8000/tasks";

// Load all tasks
async function loadTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  const ul = document.getElementById("task-list");
  ul.innerHTML = "";
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTask(${task.id}, this.checked)">
      ${task.title}
      <button onclick="deleteTask(${task.id})">Delete</button>
    `;
    ul.appendChild(li);
  });
}

// Add a new task
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
async function toggleTask(id, completed) {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: document.querySelector(`#task-list li:nth-child(${id})`).innerText.split("Delete")[0].trim(), completed })
  });
  loadTasks();
}

// Delete a task
async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadTasks();
}

// Initialize
loadTasks();
