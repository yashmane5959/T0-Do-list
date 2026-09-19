
let tasks = JSON.parse(localStorage.getItem("todo-tasks")) || [];
let currentFilter = "all";


const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const itemsLeft = document.getElementById("itemsLeft");
const clearCompletedBtn = document.getElementById("clearCompleted");
const filterBtns = document.querySelectorAll(".filter-btn");


function saveAndRender() {

  localStorage.setItem("todo-tasks", JSON.stringify(tasks));


  const filtered = tasks.filter(t => {
    if (currentFilter === "active") return !t.completed;
    if (currentFilter === "completed") return t.completed;
    return true;
  });


  if (filtered.length === 0) {
    taskList.innerHTML = `<li class="empty-msg">No tasks here 🎉</li>`;
  } else {
    taskList.innerHTML = filtered.map(t => `
      <li class="task-item ${t.completed ? "completed" : ""}">
        <input type="checkbox" ${t.completed ? "checked" : ""} data-id="${t.id}">
        <span class="task-text">${t.text}</span>
        <button class="delete-btn" data-id="${t.id}">✕</button>
      </li>
    `).join("");
  }


  const activeCount = tasks.filter(t => !t.completed).length;
  itemsLeft.textContent = `${activeCount} item${activeCount !== 1 ? "s" : ""} left`;
}


function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({ id: Date.now(), text, completed: false });
  taskInput.value = "";
  saveAndRender();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) task.completed = !task.completed;
  saveAndRender();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveAndRender();
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveAndRender();
}


addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", e => e.key === "Enter" && addTask());


taskList.addEventListener("click", e => {
  const id = Number(e.target.dataset.id);
  if (e.target.type === "checkbox") toggleTask(id);
  if (e.target.classList.contains("delete-btn")) deleteTask(id);
});

clearCompletedBtn.addEventListener("click", clearCompleted);


filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    saveAndRender();
  });
});


saveAndRender();
