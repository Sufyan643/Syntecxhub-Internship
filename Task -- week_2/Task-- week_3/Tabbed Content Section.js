// ============ Tabbed Content Section logic ============

document.addEventListener('DOMContentLoaded', function () {

  const tabButtons  = Array.from(document.querySelectorAll('.tab-btn'));
  const tabPanels   = Array.from(document.querySelectorAll('.tab-panel'));
  const indicator    = document.getElementById('tabIndicator');
  const tabNav        = document.getElementById('tabNav');

  function moveIndicatorTo(button) {
    const navRect = tabNav.getBoundingClientRect();
    const btnRect = button.getBoundingClientRect();
    indicator.style.left  = (btnRect.left - navRect.left) + 'px';
    indicator.style.width = btnRect.width + 'px';
  }

  function activateTab(targetId, button) {
    // buttons
    tabButtons.forEach(function (btn) { btn.classList.remove('is-active'); });
    button.classList.add('is-active');

    // panels
    tabPanels.forEach(function (panel) {
      panel.classList.toggle('is-active', panel.id === targetId);
    });

    moveIndicatorTo(button);
  }

  tabButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      activateTab(button.dataset.tab, button);
    });

    // basic keyboard support: left/right arrow moves between tabs
    button.addEventListener('keydown', function (e) {
      const currentIdx = tabButtons.indexOf(button);
      let nextIdx = null;
      if (e.key === 'ArrowRight') nextIdx = (currentIdx + 1) % tabButtons.length;
      if (e.key === 'ArrowLeft')  nextIdx = (currentIdx - 1 + tabButtons.length) % tabButtons.length;
      if (nextIdx !== null) {
        tabButtons[nextIdx].focus();
        activateTab(tabButtons[nextIdx].dataset.tab, tabButtons[nextIdx]);
      }
    });
  });

  // position the indicator correctly on first load
  const initialActive = document.querySelector('.tab-btn.is-active') || tabButtons[0];
  moveIndicatorTo(initialActive);

  // keep the indicator aligned if the window is resized
  window.addEventListener('resize', function () {
    const activeBtn = document.querySelector('.tab-btn.is-active');
    if (activeBtn) moveIndicatorTo(activeBtn);
  });
});