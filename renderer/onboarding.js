// First-run experience: when no project folder is set, show a guided panel
// instead of dropping a beginner into a bare terminal. Once a folder is set
// (or the panel is skipped), the workspace behaves as before, with an empty
// state instead of a blank grid when no sessions are open.
(function () {
  const content = window.BuildCenter.onboardingContent;
  const onboardingEl = document.getElementById('onboarding');
  const workspaceEmptyEl = document.getElementById('workspaceEmpty');

  let configLoaded = false;
  let skipped = false;

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function buildPanel() {
    const card = el('div', 'onboarding-card');

    card.appendChild(el('h1', 'onboarding-title', 'Build a Roblox game with Claude'));
    card.appendChild(
      el(
        'p',
        'onboarding-sub',
        'The loop: Claude Code writes Luau scripts into your project folder, Rojo syncs them into Roblox Studio, and you play test in Studio.'
      )
    );

    const steps = el('ol', 'onboarding-steps');
    content.SETUP_STEPS.forEach((step) => {
      const li = el('li', 'onboarding-step');
      const head = el('div', 'step-head');
      head.appendChild(el('span', 'step-title', step.title));
      if (step.actionLabel) {
        const btn = el('button', 'step-action', step.actionLabel);
        btn.addEventListener('click', () => document.getElementById('btnProjectFolder').click());
        head.appendChild(btn);
      }
      li.appendChild(head);
      li.appendChild(el('p', 'step-detail', step.detail));
      steps.appendChild(li);
    });
    card.appendChild(steps);

    card.appendChild(el('h2', 'onboarding-h2', 'Start from a game idea'));
    const chipHint = el('p', 'chip-hint', 'Click an idea to copy a ready-to-paste Claude prompt.');
    const chips = el('div', 'idea-chips');
    content.GAME_IDEAS.forEach((idea) => {
      const chip = el('button', 'idea-chip', idea.label);
      chip.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(idea.prompt);
          chipHint.textContent =
            'Prompt copied. Set your project folder, click Ask Claude, then paste it into the session.';
          chip.classList.add('copied');
          setTimeout(() => chip.classList.remove('copied'), 1200);
        } catch (err) {
          chipHint.textContent = idea.prompt;
        }
      });
      chips.appendChild(chip);
    });
    card.appendChild(chips);
    card.appendChild(chipHint);

    const columns = el('div', 'onboarding-columns');

    const termsCol = el('div', 'onboarding-col');
    termsCol.appendChild(el('h2', 'onboarding-h2', 'Where things go in Studio'));
    const termsList = el('dl', 'terms-list');
    content.ROBLOX_TERMS.forEach((entry) => {
      termsList.appendChild(el('dt', null, entry.term));
      termsList.appendChild(el('dd', null, entry.tip));
    });
    termsCol.appendChild(termsList);
    columns.appendChild(termsCol);

    const safetyCol = el('div', 'onboarding-col');
    safetyCol.appendChild(el('h2', 'onboarding-h2', 'Server vs client — read this once'));
    const safetyList = el('ul', 'safety-list');
    content.SAFETY_NOTES.forEach((note) => safetyList.appendChild(el('li', null, note)));
    safetyCol.appendChild(safetyList);
    columns.appendChild(safetyCol);

    card.appendChild(columns);

    const skip = el('button', 'onboarding-skip', 'Skip — open a plain terminal instead');
    skip.addEventListener('click', () => {
      skipped = true;
      refresh();
      createPane({ title: 'Terminal' });
    });
    card.appendChild(skip);

    onboardingEl.appendChild(card);
  }

  function buildEmptyState() {
    workspaceEmptyEl.appendChild(el('p', 'empty-main', content.EMPTY_STATES.noSessions));
    const btn = el('button', 'step-action', 'Ask Claude');
    btn.addEventListener('click', () => document.getElementById('btnNewScript').click());
    workspaceEmptyEl.appendChild(btn);
    workspaceEmptyEl.appendChild(el('p', 'empty-hint', content.EMPTY_STATES.noSessionsHint));
  }

  function refresh() {
    const showOnboarding =
      configLoaded &&
      content.shouldShowOnboarding({
        projectFolder: window.BuildCenter.getProjectFolder(),
        skipped,
      });
    onboardingEl.classList.toggle('hidden', !showOnboarding);

    const sessions = window.BuildCenter.getSessions();
    const showEmpty = configLoaded && !showOnboarding && sessions.length === 0;
    workspaceEmptyEl.classList.toggle('hidden', !showEmpty);
  }

  buildPanel();
  buildEmptyState();

  window.BuildCenter.onProjectFolderChanged((folder) => {
    if (!configLoaded) {
      configLoaded = true;
      // Returning users with a configured folder keep the old behavior of a
      // terminal ready on launch; first-run users see the guide instead.
      if (folder) createPane({ title: 'Terminal' });
    }
    refresh();
  });
  window.BuildCenter.onSessionsChanged(refresh);
})();
