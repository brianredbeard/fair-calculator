import { FAIR } from './fair-model.js';
import { loadI18n } from './i18n.js';
import { FactorTreeUI } from './tree-ui.js';
import { encodeStateToHash, decodeStateFromHash, ScenarioStore, SettingsStore } from './state.js';
import { EXAMPLE_SCENARIOS } from './examples.js';
import { TutorialEngine } from './tutorial-engine.js';
import { getTutorial, hasTutorial, getTutorialIdByScenarioIndex } from './tutorials/index.js';

let i18n;
let treeUI;
let worker;
let debounceTimer;
let echartsCurve;
let useLogScale = true; // Default to log scale (industry standard for FAIR)
let lastSimResults = null; // Cache for re-rendering on scale toggle
let currentScenarioId = null;
let settings = {}; // Global settings (pertLambda, etc.)
let tutorialEngine = null;
const store = new ScenarioStore();
const settingsStore = new SettingsStore();

// Color palette for category breakdown bars
const colors = [
  '#8e44ad', // purple
  '#2980b9', // blue
  '#27ae60', // green
  '#f39c12', // yellow
  '#e74c3c', // red
  '#16a085', // teal
  '#c0392b', // dark red
  '#2c3e50'  // dark blue
];

/**
 * Initialize the application
 */
async function init() {
  // Load language settings
  const savedLang = localStorage.getItem('fair-calc-lang') || 'en';
  document.documentElement.lang = savedLang;
  document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';

  // Load i18n
  i18n = await loadI18n(savedLang);

  // Translate static UI elements
  translateUI();

  // Setup language selector
  const langSelect = document.getElementById('language-select');
  if (langSelect) {
    langSelect.value = savedLang;
    langSelect.addEventListener('change', (e) => {
      localStorage.setItem('fair-calc-lang', e.target.value);
      window.location.reload();
    });
  }

  // Load settings
  settings = settingsStore.load();
  initSettingsModal();

  // Check URL hash for shared state
  const hash = window.location.hash.slice(1);
  let initialState = null;
  let decodedState = null;
  if (hash) {
    const decoded = decodeStateFromHash(hash);
    if (decoded && decoded.factors) {
      initialState = decoded.factors;
      decodedState = decoded;
      // Set scenario name if provided
      if (decoded.name) {
        document.getElementById('scenario-name').value = decoded.name;
      }
      // Set iterations if provided
      if (decoded.iterations) {
        document.getElementById('iterations-input').value = decoded.iterations;
      }
    }
  }

  // Initialize FactorTreeUI
  const inputPanel = document.getElementById('input-panel');
  treeUI = new FactorTreeUI(inputPanel, FAIR.tree, onInputChange, i18n);

  // If we have initial state from URL, restore it
  if (initialState) {
    treeUI.setState(initialState);
    // Restore inputMode if provided (for PERT scenarios shared via URL)
    if (decodedState.inputMode) {
      treeUI.setInputMode(decodedState.inputMode);
      updateInputModeButton(decodedState.inputMode);
    }
  }

  // Initialize ECharts for the exceedance curve only (breakdown uses CSS bars)
  const curveContainer = document.getElementById('chart-curve');
  echartsCurve = window.echarts.init(curveContainer);

  // Wire event listeners
  document.getElementById('scenario-name').addEventListener('input', onInputChange);
  document.getElementById('iterations-input').addEventListener('change', onInputChange);
  document.getElementById('btn-theme').addEventListener('click', cycleTheme);
  document.getElementById('btn-copy-url').addEventListener('click', copyURL);
  document.getElementById('btn-generate-report').addEventListener('click', generateReport);
  document.getElementById('btn-export-png').addEventListener('click', () => exportChart('png'));
  document.getElementById('btn-export-svg').addEventListener('click', () => exportChart('svg'));
  document.getElementById('btn-save-scenario').addEventListener('click', saveScenario);
  document.getElementById('btn-scenarios').addEventListener('click', toggleScenariosDropdown);
  document.getElementById('btn-new-scenario').addEventListener('click', newScenario);
  document.getElementById('btn-load-examples').addEventListener('click', loadExamples);
  document.getElementById('btn-clear-examples').addEventListener('click', clearExamples);
  document.getElementById('btn-export-json').addEventListener('click', exportJSON);
  document.getElementById('btn-import-json').addEventListener('click', importJSON);
  document.getElementById('import-json-input').addEventListener('change', handleJSONImport);

  // Scale toggle
  document.getElementById('btn-log-scale').addEventListener('click', () => setScale(true));
  document.getElementById('btn-linear-scale').addEventListener('click', () => setScale(false));

  // Input mode toggle
  document.getElementById('btn-ci-mode').addEventListener('click', () => {
    if (treeUI.inputMode !== 'ci') {
      treeUI.setInputMode('ci');
      updateInputModeButton('ci');
      onInputChange();
    }
  });
  document.getElementById('btn-pert-mode').addEventListener('click', () => {
    if (treeUI.inputMode !== 'pert') {
      treeUI.setInputMode('pert');
      updateInputModeButton('pert');
      onInputChange();
    }
  });

  // Settings modal
  document.getElementById('btn-settings').addEventListener('click', openSettingsModal);
  document.getElementById('btn-close-settings').addEventListener('click', closeSettingsModal);

  // Setup responsive toggle
  setupResponsiveToggle();

  // Handle window resize
  window.addEventListener('resize', () => {
    if (echartsCurve) {
      echartsCurve.resize();
    }
    // Breakdown uses CSS bars, no resize needed
  });

  // Render scenarios list
  renderScenariosList();

  // Resume tutorial if session exists
  const tutorialProgress = sessionStorage.getItem('tutorial-progress');
  if (tutorialProgress) {
    try {
      const { tutorialId, chapterIndex, stepIndex } = JSON.parse(tutorialProgress);
      await startTutorial(tutorialId, chapterIndex, stepIndex);
      showToast(i18n ? i18n.t('tutorial.resumed') : 'Tutorial resumed');
    } catch (err) {
      console.warn('Failed to resume tutorial:', err);
      sessionStorage.removeItem('tutorial-progress');
    }
  }

  // Run initial simulation
  runSimulation();
}

/**
 * Translate static UI elements in the DOM
 */
