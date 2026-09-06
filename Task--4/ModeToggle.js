/* ============================================================
   Daybreak — script.js
   Applies and persists the dark/light theme, defaulting to
   the visitor's system preference on first visit.
   ============================================================ */

const STORAGE_KEY = "daybreak_theme";

const root = document.documentElement;
const themeSwitch = document.getElementById("themeSwitch");
const brandMark = document.getElementById("brandMark");
const eyebrow = document.getElementById("eyebrow");

// ---------- Apply a theme ----------
function applyTheme(mode) {
  root.setAttribute("data-theme", mode);
  themeSwitch.setAttribute("aria-checked", mode === "dark");

  brandMark.innerHTML = mode === "dark" ? "&#9789;" : "&#9728;";
  eyebrow.textContent =
    mode === "dark" ? "Currently reading under the stars" : "Currently reading in daylight";
}

function setTheme(mode) {
  applyTheme(mode);
  localStorage.setItem(STORAGE_KEY, mode);
}

// ---------- Determine initial theme ----------
function getInitialTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;

  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return systemPrefersDark ? "dark" : "light";
}

// ---------- Toggle handler ----------
themeSwitch.addEventListener("click", () => {
  const current = root.getAttribute("data-theme");
  setTheme(current === "dark" ? "light" : "dark");
});

// Allow toggling with the keyboard (Enter / Space) — native <button> already
// supports this, but we also expose it as role="switch" for screen readers.
themeSwitch.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    themeSwitch.click();
  }
});

// If the user hasn't chosen a theme yet, follow system changes live.
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
  if (localStorage.getItem(STORAGE_KEY)) return; // user has an explicit preference
  applyTheme(event.matches ? "dark" : "light");
});

// ---------- Init ----------
applyTheme(getInitialTheme());