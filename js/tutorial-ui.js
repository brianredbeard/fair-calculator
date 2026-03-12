/**
 * TutorialUI - DOM rendering for tutorial system
 * Handles inline callouts, chapter bar, and factor highlighting
 */

/**
 * Render the chapter bar with navigation controls
 * @param {HTMLElement} container - Parent container (#input-panel)
 * @param {Object} chapterData - Current chapter info
 * @param {Object} callbacks - Event handlers {onPrev, onNext, onExit, onChapterClick}
 * @param {Object} tutorialData - Full tutorial data for title and chapter count
 */
export function renderChapterBar(container, chapterData, callbacks, tutorialData, i18n) {
  // Remove existing chapter bar if any
  const existing = container.querySelector('.tutorial-chapter-bar');
  if (existing) {
    existing.remove();
  }

  const bar = document.createElement('div');
  bar.className = 'tutorial-chapter-bar';
  bar.setAttribute('role', 'navigation');
  bar.setAttribute('aria-label', i18n ? i18n.t('tutorial.aria_label') : 'Tutorial navigation');

  // Create bar content
  bar.innerHTML = `
    <div class="tutorial-chapter-bar-content">
      <div class="tutorial-chapter-header">
        <div class="tutorial-title">${tutorialData.title}</div>
        <div class="tutorial-subtitle">${chapterData.chapterTitle}</div>
      </div>
      <div class="tutorial-chapter-progress">
        <button class="tutorial-nav-btn tutorial-prev-btn" aria-label="${i18n ? i18n.t('tutorial.prev') : 'Previous step'}">
          <span aria-hidden="true">${document.documentElement.dir === 'rtl' ? '→' : '←'}</span>
        </button>
        <div class="tutorial-step-counter">
          <span class="tutorial-step-current">${chapterData.stepInChapter}</span>
          <span class="tutorial-step-divider">/</span>
          <span class="tutorial-step-total">${chapterData.totalStepsInChapter}</span>
        </div>
        <button class="tutorial-nav-btn tutorial-next-btn" aria-label="${i18n ? i18n.t('tutorial.next') : 'Next step'}">
          <span aria-hidden="true">${document.documentElement.dir === 'rtl' ? '←' : '→'}</span>
        </button>
      </div>
      <div class="tutorial-chapter-dots">
        ${renderChapterDots(tutorialData.chapters.length, chapterData.chapterIndex, i18n)}
      </div>
      <button class="tutorial-exit-btn" aria-label="${i18n ? i18n.t('tutorial.exit') : 'Exit tutorial'}">
        ✕
      </button>
    </div>
  `;

  // Wire up event listeners
  bar.querySelector('.tutorial-prev-btn').addEventListener('click', callbacks.onPrev);
  bar.querySelector('.tutorial-next-btn').addEventListener('click', callbacks.onNext);
  bar.querySelector('.tutorial-exit-btn').addEventListener('click', callbacks.onExit);

  // Wire up chapter dot clicks
  bar.querySelectorAll('.tutorial-chapter-dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      const chapterIndex = parseInt(e.currentTarget.dataset.chapter, 10);
      callbacks.onChapterClick(chapterIndex);
    });
  });

  // Insert bar before .factor-tree
  const factorTree = container.querySelector('.factor-tree');
  if (factorTree) {
    container.insertBefore(bar, factorTree);
  } else {
    container.prepend(bar);
  }
}

/**
 * Render chapter progress dots
 */
function renderChapterDots(totalChapters, currentChapter, i18n) {
  const dots = [];
  for (let i = 0; i < totalChapters; i++) {
    const active = i === currentChapter ? 'active' : '';
    const label = i18n ? i18n.t('tutorial.chapter', { n: i + 1 }) : `Chapter ${i + 1}`;
    dots.push(`
      <button
        class="tutorial-chapter-dot ${active}"
        data-chapter="${i}"
        aria-label="${label}"
        aria-current="${i === currentChapter ? 'true' : 'false'}"
      ></button>
    `);
  }
  return dots.join('');
}

/**
 * Render an inline callout below a factor
 * @param {HTMLElement} factorEl - The factor element ([data-factor-id])
 * @param {Object} stepData - Current step data
 */