function translateUI() {
  // Top bar
  document.querySelector('.app-title').textContent = i18n.t('app.title');
  document.querySelector('.app-subtitle').textContent = i18n.t('app.subtitle');
  document.getElementById('scenario-name').placeholder = i18n.t('topbar.new_scenario');
  document.getElementById('btn-save-scenario').textContent = i18n.t('topbar.save');
  document.getElementById('btn-save-scenario').setAttribute('aria-label', i18n.t('topbar.save'));
  
  const iterLabel = document.querySelector('.iterations-label');
  if (iterLabel) {
    iterLabel.firstChild.textContent = i18n.t('topbar.iterations') + ' ';
  }
  
  document.getElementById('btn-settings').textContent = '⚙️ ' + i18n.t('topbar.settings');
  document.getElementById('btn-copy-url').textContent = i18n.t('topbar.copy_url');
  document.getElementById('btn-generate-report').textContent = i18n.t('topbar.report');
  document.getElementById('btn-scenarios').textContent = i18n.t('topbar.scenarios') + ' ▾';
  
  // Results
  document.querySelectorAll('.section-title')[0].textContent = i18n.t('results.chart_title');
  document.querySelectorAll('.section-title')[1].textContent = i18n.t('results.stats_title');
  const breakdownTitle = document.querySelector('#breakdown-section .section-title');
  if (breakdownTitle) breakdownTitle.textContent = i18n.t('results.breakdown_title');
  
  document.getElementById('btn-log-scale').textContent = i18n.t('results.log_scale');
  document.getElementById('btn-linear-scale').textContent = i18n.t('results.linear_scale');
  document.getElementById('btn-export-png').textContent = i18n.t('export.png');
  document.getElementById('btn-export-svg').textContent = i18n.t('export.svg');
  
  // Scenarios dropdown
  document.getElementById('btn-new-scenario').textContent = '+ ' + i18n.t('scenarios.new');
  document.getElementById('btn-load-examples').textContent = i18n.t('scenarios.load_examples');
  document.getElementById('btn-clear-examples').textContent = i18n.t('scenarios.clear_examples');
  document.getElementById('btn-export-json').textContent = i18n.t('scenarios.export_json');
  document.getElementById('btn-import-json').textContent = i18n.t('scenarios.import_json');
  
  // Settings modal
  document.getElementById('settings-title').textContent = i18n.t('topbar.settings');
  document.querySelector('.setting-label').firstChild.textContent = 'PERT Lambda (λ)'; // Keep λ as it's a math symbol
  
  // Responsive toggle
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  if (toggleBtns.length >= 2) {
    toggleBtns[0].textContent = i18n.t('responsive.inputs_label');
    toggleBtns[1].textContent = i18n.t('responsive.results_label');
  }

  // Skip nav
  document.getElementById('skip-nav').textContent = i18n.t('skip_nav');
}

/**
 * Handle input changes with debouncing
 */
function onInputChange() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    updateURLHash();
    runSimulation();
  }, 300);
}

/**
 * Run Monte Carlo simulation
 */
function runSimulation() {
  // Terminate existing worker if running
  if (worker) {
    worker.terminate();
  }

  // Get current state
  const iterations = parseInt(document.getElementById('iterations-input').value, 10);
  const factors = treeUI.getState();

  // Show simulating indicator
  document.getElementById('simulating-indicator').hidden = false;
  document.getElementById('results-content').style.opacity = '0.5';

  // Create new worker
  worker = new Worker('./js/worker.js');

  worker.onmessage = (e) => {
    const data = e.data;
    if (data.type === 'error') {
      console.error('Simulation error:', data.message);
      alert(`Simulation error: ${data.message}`);
      document.getElementById('simulating-indicator').hidden = true;
      document.getElementById('results-content').style.opacity = '1';
      return;
    }

    if (data.type === 'results') {
      renderResults(data);
      document.getElementById('simulating-indicator').hidden = true;
      document.getElementById('results-content').style.opacity = '1';
    }
  };

  worker.onerror = (err) => {
    console.error('Worker error:', err);
    alert('Simulation failed. Check console for details.');
    document.getElementById('simulating-indicator').hidden = true;
    document.getElementById('results-content').style.opacity = '1';
  };

  // Send message to worker
  worker.postMessage({ iterations, factors, settings });
}

/**
 * Render simulation results
 */
function renderResults(data) {
  lastSimResults = data; // Cache for scale toggle re-render
  const { sortedALE, stats, categoryBreakdown } = data;

  renderStats(stats);
  renderExceedanceCurve(sortedALE, stats);

  if (categoryBreakdown && Object.keys(categoryBreakdown).length > 0) {
    renderCategoryBreakdown(categoryBreakdown);
    document.getElementById('breakdown-section').hidden = false;
  } else {
    document.getElementById('breakdown-section').hidden = true;
  }
}

/**
 * Toggle between log and linear scale, re-render without re-simulating
 */
function setScale(log) {
  useLogScale = log;
  document.getElementById('btn-log-scale').classList.toggle('active', log);
  document.getElementById('btn-log-scale').setAttribute('aria-pressed', String(log));
  document.getElementById('btn-linear-scale').classList.toggle('active', !log);
  document.getElementById('btn-linear-scale').setAttribute('aria-pressed', String(!log));
  if (lastSimResults) {
    renderExceedanceCurve(lastSimResults.sortedALE, lastSimResults.stats);
  }
}

/**
 * Update input mode button states (active class and aria-pressed)
 */
function updateInputModeButton(mode) {
  const ciBtn = document.getElementById('btn-ci-mode');
  const pertBtn = document.getElementById('btn-pert-mode');

  if (mode === 'ci') {
    ciBtn.classList.add('active');
    ciBtn.setAttribute('aria-pressed', 'true');
    pertBtn.classList.remove('active');
    pertBtn.setAttribute('aria-pressed', 'false');
  } else {
    pertBtn.classList.add('active');
    pertBtn.setAttribute('aria-pressed', 'true');
    ciBtn.classList.remove('active');
    ciBtn.setAttribute('aria-pressed', 'false');
  }
}

/**
 * Initialize settings modal controls
 */
function initSettingsModal() {
  const modal = document.getElementById('settings-modal');
  const slider = document.getElementById('lambda-slider');
  const input = document.getElementById('lambda-input');

  // Set initial values from loaded settings
  slider.value = settings.pertLambda;
  input.value = settings.pertLambda;

  // Sync slider and input
  slider.addEventListener('input', (e) => {
    input.value = e.target.value;
  });

  input.addEventListener('input', (e) => {
    slider.value = e.target.value;
  });

  // Save and re-simulate on change
  const saveAndSimulate = () => {
    settings.pertLambda = parseFloat(input.value);
    settingsStore.save(settings);
    onInputChange();
  };

  slider.addEventListener('change', saveAndSimulate);
  input.addEventListener('change', saveAndSimulate);

  // Close on Escape
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSettingsModal();
    }
  });

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeSettingsModal();
    }
  });
}

