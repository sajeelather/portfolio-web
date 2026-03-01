class TodoApp {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    this.input = document.getElementById("task-input");
    this.list = document.getElementById("todo-list");
    this.totalEl = document.getElementById("total");
    this.doneEl = document.getElementById("done-count");
    this.remainingEl = document.getElementById("remaining");
    this.addBtn = document.getElementById("add-btn");

    this.addBtn.addEventListener("click", () => this.addTask());
    this.input.addEventListener("keydown", e => {
      if (e.key === "Enter") this.addTask();
    });

    this.render();
  }

  save() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  addTask() {
    const text = this.input.value.trim();
    if (!text) return;

    this.tasks.push({ text, done: false });
    this.input.value = "";
    this.save();
    this.render();
  }

  toggleTask(index) {
    this.tasks[index].done = !this.tasks[index].done;
    this.save();
    this.render();
  }

  deleteTask(index) {
    this.tasks.splice(index, 1);
    this.save();
    this.render();
  }

  updateStats() {
    const total = this.tasks.length;
    const done = this.tasks.filter(t => t.done).length;

    this.totalEl.textContent = total;
    this.doneEl.textContent = done;
    this.remainingEl.textContent = total - done;
  }

  render() {
    if (this.tasks.length === 0) {
      this.list.innerHTML =
        '<li class="empty"><span>🌿</span>No tasks yet. Add one above!</li>';
    } else {
      this.list.innerHTML = this.tasks.map((task, index) => `
        <li class="todo-item ${task.done ? "done" : ""}">
          <input type="checkbox" ${task.done ? "checked" : ""}
            data-index="${index}" class="toggle" />
          <span class="todo-text">${this.escapeHTML(task.text)}</span>
          <button class="delete-btn" data-index="${index}">🗑</button>
        </li>
      `).join("");
    }

    this.updateStats();
    this.attachEvents();
  }

  attachEvents() {
    document.querySelectorAll(".toggle").forEach(el => {
      el.addEventListener("change", e => {
        this.toggleTask(e.target.dataset.index);
      });
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        this.deleteTask(e.target.dataset.index);
      });
    });
  }

  escapeHTML(str) {
    return str.replace(/&/g,'&amp;')
              .replace(/</g,'&lt;')
              .replace(/>/g,'&gt;');
  }
}

new TodoApp();