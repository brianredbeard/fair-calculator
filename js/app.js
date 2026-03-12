import { FAIR } from './fair-model.js';
import { loadI18n } from './i18n.js';
import { FactorTreeUI } from './tree-ui.js';
import { encodeStateToHash, decodeStateFromHash, ScenarioStore, SettingsStore } from './state.js';
import { EXAMPLE_SCENARIOS } from './examples.js';

let i18n;
let treeUI;
let worker;
let debounceTimer;
let echartsCurve;
let useLogScale = true; // Default to log scale (industry standard for FAIR)
let lastSimResults = null; // Cache for re-rendering on scale toggle
let currentScenarioId = null;
let settings = {}; // Global settings (pertLambda, etc.)
const store = new ScenarioStore();
const settingsStore = new SettingsStore();

/**
 * Initialize the application
 */
async function init() {
  // Load i18n
  i18n = await loadI18n('en');

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
  treeUI = new FactorTreeUI(inputPanel, FAIR.tree, onInputChange);

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

  // Run initial simulation
  runSimulation();
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
    { label: 'Minimum', value: stats.min },
    { label: 'Mean', value: stats.mean },
    { label: 'Median', value: stats.median },
    { label: '90th Percentile', value: stats.p90 },
    { label: 'Maximum', value: stats.max }
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

  const scaleLabel = useLogScale ? 'Annual Loss — Log Scale ($)' : 'Annual Loss ($)';

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
      name: 'Probability of Exceedance',
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
              name: 'Median',
              xAxis: stats.median,
              yAxis: 'max',
              label: {
                show: true,
                position: 'start',
                formatter: () => `Median: ${i18n.formatCompactCurrency(stats.median)}`,
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
              name: '90th Percentile',
              xAxis: stats.p90,
              yAxis: 0.5,
              label: {
                show: true,
                position: 'start',
                formatter: () => `90th: ${i18n.formatCompactCurrency(stats.p90)}`,
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
  const categories = Object.entries(breakdown)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, value]) => ({ category: cat, value }));

  const maxValue = categories.length > 0 ? categories[0].value : 1;
  const total = categories.reduce((sum, c) => sum + c.value, 0);

  const colors = [
    'var(--accent-blue)', 'var(--accent-purple)', 'var(--accent-green)',
    'var(--accent-yellow)', 'var(--accent-red)'
  ];

  // Render bars + table combined
  const tableBody = document.getElementById('breakdown-table');
  tableBody.innerHTML = '';

  categories.forEach((item, idx) => {
    const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
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
  const nameMap = {
    productivity: 'Productivity',
    response: 'Response',
    replacement: 'Replacement',
    reputation: 'Reputation',
    competitive: 'Competitive Advantage',
    fines: 'Fines & Judgments',
    primary: 'Primary Loss',
    secondary: 'Secondary Loss',
    slm: 'Secondary Loss Magnitude'
  };
  return nameMap[category] || category;
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
    nameEl.addEventListener('click', () => loadScenario(scenario.id));

    // Add example badge if this is an example scenario
    if (isExample) {
      const badge = document.createElement('span');
      badge.className = 'example-badge';
      badge.textContent = 'Example';
      nameEl.appendChild(document.createTextNode(' '));
      nameEl.appendChild(badge);
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
 * Load example scenarios from examples.js into localStorage
 */
function loadExamples() {
  EXAMPLE_SCENARIOS.forEach(example => {
    store.save(example);
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
  const scenarioName = document.getElementById('scenario-name').value || 'Untitled Scenario';
  const iterations = document.getElementById('iterations-input').value;
  const inputMode = treeUI.inputMode.toUpperCase();
  const inputModeLabel = inputMode === 'CI' ? '2-point Confidence Interval' : '3-point PERT estimation';

  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const state = treeUI.getState();

  let report = '';
  report += 'FAIR Risk Analysis Report\n';
  report += '=========================\n';
  report += `Scenario: ${scenarioName}\n`;
  report += `Date: ${date}\n`;
  report += 'Analyst: [YOUR NAME]\n';
  report += `Input Mode: ${inputMode} (${inputModeLabel})\n`;
  report += `Iterations: ${iterations}\n`;
  report += '\n';
  report += 'EXECUTIVE SUMMARY\n';
  report += '[Provide a brief overview of the risk scenario, key findings, and recommendations.]\n';
  report += '\n';
  report += 'FACTOR ANALYSIS\n';
  report += '===============\n';
  report += '\n';

  // Recursive function to walk the tree and build factor analysis section
  function walkTree(modelNode, factorState, indent = 0) {
    const indentStr = '  '.repeat(indent);
    const label = modelNode.label;
    const abbrev = modelNode.id.toUpperCase();
    const unit = modelNode.unit;

    report += `${indentStr}${label} (${abbrev}) — ${unit}\n`;

    // If collapsed or leaf, show values
    if (!factorState.expanded || !modelNode.children) {
      const values = formatFactorValues(factorState, unit);
      report += `${indentStr}  ${values}\n`;
      report += `${indentStr}  [RATIONALE: Explain why these values were chosen. E.g., "..."]\n`;
      report += '\n';
    } else {
      // Expanded composite - show description and recurse
      if (modelNode.description) {
        const desc = modelNode.description.split('[')[0].trim();
        if (desc.length > 100) {
          report += `${indentStr}  Estimated via decomposition into ${modelNode.children.map(c => c.label).join(' and ')}.\n`;
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
    if (!factorState) {
      return '[No values set]';
    }

    const inputMode = treeUI.inputMode;
    let values = '';

    if (inputMode === 'ci') {
      if (factorState.low === undefined || factorState.high === undefined) {
        return '[No values set]';
      }
      const low = formatValue(factorState.low, unit);
      const high = formatValue(factorState.high, unit);
      values = `Low: ${low}  High: ${high}`;
    } else {
      if (factorState.min === undefined || factorState.mode === undefined || factorState.max === undefined) {
        return '[No values set]';
      }
      const min = formatValue(factorState.min, unit);
      const mode = formatValue(factorState.mode, unit);
      const max = formatValue(factorState.max, unit);
      values = `Min: ${min}  Mode: ${mode}  Max: ${max}`;
    }

    return values;
  }

  function formatValue(value, unit) {
    if (unit === 'dollars') {
      if (value >= 1000000000) {
        return `$${(value / 1000000000).toFixed(1)}B`;
      } else if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}K`;
      } else {
        return `$${value}`;
      }
    } else if (unit === 'probability') {
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
    report += 'SIMULATION RESULTS\n';
    report += '==================\n';
    report += `Mean ALE: ${i18n.formatCompactCurrency(stats.mean)}\n`;
    report += `Median ALE: ${i18n.formatCompactCurrency(stats.median)}\n`;
    report += `90th Percentile: ${i18n.formatCompactCurrency(stats.p90)}\n`;
    report += `Minimum: ${i18n.formatCompactCurrency(stats.min)}\n`;
    report += `Maximum: ${i18n.formatCompactCurrency(stats.max)}\n`;
    report += '\n';
  }

  // Add methodology section
  report += 'METHODOLOGY\n';
  report += '===========\n';
  report += `This analysis uses the Factor Analysis of Information Risk (FAIR)\n`;
  report += `framework with Monte Carlo simulation (${iterations} iterations) using\n`;
  if (treeUI.inputMode === 'pert') {
    report += 'Beta-PERT distributions.\n';
  } else {
    report += 'uniform distributions within confidence intervals.\n';
  }
  report += '\n';
  report += 'References:\n';
  report += '- Open FAIR Risk Taxonomy (O-RT), The Open Group Standard (C13K)\n';
  report += '- Freund & Jones, "Measuring and Managing Information Risk: A FAIR Approach" (2014)\n';

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