/**
 * Open settings modal
 */
function openSettingsModal() {
  const modal = document.getElementById('settings-modal');
  modal.showModal();
}

/**
 * Close settings modal
 */
function closeSettingsModal() {
  const modal = document.getElementById('settings-modal');
  modal.close();
}

/**
 * Render summary statistics cards
 */
function renderStats(stats) {
  const statsCards = document.getElementById('stats-cards');
  statsCards.innerHTML = '';

  const metrics = [
    { label: i18n.t('results.stats.min'), value: stats.min },
    { label: i18n.t('results.stats.mean'), value: stats.mean },
    { label: i18n.t('results.stats.median'), value: stats.median },
    { label: i18n.t('results.stats.p90'), value: stats.p90 },
    { label: i18n.t('results.stats.max'), value: stats.max }
  ];

  metrics.forEach(metric => {
    const card = document.createElement('div');
    card.className = 'stat-card';

    const labelEl = document.createElement('div');
    labelEl.className = 'stat-label';
    labelEl.textContent = metric.label;

    const valueEl = document.createElement('div');
    valueEl.className = 'stat-value';
    valueEl.textContent = i18n.formatCompactCurrency(metric.value);

    card.appendChild(labelEl);
    card.appendChild(valueEl);
    statsCards.appendChild(card);
  });
}

/**
 * Get theme color from CSS custom property
 */
function getThemeColor(varName, fallback) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return value || fallback;
}

/**
 * Render loss exceedance curve
 */
function renderExceedanceCurve(sortedALE, stats) {
  // Filter out zero values for log scale (log(0) is undefined)
  const nonZeroALE = sortedALE.filter(v => v > 0);
  const sourceData = useLogScale ? nonZeroALE : sortedALE;

  // Downsample to ~200 points for performance
  const step = Math.max(1, Math.floor(sourceData.length / 200));
  const dataPoints = [];

  for (let i = 0; i < sourceData.length; i += step) {
    const loss = sourceData[i];
    const exceedanceProbability = 1 - (i / sourceData.length);
    dataPoints.push([loss, exceedanceProbability]);
  }

  // Always include the last point
  if (dataPoints.length > 0 && dataPoints[dataPoints.length - 1][0] !== sourceData[sourceData.length - 1]) {
    dataPoints.push([sourceData[sourceData.length - 1], 0]);
  }

  const scaleLabel = useLogScale ? `${i18n.t('results.axis.x')} — Log Scale` : i18n.t('results.axis.x');

  const option = {
    backgroundColor: 'transparent',
    textStyle: {
      color: getThemeColor('--color-text', '#e0e0e0')
    },
    grid: {
      left: '80',
      right: '40',
      top: '40',
      bottom: '60'
    },
    xAxis: {
      type: useLogScale ? 'log' : 'value',
      name: scaleLabel,
      nameLocation: 'middle',
      nameGap: 30,
      axisLabel: {
        formatter: (value) => i18n.formatCompactCurrency(value)
      },
      axisLine: {
        lineStyle: {
          color: getThemeColor('--color-border', '#444')
        }
      }
    },
    yAxis: {
      type: 'value',
      name: i18n.t('results.axis.y'),
      nameLocation: 'middle',
      nameGap: 50,
      min: 0,
      max: 1,
      axisLabel: {
        formatter: (value) => (value * 100).toFixed(0) + '%'
      },
      axisLine: {
        lineStyle: {
          color: getThemeColor('--color-border', '#444')
        }
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const point = params[0];
        const loss = point.value[0];
        const prob = point.value[1];
        return `Loss: ${i18n.formatCurrency(loss)}<br/>Exceedance: ${(prob * 100).toFixed(1)}%`;
      }
    },
    series: [
      {
        type: 'line',
        data: dataPoints,
        smooth: false,
        symbol: 'none',
        lineStyle: {
          color: getThemeColor('--color-accent', '#00d4ff'),
          width: 2
        },
        markLine: {
          symbol: 'none',
          lineStyle: {
            type: 'dashed',
            width: 1
          },
          data: [
            [{
              name: i18n.t('results.stats.median'),
              xAxis: stats.median,
              yAxis: 'max',
              label: {
                show: true,
                position: 'start',
                formatter: () => `${i18n.t('results.stats.median')}: ${i18n.formatCompactCurrency(stats.median)}`,
                fontSize: 11,
                padding: [3, 6],
                backgroundColor: 'rgba(124, 232, 140, 0.85)',
                color: '#000',
                borderRadius: 3,
                distance: 5
              },
              lineStyle: { color: '#7ce88c' }
            }, {
              xAxis: stats.median,
              yAxis: 'min',
              label: { show: false },
              lineStyle: { color: '#7ce88c' }
            }],
            [{
              name: i18n.t('results.stats.p90'),
              xAxis: stats.p90,
              yAxis: 0.5,
              label: {
                show: true,
                position: 'start',
                formatter: () => `${i18n.t('results.stats.p90')}: ${i18n.formatCompactCurrency(stats.p90)}`,
                fontSize: 11,
                padding: [3, 6],
                backgroundColor: 'rgba(232, 124, 124, 0.85)',
                color: '#fff',
                borderRadius: 3,
                distance: 5
              },
              lineStyle: { color: '#e87c7c' }
            }, {
              xAxis: stats.p90,
              yAxis: 'min',
              label: { show: false },
              lineStyle: { color: '#e87c7c' }
            }]
          ]
        }
      }
    ]
  };

  echartsCurve.setOption(option, { notMerge: true });
}

/**
 * Render category breakdown as pure CSS bars + table (no ECharts)
 */
