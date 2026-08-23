/* ==========================================================================
   Today's List — to-do app logic
   - Add / delete / toggle-complete tasks
   - Persist tasks in localStorage
   - Keep the UI (empty state, counter) in sync with the data
   ========================================================================== */

(function () {
  "use strict";

  const STORAGE_KEY = "syntecxhub_todo_tasks";

  /** @type {HTMLFormElement} */
  const addForm = document.getElementById("addForm");
  /** @type {HTMLInputElement} */
  const taskInput = document.getElementById("taskInput");
  /** @type {HTMLUListElement} */
  const taskList = document.getElementById("taskList");
  const notebook = document.querySelector(".notebook");
  const taskCountEl = document.getElementById("taskCount");
  const clearCompletedBtn = document.getElementById("clearCompleted");
  const dateEl = document.getElementById("todayDate");
  /** @type {HTMLTemplateElement} */
  const taskTemplate = document.getElementById("taskTemplate");

  /** In-memory copy of the tasks, mirrored to localStorage on every change. */
  let tasks = loadTasks();

  init();

  function init() {
    renderDate();
    renderAll();

    addForm.addEventListener("submit", handleAddTask);
    clearCompletedBtn.addEventListener("click", handleClearCompleted);
  }

  /* ------------------------------------------------------------------ */
  /* Storage helpers                                                    */
  /* ------------------------------------------------------------------ */

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("Could not read saved tasks, starting fresh.", err);
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error("Could not save tasks to localStorage.", err);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Event handlers                                                     */
  /* ------------------------------------------------------------------ */

  function handleAddTask(event) {
    event.preventDefault();

    const text = taskInput.value.trim();
    if (!text) return;

    const task = {
      id: generateId(),
      text: text,
      done: false,
      createdAt: Date.now(),
    };

    tasks.unshift(task);
    saveTasks();
    renderAll();

    taskInput.value = "";
    taskInput.focus();
  }

  function handleToggleTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    task.done = !task.done;
    saveTasks();
    renderAll();
  }

  function handleDeleteTask(id) {
    const row = taskList.querySelector(`[data-id="${id}"]`);
    if (row) {
      // Small exit animation before actually removing the data/row.
      row.style.transition = "opacity 0.15s ease, transform 0.15s ease";
      row.style.opacity = "0";
      row.style.transform = "translateX(6px)";
      setTimeout(() => {
        tasks = tasks.filter((t) => t.id !== id);
        saveTasks();
        renderAll();
      }, 140);
    } else {
      tasks = tasks.filter((t) => t.id !== id);
      saveTasks();
      renderAll();
    }
  }

  function handleClearCompleted() {
    tasks = tasks.filter((t) => !t.done);
    saveTasks();
    renderAll();
  }

  /* ------------------------------------------------------------------ */
  /* Rendering                                                          */
  /* ------------------------------------------------------------------ */

  function renderAll() {
    taskList.innerHTML = "";

    tasks.forEach((task) => {
      taskList.appendChild(buildTaskRow(task));
    });

    notebook.classList.toggle("is-empty", tasks.length === 0);
    updateFooter();
  }

  function buildTaskRow(task) {
    const fragment = taskTemplate.content.cloneNode(true);
    const row = fragment.querySelector(".task");
    const checkBtn = fragment.querySelector(".task__check");
    const textEl = fragment.querySelector(".task__text");
    const deleteBtn = fragment.querySelector(".task__delete");

    row.dataset.id = task.id;
    row.classList.toggle("is-done", task.done);
    textEl.textContent = task.text;

    checkBtn.addEventListener("click", () => handleToggleTask(task.id));
    deleteBtn.addEventListener("click", () => handleDeleteTask(task.id));

    return fragment;
  }

  function updateFooter() {
    const total = tasks.length;
    const done = tasks.filter((t) => t.done).length;

    taskCountEl.textContent =
      total === 0
        ? "0 tasks"
        : `${done} of ${total} done`;

    clearCompletedBtn.disabled = done === 0;
  }

  function renderDate() {
    const today = new Date();
    const options = { weekday: "long", month: "long", day: "numeric" };
    dateEl.textContent = today.toLocaleDateString(undefined, options);
  }

  /* ------------------------------------------------------------------ */
  /* Utilities                                                          */
  /* ------------------------------------------------------------------ */

  function generateId() {
    return `t_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
})();