export function renderCallout(factorEl, stepData, i18n) {
  if (!factorEl) return;

  // Remove ALL existing callouts (previous steps leave theirs behind)
  document.querySelectorAll('.tutorial-callout').forEach(el => el.remove());
  // Remove all highlights from previous steps
  document.querySelectorAll('.tutorial-active').forEach(el => el.classList.remove('tutorial-active'));

  const callout = document.createElement('div');
  callout.className = 'tutorial-callout';
  callout.setAttribute('role', 'article');
  callout.setAttribute('aria-label', i18n ? i18n.t('tutorial.callout_label') : 'Tutorial guidance');

  let html = '';

  // Narrative section (always present)
  if (stepData.narrative) {
    html += `
      <div class="tutorial-callout-section">
        <p class="tutorial-narrative">${stepData.narrative}</p>
      </div>
    `;
  }

  // "In This Scenario" section (gold header)
  if (stepData.scenarioContext) {
    const header = i18n ? i18n.t('tutorial.scenario_header') : 'In This Scenario';
    html += `
      <div class="tutorial-callout-section tutorial-scenario-section">
        <h3 class="tutorial-section-header tutorial-header-gold">${header}</h3>
        <p>${stepData.scenarioContext}</p>
      </div>
    `;
  }

  // "Why These Numbers?" section (blue header)
  if (stepData.whyTheseNumbers) {
    const header = i18n ? i18n.t('tutorial.numbers_header') : 'Why These Numbers?';
    html += `
      <div class="tutorial-callout-section tutorial-numbers-section">
        <h3 class="tutorial-section-header tutorial-header-blue">${header}</h3>
        <p>${stepData.whyTheseNumbers}</p>
      </div>
    `;
  }

  // "Try It" experiment section (green border)
  if (stepData.experiment) {
    const header = i18n ? i18n.t('tutorial.try_it_header') : 'Try It';
    const resetBtnText = i18n ? i18n.t('tutorial.reset_values') : 'Reset Values';
    html += `
      <div class="tutorial-callout-section tutorial-experiment">
        <h3 class="tutorial-section-header tutorial-header-green">${header}</h3>
        <p>${stepData.experiment.prompt}</p>
        <div class="tutorial-experiment-actions">
          <button class="btn-small tutorial-reset-btn" data-reset-after="${stepData.experiment.resetAfter || 'false'}">
            ${resetBtnText}
          </button>
        </div>
      </div>
    `;
  }

  callout.innerHTML = html;

  // Insert callout inside the factor element, right after the description
  // and before the children group — so it stays near the factor header,
  // not buried below all sub-factors.
  const childrenGroup = factorEl.querySelector(':scope > [role="group"]');
  const inputRow = factorEl.querySelector(':scope > .ci-input-row, :scope > .pert-input-row');
  if (childrenGroup) {
    factorEl.insertBefore(callout, childrenGroup);
  } else if (inputRow) {
    inputRow.after(callout);
  } else {
    factorEl.appendChild(callout);
  }
}

/**
 * Render a results callout in the results panel (Chapter 4)
 * @param {HTMLElement} resultsPanel - The #results-panel element
 * @param {Object} stepData - Current step data
 */
export function renderResultsCallout(resultsPanel, stepData, i18n) {
  // Remove ALL existing callouts (input panel + results panel)
  document.querySelectorAll('.tutorial-callout').forEach(el => el.remove());
  document.querySelectorAll('.tutorial-active').forEach(el => el.classList.remove('tutorial-active'));

  const callout = document.createElement('div');
  callout.className = 'tutorial-callout tutorial-results-callout';
  callout.setAttribute('role', 'article');
  callout.setAttribute('aria-label', i18n ? i18n.t('tutorial.callout_label') : 'Tutorial guidance');

  let html = '';

  if (stepData.narrative) {
    html += `
      <div class="tutorial-callout-section">
        <p class="tutorial-narrative">${stepData.narrative}</p>
      </div>
    `;
  }

  if (stepData.scenarioContext) {
    const header = i18n ? i18n.t('tutorial.scenario_header') : 'In This Scenario';
    html += `
      <div class="tutorial-callout-section tutorial-scenario-section">
        <h3 class="tutorial-section-header tutorial-header-gold">${header}</h3>
        <p>${stepData.scenarioContext}</p>
      </div>
    `;
  }

  if (stepData.whyTheseNumbers) {
    const header = i18n ? i18n.t('tutorial.numbers_header') : 'Why These Numbers?';
    html += `
      <div class="tutorial-callout-section tutorial-numbers-section">
        <h3 class="tutorial-section-header tutorial-header-blue">${header}</h3>
        <p>${stepData.whyTheseNumbers}</p>
      </div>
    `;
  }

  callout.innerHTML = html;

  // Insert before #chart-curve or at start of results panel
  const chartCurve = resultsPanel.querySelector('#chart-curve');
  if (chartCurve) {
    resultsPanel.insertBefore(callout, chartCurve);
  } else {
    resultsPanel.prepend(callout);
  }
}

/**
 * Highlight a specific factor and dim others
 * @param {string} factorId - The factor ID to highlight
 */
export function highlightFactor(factorId) {
  // Remove all existing highlights
  document.querySelectorAll('.tutorial-active').forEach(el => {
    el.classList.remove('tutorial-active');
  });

  // Highlight the target factor
  const factorEl = document.querySelector(`[data-factor-id="${factorId}"]`);
  if (factorEl) {
    factorEl.classList.add('tutorial-active');

    // Scroll into view
    factorEl.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest'
    });
  }
}

/**
 * Clear all tutorial UI elements
 */
export function clearAllTutorialUI() {
  // Remove chapter bar
  document.querySelectorAll('.tutorial-chapter-bar').forEach(el => el.remove());

  // Remove all callouts
  document.querySelectorAll('.tutorial-callout').forEach(el => el.remove());

  // Remove all highlights
  document.querySelectorAll('.tutorial-active').forEach(el => {
    el.classList.remove('tutorial-active');
  });
}