function renderCategoryBreakdown(breakdown) {
  const lmMean = breakdown.lm || 1;
  
  // Filter to show only the most granular nodes available to avoid double-counting
  // If children are present, don't show the parent.
  const categoriesToShow = Object.keys(breakdown).filter(id => {
    if (id === 'lm') return false; // Don't show the total itself in the breakdown rows
    if (id === 'primary' && (breakdown.productivity || breakdown.response || breakdown.replacement)) return false;
    if (id === 'slm' && (breakdown.reputation || breakdown.competitive || breakdown.fines)) return false;
    if (id === 'secondary' && breakdown.slm) return false;
    return true;
  });

  const categories = categoriesToShow
    .map(id => ({ category: id, value: breakdown[id] }))
    .sort((a, b) => b.value - a.value);

  const maxValue = categories.length > 0 ? categories[0].value : 1;

  // Render bars + table combined
  const tableBody = document.getElementById('breakdown-table');
  tableBody.innerHTML = '';

  categories.forEach((item, idx) => {
    const pct = ((item.value / lmMean) * 100).toFixed(1);
    const barWidth = maxValue > 0 ? ((item.value / maxValue) * 100).toFixed(1) : '0';
    const color = colors[idx % colors.length];
    const name = formatCategoryName(item.category);

    const row = document.createElement('tr');
    row.className = 'breakdown-row';

    row.innerHTML = `
      <td class="breakdown-name">${name}</td>
      <td class="breakdown-bar-cell">
        <div class="breakdown-bar" style="width:${barWidth}%;background:${color}"></div>
      </td>
      <td class="breakdown-value">${i18n.formatCompactCurrency(item.value)}</td>
      <td class="breakdown-pct">${pct}%</td>
    `;

    tableBody.appendChild(row);
  });
}

/**
 * Format category name for display
 */
function formatCategoryName(category) {
  return i18n.t(`factor.${category}`);
}

/**
 * Get current full state (factors + metadata)
 */
function getCurrentFullState() {
  return {
    name: document.getElementById('scenario-name').value || 'Untitled Scenario',
    iterations: parseInt(document.getElementById('iterations-input').value, 10),
    inputMode: treeUI.inputMode,
    factors: treeUI.getState()
  };
}

/**
 * Update URL hash with current state
 */
function updateURLHash() {
  const state = getCurrentFullState();
  const hash = encodeStateToHash(state);
  window.history.replaceState(null, '', `#${hash}`);
}

/**
 * Explicitly save current scenario to localStorage
 */
function saveScenario() {
  const state = getCurrentFullState();
  if (currentScenarioId) {
    store.save(state, currentScenarioId);
  } else {
    currentScenarioId = store.save(state);
  }
  renderScenariosList();

  // Brief visual feedback on the save button
  const btn = document.getElementById('btn-save-scenario');
  btn.textContent = 'Saved!';
  setTimeout(() => { btn.textContent = 'Save'; }, 1500);
}

/**
 * Toggle scenarios dropdown
 */
function toggleScenariosDropdown() {
  const dropdown = document.getElementById('scenarios-dropdown');
  dropdown.hidden = !dropdown.hidden;
}

/**
 * Render scenarios list
 */
function renderScenariosList() {
  const listEl = document.getElementById('scenarios-list');
  listEl.innerHTML = '';

  const scenarios = store.list();

  if (scenarios.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'scenarios-empty';
    emptyMsg.textContent = 'No saved scenarios';
    listEl.appendChild(emptyMsg);

    // Show Load Examples button when list is empty
    document.getElementById('btn-load-examples').hidden = false;
    document.getElementById('btn-clear-examples').hidden = true;
    return;
  }

  let hasExamples = false;

  scenarios.forEach(scenario => {
    const fullScenario = store.load(scenario.id);
    const isExample = fullScenario && fullScenario._isExample;

    if (isExample) {
      hasExamples = true;
    }

    const item = document.createElement('div');
    item.className = 'scenario-item';
    if (scenario.id === currentScenarioId) {
      item.classList.add('active');
    }

    const nameEl = document.createElement('span');
    nameEl.className = 'scenario-name';
    nameEl.textContent = scenario.name;

    // For example scenarios, find the scenario index and check for tutorial
    let scenarioIndex = -1;
    if (isExample) {
      scenarioIndex = EXAMPLE_SCENARIOS.findIndex(s => s.name === scenario.name);

      // Add example badge
      const badge = document.createElement('span');
      badge.className = 'example-badge';
      badge.textContent = 'Example';
      nameEl.appendChild(document.createTextNode(' '));
      nameEl.appendChild(badge);
    } else {
      // Non-example scenarios use single-click to load
      nameEl.addEventListener('click', () => loadScenario(scenario.id));
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'scenario-delete';
    deleteBtn.textContent = '×';
    deleteBtn.setAttribute('aria-label', `Delete ${scenario.name}`);
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`Delete scenario "${scenario.name}"?`)) {
        store.remove(scenario.id);
        if (currentScenarioId === scenario.id) {
          currentScenarioId = null;
        }
        renderScenariosList();
      }
    });

    item.appendChild(nameEl);

    // For example scenarios, add Load and Tutorial buttons
    if (isExample && scenarioIndex !== -1) {
      const buttonsDiv = document.createElement('div');
      buttonsDiv.className = 'scenario-buttons';

      const loadBtn = document.createElement('button');
      loadBtn.className = 'btn-small';
      loadBtn.textContent = 'Load';
      loadBtn.addEventListener('click', () => loadScenario(scenario.id));
      buttonsDiv.appendChild(loadBtn);

      // Only show Tutorial button if tutorial exists for this scenario
      if (hasTutorial(scenarioIndex)) {
        const tutorialBtn = document.createElement('button');
        tutorialBtn.className = 'btn-small';
        tutorialBtn.textContent = 'Tutorial';
        tutorialBtn.addEventListener('click', () => {
          const tutorialId = getTutorialIdByScenarioIndex(scenarioIndex);
          if (tutorialId) {
            startTutorial(tutorialId);
          }
        });
        buttonsDiv.appendChild(tutorialBtn);
      }

      item.appendChild(buttonsDiv);
    }

    item.appendChild(deleteBtn);
    listEl.appendChild(item);
  });

  // Toggle Load/Clear Examples buttons based on whether examples exist
  document.getElementById('btn-load-examples').hidden = hasExamples;
  document.getElementById('btn-clear-examples').hidden = !hasExamples;
}

/**
 * Load a scenario by ID
 */
function loadScenario(id) {
  const scenario = store.load(id);
  if (!scenario) {
    return;
  }

  currentScenarioId = id;

  // Restore state
  document.getElementById('scenario-name').value = scenario.name || 'Untitled Scenario';
  document.getElementById('iterations-input').value = scenario.iterations || 10000;

  // Set input mode if scenario specifies it (e.g., examples use 'pert')
  if (scenario.inputMode) {
    treeUI.setInputMode(scenario.inputMode);
    updateInputModeButton(scenario.inputMode);
  }

  treeUI.setState(scenario.factors);

  // Close dropdown
  document.getElementById('scenarios-dropdown').hidden = true;

  // Update URL and run simulation
  updateURLHash();
  runSimulation();
}

