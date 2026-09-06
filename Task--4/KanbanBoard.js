/* ============================================================
   Pinboard — script.js
   Manages board state (todo / doing / done), persists it to
   localStorage, and implements drag-and-drop with the native
   HTML5 Drag and Drop API.
   ============================================================ */

const STORAGE_KEY = "pinboard_state_v1";
const STATUSES = ["todo", "doing", "done"];

const board = document.getElementById("board");
const cardTemplate = document.getElementById("cardTemplate");
const clearBoardBtn = document.getElementById("clearBoard");

/**
 * state shape:
 * { todo: [{id, text}], doing: [{id, text}], done: [{id, text}] }
 */
let state = loadState();

// ---------- Persistence ----------
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return STATUSES.every((s) => Array.isArray(parsed[s])) ? parsed : defaultState();
  } catch {
    return defaultState();
  }
}

function defaultState() {
  return {
    todo: [
      { id: cryptoId(), text: "Write the project proposal" },
      { id: cryptoId(), text: "Sketch the board layout" },
    ],
    doing: [{ id: cryptoId(), text: "Build the drag-and-drop logic" }],
    done: [{ id: cryptoId(), text: "Set up the project folder" }],
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function cryptoId() {
  return (crypto.randomUUID && crypto.randomUUID()) || `id-${Date.now()}-${Math.random()}`;
}

// ---------- Rendering ----------
function renderAll() {
  STATUSES.forEach(renderColumn);
}

function renderColumn(status) {
  const list = document.getElementById(`list-${status}`);
  const countEl = document.getElementById(`count-${status}`);
  list.innerHTML = "";

  state[status].forEach((task) => {
    const node = cardTemplate.content.firstElementChild.cloneNode(true);
    node.dataset.id = task.id;
    node.querySelector(".card-text").textContent = task.text;
    list.appendChild(node);
  });

  countEl.textContent = state[status].length;
}

// ---------- Add task ----------
document.querySelectorAll(".add-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input");
    const text = input.value.trim();
    if (!text) return;

    const status = form.dataset.status;
    state[status].push({ id: cryptoId(), text });
    input.value = "";
    saveState();
    renderColumn(status);
  });
});

// ---------- Remove task (event delegation) ----------
board.addEventListener("click", (event) => {
  const removeBtn = event.target.closest(".card-remove");
  if (!removeBtn) return;

  const card = removeBtn.closest(".card");
  const column = card.closest(".column");
  const status = column.dataset.status;
  const id = card.dataset.id;

  state[status] = state[status].filter((task) => task.id !== id);
  saveState();
  renderColumn(status);
});

// ---------- Clear board ----------
clearBoardBtn.addEventListener("click", () => {
  const hasCards = STATUSES.some((s) => state[s].length > 0);
  if (!hasCards) return;
  if (!confirm("Remove every card from the board? This can't be undone.")) return;

  STATUSES.forEach((s) => (state[s] = []));
  saveState();
  renderAll();
});

// ---------- Drag and Drop (HTML5 DnD API) ----------
let draggedId = null;
let draggedFromStatus = null;

board.addEventListener("dragstart", (event) => {
  const card = event.target.closest(".card");
  if (!card) return;

  draggedId = card.dataset.id;
  draggedFromStatus = card.closest(".column").dataset.status;

  card.classList.add("is-dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", draggedId);
});

board.addEventListener("dragend", (event) => {
  const card = event.target.closest(".card");
  if (card) card.classList.remove("is-dragging");
  document.querySelectorAll(".card-list.drag-over").forEach((el) => el.classList.remove("drag-over"));
  draggedId = null;
  draggedFromStatus = null;
});

document.querySelectorAll(".card-list").forEach((list) => {
  list.addEventListener("dragover", (event) => {
    event.preventDefault(); // required to allow dropping
    event.dataTransfer.dropEffect = "move";
    list.classList.add("drag-over");

    const afterElement = getDragAfterElement(list, event.clientY);
    const draggingCard = document.querySelector(".card.is-dragging");
    if (!draggingCard) return;

    if (afterElement == null) {
      list.appendChild(draggingCard);
    } else {
      list.insertBefore(draggingCard, afterElement);
    }
  });

  list.addEventListener("dragleave", (event) => {
    if (event.target === list) list.classList.remove("drag-over");
  });

  list.addEventListener("drop", (event) => {
    event.preventDefault();
    list.classList.remove("drag-over");

    const targetStatus = list.dataset.status;
    if (!draggedId || draggedFromStatus == null) return;

    // Remove from source array
    const taskIndex = state[draggedFromStatus].findIndex((t) => t.id === draggedId);
    if (taskIndex === -1) return;
    const [task] = state[draggedFromStatus].splice(taskIndex, 1);

    // Insert into target array at the position reflected in the DOM
    const domCards = [...list.querySelectorAll(".card")];
    const newIndex = domCards.findIndex((el) => el.dataset.id === draggedId);
    const insertAt = newIndex === -1 ? state[targetStatus].length : newIndex;
    state[targetStatus].splice(insertAt, 0, task);

    saveState();
    renderColumn(draggedFromStatus);
    renderColumn(targetStatus);
  });
});

/**
 * Finds the card element a dragged card should be inserted before,
 * based on vertical cursor position — gives a smooth "slot in" feel
 * instead of always appending to the end of the column.
 */
function getDragAfterElement(container, y) {
  const draggableCards = [...container.querySelectorAll(".card:not(.is-dragging)")];

  return draggableCards.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    },
    { offset: Number.NEGATIVE_INFINITY, element: null }
  ).element;
}

// ---------- Init ----------
renderAll();