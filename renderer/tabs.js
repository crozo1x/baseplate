function initTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  function activateTab(tabName) {
    buttons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    panels.forEach((panel) => {
      panel.classList.toggle('active', panel.id === 'tab' + tabName.charAt(0).toUpperCase() + tabName.slice(1));
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
  });
}

initTabs();