/**
 * Create new scenario
 */
function newScenario() {
  currentScenarioId = null;
  document.getElementById('scenario-name').value = 'Untitled Scenario';
  document.getElementById('iterations-input').value = 10000;

  // Reset to default state
  const defaultState = {
    risk: {
      expanded: true,
      children: {
        lef: {
          expanded: false,
          low: FAIR.tree.children[0].defaultLow,
          high: FAIR.tree.children[0].defaultHigh
        },
        lm: {
          expanded: false,
          low: FAIR.tree.children[1].defaultLow,
          high: FAIR.tree.children[1].defaultHigh
        }
      }
    }
  };

  treeUI.setState(defaultState);

  // Close dropdown
  document.getElementById('scenarios-dropdown').hidden = true;

  // Update URL and run simulation
  updateURLHash();
  runSimulation();
}

/**
 * Start a tutorial
 */
async function startTutorial(tutorialId, resumeChapterIndex = null, resumeStepIndex = null) {
  try {
    // Load tutorial data
    const tutorialData = await getTutorial(tutorialId);

    // Apply scenario directly from EXAMPLE_SCENARIOS (bypassing store)
    const scenario = EXAMPLE_SCENARIOS[tutorialData.scenarioIndex];
    if (!scenario) {
      throw new Error(`Scenario not found at index ${tutorialData.scenarioIndex}`);
    }

    document.getElementById('scenario-name').value = scenario.name;
    document.getElementById('iterations-input').value = scenario.iterations || 10000;

    if (scenario.inputMode) {
      treeUI.setInputMode(scenario.inputMode);
      updateInputModeButton(scenario.inputMode);
    }

    treeUI.setState(scenario.factors);
    runSimulation();

    // Snapshot current state for reset functionality
    const originalState = treeUI.getState();

    // Add tutorial-mode class to app
    document.getElementById('app').classList.add('tutorial-mode');

    // Create TutorialEngine
    tutorialEngine = new TutorialEngine(tutorialData, originalState);

    // Wire events
    tutorialEngine.on('step-change', async (stepData) => {
      await treeUI.setTutorialUI(stepData, i18n);

      // Update chapter bar to reflect new step
      renderTutorialChapterBar(stepData);

      // Handle expand action
      if (stepData.action === 'expand' && stepData.factorId !== 'risk') {
        const factorState = getFactorState(treeUI.getState(), stepData.factorId);
        if (factorState && !factorState.expanded) {
          treeUI.toggleExpand(stepData.factorId);
        }
      }
    });

    tutorialEngine.on('chapter-change', (chapterData) => {
      // Mobile: auto-switch to Results view for Chapter 4
      if (chapterData.chapterIndex === 3 && window.innerWidth <= 899) {
        document.getElementById('input-panel').classList.add('mobile-hidden');
        document.getElementById('results-panel').classList.add('mobile-visible');
      }

      // Update chapter bar
      renderTutorialChapterBar(chapterData);
    });

    tutorialEngine.on('tutorial-end', () => {
      stopTutorial();
    });

    // Render chapter bar
    renderTutorialChapterBar({
      chapterIndex: 0,
      chapterTitle: tutorialData.chapters[0].title,
      totalStepsInChapter: tutorialData.chapters[0].steps.length,
      stepInChapter: 1
    });

    // Start or resume tutorial
    if (resumeChapterIndex !== null && resumeStepIndex !== null) {
      tutorialEngine.resumeAt(resumeChapterIndex, resumeStepIndex);
    } else {
      tutorialEngine.start();
    }
  } catch (error) {
    console.error('Failed to start tutorial:', error);
    alert('Failed to load tutorial. Please try again.');
  }
}

/**
 * Render tutorial chapter bar
 */
function renderTutorialChapterBar(chapterData) {
  const inputPanel = document.getElementById('input-panel');

  // Dynamically import tutorial-ui
  import('./tutorial-ui.js').then(({ renderChapterBar }) => {
    renderChapterBar(inputPanel, chapterData, {
      onPrev: () => tutorialEngine.prev(),
      onNext: () => tutorialEngine.next(),
      onExit: () => {
        const confirmMsg = i18n ? i18n.t('tutorial.exit_confirm') : 'Exit tutorial? Your progress will be lost.';
        if (confirm(confirmMsg)) {
          stopTutorial();
        }
      },
      onChapterClick: (chapterIndex) => tutorialEngine.goToChapter(chapterIndex)
    }, tutorialEngine.tutorialData, i18n);
  });
}

/**
 * Stop tutorial and cleanup
 */
function stopTutorial() {
  if (!tutorialEngine) return;

  // Clear tutorial UI
  treeUI.clearTutorialUI();

  // Remove tutorial-mode class
  document.getElementById('app').classList.remove('tutorial-mode');

  // Clear session storage
  sessionStorage.removeItem('tutorial-progress');

  // Cleanup engine
  tutorialEngine = null;

  // Reset mobile view if needed
  document.getElementById('input-panel').classList.remove('mobile-hidden');
  document.getElementById('results-panel').classList.remove('mobile-visible');
}

/**
 * Helper to find factor state by ID in nested state tree
 */
function getFactorState(state, factorId) {
  if (factorId === 'risk') return state.risk;

  const path = getFactorPath(factorId);
  let current = state.risk;

  for (const segment of path) {
    if (current.children && current.children[segment]) {
      current = current.children[segment];
    } else {
      return null;
    }
  }

  return current;
}

/**
 * Get path to factor in tree
 */
function getFactorPath(factorId) {
  const paths = {
    lef: ['lef'],
    tef: ['lef', 'tef'],
    cf: ['lef', 'tef', 'cf'],
    poa: ['lef', 'tef', 'poa'],
    vuln: ['lef', 'vuln'],
    tcap: ['lef', 'vuln', 'tcap'],
    rs: ['lef', 'vuln', 'rs'],
    lm: ['lm'],
    primary: ['lm', 'primary'],
    productivity: ['lm', 'primary', 'productivity'],
    response: ['lm', 'primary', 'response'],
    replacement: ['lm', 'primary', 'replacement'],
    secondary: ['lm', 'secondary'],
    slef: ['lm', 'secondary', 'slef'],
    slm: ['lm', 'secondary', 'slm'],
    reputation: ['lm', 'secondary', 'slm', 'reputation'],
    competitive: ['lm', 'secondary', 'slm', 'competitive'],
    fines: ['lm', 'secondary', 'slm', 'fines']
  };
  return paths[factorId] || [];
}

