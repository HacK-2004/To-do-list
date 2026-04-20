const input = document.getElementById("input");

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById("input");
  if (input.value.trim() === "") return;

  tasks.push({
    text: input.value,
    done: false,
    time: new Date().toLocaleString()
  });

  input.value = "";
  save();
  render();
}

function deleteTask(i) {
  tasks.splice(i, 1);
  save();
  render();
}

function toggleTask(i) {
  tasks[i].done = !tasks[i].done;
  save();
  render();
}

function editTask(index) {
  const listItems = document.querySelectorAll("li");
  const li = listItems[index];

  const input = document.createElement("input");
  input.value = tasks[index].text;

  li.innerHTML = "";
  li.appendChild(input);

  input.focus();

  // ✅ Enter saves
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      saveEdit();
    }
  });

  // ✅ Click outside also saves
  input.addEventListener("blur", saveEdit);

  function saveEdit() {
    if (input.value.trim() !== "") {
      tasks[index].text = input.value.trim();
      save();
    }
    render();
  }
}

function clearAll() {
  tasks = [];
  save();
  render();
}

function setFilter(f) {
  filter = f;
  render();
}

function render() {
  const list = document.getElementById("list");
  const count = document.getElementById("count");

  list.innerHTML = "";

  const filtered = tasks
    .map((task, index) => ({ task, index })) // keep original index
    .filter(({ task }) => {
      if (filter === "completed") return task.done;
      if (filter === "pending") return !task.done;
      return true;
    });

  filtered.forEach(({ task, index }) => {
    const li = document.createElement("li");
    li.className = task.done ? "completed" : "";

    li.innerHTML = `
      <span onclick="toggleTask(${index})">${task.text}</span>
      <div class="task-btns">
        <button class="edit" onclick="editTask(${index})">✏️</button>
        <button class="delete" onclick="deleteTask(${index})">❌</button>
      </div>
    `;

    list.appendChild(li);
  });

  count.textContent = tasks.length + " tasks";
}

render();