/**
 * Show a toast notification
 */
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'tutorial-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--bg-secondary);
    border: 1px solid var(--accent-purple);
    color: var(--text-primary);
    padding: 12px 24px;
    border-radius: 6px;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Load example scenarios from examples.js into localStorage
 */
function loadExamples() {
  // Display order: CI tutorials first, then PERT scenarios.
  // Store sorts by lastModified descending, so first items need highest timestamps.
  const displayOrder = [
    16, 17, // SaaS CRM outage (CI)
    18, 19, // Legacy system compromise (CI)
    0, 1,   // External brute force
    2, 3,   // Ransomware outbreak
    4, 5,   // Insider data exfiltration
    6, 7,   // S3 bucket misconfiguration
    8, 9,   // DDoS on public website
    10, 11, // Phishing on back-office
    12, 13, // Cloud KMS compromise
    14, 15, // Physical laptop theft
    20, 21, // Regulatory audit failure
    22, 23  // APT IP theft
  ];
  const now = Date.now();
  displayOrder.forEach((idx, i) => {
    store.save(EXAMPLE_SCENARIOS[idx], null, now + (displayOrder.length - i));
  });
  renderScenariosList();
}

/**
 * Clear all example scenarios (tagged with _isExample)
 */
function clearExamples() {
  store.removeByFlag('_isExample');
  renderScenariosList();
}

/**
 * Export current scenario state as JSON file
 */
function exportJSON() {
  const state = getCurrentFullState();
  const json = JSON.stringify(state, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const scenarioName = state.name || 'Untitled Scenario';
  const sanitizedName = scenarioName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const timestamp = Date.now();
  const filename = `${sanitizedName}_${timestamp}.json`;

  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Import scenario state from JSON file
 */
function importJSON() {
  const input = document.getElementById('import-json-input');
  input.click();
}

/**
 * Handle JSON file selection and import
 */
function handleJSONImport(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);

      // Validate structure
      if (!parsed || typeof parsed !== 'object') {
        alert('Invalid JSON file: not a valid object');
        return;
      }

      if (!parsed.factors || typeof parsed.factors !== 'object') {
        alert('Invalid JSON file: missing "factors" property');
        return;
      }

      // Validate inputMode if present
      if (parsed.inputMode && parsed.inputMode !== 'ci' && parsed.inputMode !== 'pert') {
        alert('Invalid JSON file: inputMode must be "ci" or "pert"');
        return;
      }

      // Restore state following the loadScenario pattern
      if (parsed.name) {
        document.getElementById('scenario-name').value = parsed.name;
      }

      if (parsed.iterations) {
        document.getElementById('iterations-input').value = parsed.iterations;
      }

      if (parsed.inputMode) {
        treeUI.setInputMode(parsed.inputMode);
        updateInputModeButton(parsed.inputMode);
      }

      treeUI.setState(parsed.factors);

      // Close dropdown
      document.getElementById('scenarios-dropdown').hidden = true;

      // Update URL and run simulation
      updateURLHash();
      runSimulation();

    } catch (err) {
      alert(`Failed to import JSON: ${err.message}`);
    }
  };

  reader.readAsText(file);

  // Reset input so same file can be re-imported
  event.target.value = '';
}

/**
 * Copy shareable URL to clipboard
 */
function copyURL() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    const btn = document.getElementById('btn-copy-url');
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy URL:', err);
    alert('Failed to copy URL to clipboard');
  });
}

/**
 * Generate plain-text analysis report stub for Word/Google Docs
 */
function generateReport() {
  const scenarioName = document.getElementById('scenario-name').value || i18n.t('topbar.new_scenario') || 'Untitled Scenario';
  const iterations = document.getElementById('iterations-input').value;
  const inputMode = treeUI.inputMode.toUpperCase();
  const inputModeLabel = inputMode === 'CI' 
    ? (i18n.t('report.mode_ci') === '[missing_report.mode_ci]' ? '2-point Confidence Interval' : i18n.t('report.mode_ci'))
    : (i18n.t('report.mode_pert') === '[missing_report.mode_pert]' ? '3-point PERT estimation' : i18n.t('report.mode_pert'));

  const date = new Date().toLocaleDateString(document.documentElement.lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const state = treeUI.getState();

  const t = (key, fallback) => {
    const val = i18n.t(key);
    return val.startsWith('[missing_') ? fallback : val;
  };

  let report = '';
  report += t('report.title', 'FAIR Risk Analysis Report') + '\n';
  report += '=========================\n';
  report += `${t('report.scenario', 'Scenario')}: ${scenarioName}\n`;
  report += `${t('report.date', 'Date')}: ${date}\n`;
  report += `${t('report.analyst', 'Analyst: [YOUR NAME]')}\n`;
  report += `${t('report.input_mode', 'Input Mode')}: ${inputMode} (${inputModeLabel})\n`;
  report += `${t('report.iterations', 'Iterations')}: ${iterations}\n`;
  report += '\n';
  report += t('report.exec_summary', 'EXECUTIVE SUMMARY') + '\n';
  report += t('report.exec_summary_prompt', '[Provide a brief overview of the risk scenario, key findings, and recommendations.]') + '\n';
  report += '\n';
  report += t('report.factor_analysis', 'FACTOR ANALYSIS') + '\n';
  report += '===============\n';
  report += '\n';

  // Recursive function to walk the tree and build factor analysis section
  function walkTree(modelNode, factorState, indent = 0) {
    const indentStr = '  '.repeat(indent);
    const label = t(`factor.${modelNode.id}.label`, modelNode.label);
    const abbrev = modelNode.id.toUpperCase();
    const unitKey = modelNode.unit.replace('/', '_');
    const unit = t(`input.unit_labels.${unitKey}`, modelNode.unit);

    report += `${indentStr}${label} (${abbrev}) — ${unit}\n`;

    // If collapsed or leaf, show values
    if (!factorState.expanded || !modelNode.children) {
      const values = formatFactorValues(factorState, unit);
      report += `${indentStr}  ${values}\n`;
      report += `${indentStr}  ${t('report.rationale_prompt', '[RATIONALE: Explain why these values were chosen. E.g., "..."]')}\n`;
      report += '\n';
    } else {
      // Expanded composite - show description and recurse
      const description = t(`factor.${modelNode.id}.description`, modelNode.description);
      if (description) {
        const desc = description.split('[')[0].trim();
        if (desc.length > 100 && modelNode.children) {
          const childrenLabels = modelNode.children.map(c => t(`factor.${c.id}.label`, c.label)).join(` ${t('report.and', 'and')} `);
          report += `${indentStr}  ${t('report.estimated_via', 'Estimated via decomposition into')} ${childrenLabels}.\n`;
        } else {
          report += `${indentStr}  ${desc}\n`;
        }
      }
      report += '\n';

      // Recurse into children
      for (const childModel of modelNode.children) {
        const childState = factorState.children[childModel.id];
        if (childState) {
          walkTree(childModel, childState, indent + 1);
        }
      }
    }
  }

  function formatFactorValues(factorState, unit) {
    const noValues = t('report.no_values', '[No values set]');
    if (!factorState) {
      return noValues;
    }

    const inputMode = treeUI.inputMode;
    let values = '';

    if (inputMode === 'ci') {
      if (factorState.low === undefined || factorState.high === undefined) {
        return noValues;
      }
      const low = formatValue(factorState.low, unit);
      const high = formatValue(factorState.high, unit);
      values = `${t('input.low', 'Low:')} ${low}  ${t('input.high', 'High:')} ${high}`;
    } else {
      if (factorState.min === undefined || factorState.mode === undefined || factorState.max === undefined) {
        return noValues;
      }
      const min = formatValue(factorState.min, unit);
      const mode = formatValue(factorState.mode, unit);
      const max = formatValue(factorState.max, unit);
      values = `${t('input.min', 'Min:')} ${min}  ${t('input.mode', 'Mode:')} ${mode}  ${t('input.max', 'Max:')} ${max}`;
    }

    return values;
  }

  function formatValue(value, unit) {
    if (unit === 'dollars' || unit === 'دولار' || unit === 'Dólares' || unit === 'Dollar' || unit === '美元' || unit === 'ドル') {
      if (value >= 1000000000) {
        return `$${(value / 1000000000).toFixed(1)}B`;
      } else if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}K`;
      } else {
        return `$${value}`;
      }
    } else if (unit === 'probability' || unit === 'احتمالية' || unit === 'Probabilidad' || unit === 'Probabilité' || unit === 'Wahrscheinlichkeit' || unit === 'Kans' || unit === '確率' || unit === '概率') {
      return value.toFixed(2);
    } else if (unit === 'score') {
      return value.toFixed(0);
    } else {
      return value.toString();
    }
  }

  // Start walking from Risk root
  walkTree(FAIR.tree, state.risk);

  // Add simulation results if available
  if (lastSimResults && lastSimResults.stats) {
    const stats = lastSimResults.stats;
    report += t('report.sim_results', 'SIMULATION RESULTS') + '\n';
    report += '==================\n';
    report += `${t('results.stats.mean', 'Mean')} ALE: ${i18n.formatCompactCurrency(stats.mean)}\n`;
    report += `${t('results.stats.median', 'Median')} ALE: ${i18n.formatCompactCurrency(stats.median)}\n`;
    report += `${t('results.stats.p90', '90th Percentile')}: ${i18n.formatCompactCurrency(stats.p90)}\n`;
    report += `${t('results.stats.min', 'Minimum')}: ${i18n.formatCompactCurrency(stats.min)}\n`;
    report += `${t('results.stats.max', 'Maximum')}: ${i18n.formatCompactCurrency(stats.max)}\n`;
    report += '\n';
  }

  // Add methodology section
  report += t('report.methodology', 'METHODOLOGY') + '\n';
  report += '===========\n';
  report += `${t('report.method_desc_1', 'This analysis uses the Factor Analysis of Information Risk (FAIR) framework with Monte Carlo simulation')} (${iterations} ${t('report.iterations', 'iterations').toLowerCase()}) ${t('report.method_desc_2', 'using')}\n`;
  if (treeUI.inputMode === 'pert') {
    report += t('report.method_pert', 'Beta-PERT distributions.') + '\n';
  } else {
    report += t('report.method_ci', 'uniform distributions within confidence intervals.') + '\n';
  }
  report += '\n';
  report += t('report.references', 'References:') + '\n';
  report += '- Open FAIR Risk Taxonomy (O-RT) v3.0.1, The Open Group Standard (C20B, 2021)\n';
  report += '  https://publications.opengroup.org/c20b\n';
  report += '- Freund & Jones, "Measuring and Managing Information Risk: A FAIR Approach" (2014)\n';
  report += '  https://www.sciencedirect.com/book/9780124202313/measuring-and-managing-information-risk\n';
  report += '- FAIR on Wikidata: https://www.wikidata.org/wiki/Q5428720\n';

  // Download as .txt file
  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const sanitizedName = scenarioName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `${sanitizedName}_report_${dateStr}.txt`;

  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Export chart to PNG or SVG (executive quality)
 */
function exportChart(format) {
  if (!lastSimResults) return;

  const { sortedALE, stats } = lastSimResults;

  // Build data points from cached results (same logic as renderExceedanceCurve)
  const nonZeroALE = sortedALE.filter(v => v > 0);
  const sourceData = useLogScale ? nonZeroALE : sortedALE;
  const step = Math.max(1, Math.floor(sourceData.length / 200));
  const dataPoints = [];
  for (let idx = 0; idx < sourceData.length; idx += step) {
    dataPoints.push([sourceData[idx], 1 - (idx / sourceData.length)]);
  }
  if (dataPoints.length > 0 && dataPoints[dataPoints.length - 1][0] !== sourceData[sourceData.length - 1]) {
    dataPoints.push([sourceData[sourceData.length - 1], 0]);
  }

  // Create temporary off-screen container
  const tempContainer = document.createElement('div');
  tempContainer.style.width = '1200px';
  tempContainer.style.height = '700px';
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  document.body.appendChild(tempContainer);

  // Use SVG renderer for SVG export, canvas for PNG
  const renderer = format === 'svg' ? 'svg' : 'canvas';
  const tempChart = window.echarts.init(tempContainer, null, { renderer });

  const scenarioName = document.getElementById('scenario-name').value || 'Untitled Scenario';
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const iterations = document.getElementById('iterations-input').value;
  const scaleLabel = useLogScale ? 'Annual Loss — Log Scale ($)' : 'Annual Loss ($)';

  const exportOption = {
    animation: false,
    backgroundColor: '#ffffff',
    title: {
      text: scenarioName,
      subtext: `${date} | ${iterations} iterations`,
      left: 'center',
      top: 10,
      textStyle: { fontSize: 20, fontWeight: 'bold', color: '#000000' },
      subtextStyle: { fontSize: 14, color: '#666666' }
    },
    textStyle: { color: '#000000', fontSize: 14 },
    legend: {
      data: [
        { name: 'Exceedance Curve', icon: 'roundRect' },
        { name: 'Median', icon: 'roundRect', itemStyle: { color: '#ff8800' } },
        { name: '90th Percentile', icon: 'roundRect', itemStyle: { color: '#cc0000' } }
      ],
      bottom: 8,
      itemGap: 24,
      textStyle: { fontSize: 13, color: '#555555' }
    },
    grid: {
      left: 100,
      right: 60,
      top: 85,
      bottom: 105
    },
    xAxis: {
      type: useLogScale ? 'log' : 'value',
      name: scaleLabel,
      nameLocation: 'middle',
      nameGap: 35,
      nameTextStyle: { fontSize: 14, color: '#444444' },
      axisLabel: {
        fontSize: 13,
        color: '#333333',
        formatter: (value) => i18n.formatCompactCurrency(value)
      },
      axisLine: { lineStyle: { color: '#999999', width: 1 } },
      axisTick: { lineStyle: { color: '#999999' } },
      splitLine: { lineStyle: { color: '#f0f0f0' } }
    },
    yAxis: {
      type: 'value',
      name: 'Probability of Exceedance',
      nameLocation: 'middle',
      nameGap: 55,
      nameTextStyle: { fontSize: 14, color: '#444444' },
      min: 0,
      max: 1,
      axisLabel: {
        fontSize: 13,
        color: '#333333',
        formatter: (value) => (value * 100).toFixed(0) + '%'
      },
      axisLine: { lineStyle: { color: '#999999', width: 1 } },
      axisTick: { lineStyle: { color: '#999999' } },
      splitLine: { lineStyle: { color: '#f0f0f0' } }
    },
    series: [
      {
        name: 'Exceedance Curve',
        type: 'line',
        data: dataPoints,
        smooth: false,
        symbol: 'none',
        lineStyle: { color: '#0066cc', width: 2.5 },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 102, 204, 0.15)' },
              { offset: 1, color: 'rgba(0, 102, 204, 0.02)' }
            ]
          }
        },
        markLine: {
          symbol: 'none',
          lineStyle: { type: 'dashed', width: 1.5 },
          data: [
            [{
              name: 'Median',
              xAxis: stats.median,
              yAxis: 0.88,
              label: {
                show: true,
                position: 'insideStartTop',
                formatter: () => `Median: ${i18n.formatCompactCurrency(stats.median)}`,
                fontSize: 12,
                fontWeight: 'bold',
                padding: [4, 8],
                backgroundColor: 'rgba(255, 136, 0, 0.9)',
                color: '#ffffff',
                borderRadius: 3
              },
              lineStyle: { color: '#ff8800' }
            }, {
              xAxis: stats.median,
              yAxis: 'min',
              label: { show: false },
              lineStyle: { color: '#ff8800' }
            }],
            [{
              name: '90th Percentile',
              xAxis: stats.p90,
              yAxis: 0.88,
              label: {
                show: true,
                position: 'insideStartTop',
                formatter: () => `90th: ${i18n.formatCompactCurrency(stats.p90)}`,
                fontSize: 12,
                fontWeight: 'bold',
                padding: [4, 8],
                backgroundColor: 'rgba(204, 0, 0, 0.9)',
                color: '#ffffff',
                borderRadius: 3
              },
              lineStyle: { color: '#cc0000' }
            }, {
              xAxis: stats.p90,
              yAxis: 'min',
              label: { show: false },
              lineStyle: { color: '#cc0000' }
            }]
          ]
        }
      }
    ]
  };

  tempChart.setOption(exportOption);

  // Export — link must be in DOM for Safari/Firefox
  const url = tempChart.getDataURL({
    type: format === 'svg' ? 'svg' : 'png',
    pixelRatio: format === 'svg' ? 1 : 3,
    backgroundColor: '#ffffff'
  });

  const link = document.createElement('a');
  link.download = `${scenarioName.replace(/\s+/g, '_')}_${Date.now()}.${format}`;
  link.href = url;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  tempChart.dispose();
  document.body.removeChild(tempContainer);
}

/**
 * Cycle through themes
 */
const THEMES = ['dark', 'light', 'high-contrast'];
function cycleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const idx = THEMES.indexOf(currentTheme);
  const newTheme = THEMES[(idx + 1) % THEMES.length];
  setTheme(newTheme);
}

/**
 * Set theme and update charts
 */
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('fair-calc-theme', theme);

  // Update button text
  const btn = document.getElementById('btn-theme');
  const themeLabels = { dark: 'Dark', light: 'Light', 'high-contrast': 'High Contrast' };
  btn.textContent = themeLabels[theme] || theme;

  // Re-render exceedance curve with new theme colors
  if (echartsCurve) {
    echartsCurve.dispose();
    // Wait for CSS theme transition to complete before re-init
    requestAnimationFrame(() => {
      const curveContainer = document.getElementById('chart-curve');
      echartsCurve = window.echarts.init(curveContainer);
      runSimulation();
    });
  }
}

/**
 * Initialize theme from localStorage (before full init)
 */
function initTheme() {
  const savedTheme = localStorage.getItem('fair-calc-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

/**
 * Setup responsive toggle for mobile
 */
function setupResponsiveToggle() {
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  const inputPanel = document.getElementById('input-panel');
  const resultsPanel = document.getElementById('results-panel');

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.getAttribute('data-panel');

      // Update active state
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Toggle classes (CSS media query handles display)
      if (panel === 'inputs') {
        inputPanel.classList.remove('mobile-hidden');
        resultsPanel.classList.remove('mobile-visible');
      } else {
        inputPanel.classList.add('mobile-hidden');
        resultsPanel.classList.add('mobile-visible');
        // Resize charts when results become visible
        if (echartsCurve) echartsCurve.resize();
        // Breakdown uses CSS bars, no resize needed
      }
    });
  });
}

// Initialize theme before DOM ready
initTheme();

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
