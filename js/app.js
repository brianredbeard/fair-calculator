import { FAIR } from './fair-model.js';
import { loadI18n } from './i18n.js';
import { FactorTreeUI } from './tree-ui.js';
import { encodeStateToHash, decodeStateFromHash, ScenarioStore } from './state.js';

let i18n;
let treeUI;
let worker;
let debounceTimer;
let echartsCurve;
let useLogScale = true; // Default to log scale (industry standard for FAIR)
let lastSimResults = null; // Cache for re-rendering on scale toggle
let currentScenarioId = null;
const store = new ScenarioStore();

/**
 * Initialize the application
 */
async function init() {
  // Load i18n
  i18n = await loadI18n('en');

  // Check URL hash for shared state
  const hash = window.location.hash.slice(1);
  let initialState = null;
  if (hash) {
    const decoded = decodeStateFromHash(hash);
    if (decoded && decoded.factors) {
      initialState = decoded.factors;
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
  }

  // Initialize ECharts for the exceedance curve only (breakdown uses CSS bars)
  const curveContainer = document.getElementById('chart-curve');
  echartsCurve = window.echarts.init(curveContainer);

  // Wire event listeners
  document.getElementById('scenario-name').addEventListener('input', onInputChange);
  document.getElementById('iterations-input').addEventListener('change', onInputChange);
  document.getElementById('btn-theme').addEventListener('click', cycleTheme);
  document.getElementById('btn-copy-url').addEventListener('click', copyURL);
  document.getElementById('btn-export-png').addEventListener('click', () => exportChart('png'));
  document.getElementById('btn-export-svg').addEventListener('click', () => exportChart('svg'));
  document.getElementById('btn-scenarios').addEventListener('click', toggleScenariosDropdown);
  document.getElementById('btn-new-scenario').addEventListener('click', newScenario);

  // Scale toggle
  document.getElementById('btn-log-scale').addEventListener('click', () => setScale(true));
  document.getElementById('btn-linear-scale').addEventListener('click', () => setScale(false));

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
    autoSaveScenario();
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
  worker.postMessage({ iterations, factors });
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
 * Auto-save current scenario to localStorage
 */
function autoSaveScenario() {
  const state = getCurrentFullState();

  if (currentScenarioId) {
    // Update existing scenario
    store.save(state, currentScenarioId);
  } else {
    // Create new scenario
    currentScenarioId = store.save(state);
  }

  renderScenariosList();
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
    return;
  }

  scenarios.forEach(scenario => {
    const item = document.createElement('div');
    item.className = 'scenario-item';
    if (scenario.id === currentScenarioId) {
      item.classList.add('active');
    }

    const nameEl = document.createElement('span');
    nameEl.className = 'scenario-name';
    nameEl.textContent = scenario.name;
    nameEl.addEventListener('click', () => loadScenario(scenario.id));

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
 * Export chart to PNG or SVG (executive quality)
 */
function exportChart(format) {
  // Create temporary off-screen container
  const tempContainer = document.createElement('div');
  tempContainer.style.width = '1200px';
  tempContainer.style.height = '700px';
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  document.body.appendChild(tempContainer);

  // Initialize temporary chart instance
  const tempChart = window.echarts.init(tempContainer);

  // Get current scenario name and date
  const scenarioName = document.getElementById('scenario-name').value || 'Untitled Scenario';
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const iterations = document.getElementById('iterations-input').value;

  // Get current data
  const currentOption = echartsCurve.getOption();

  // Create executive-quality option
  const exportOption = {
    backgroundColor: '#ffffff',
    title: {
      text: `${scenarioName}`,
      subtext: `${date} | ${iterations} iterations`,
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000'
      },
      subtextStyle: {
        fontSize: 14,
        color: '#666666'
      }
    },
    textStyle: {
      color: '#000000',
      fontSize: 14
    },
    grid: {
      left: 100,
      right: 60,
      top: 70,
      bottom: 80
    },
    xAxis: {
      type: 'value',
      name: 'Annual Loss ($)',
      nameLocation: 'middle',
      nameGap: 40,
      nameTextStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000'
      },
      axisLabel: {
        fontSize: 14,
        color: '#000000',
        formatter: (value) => i18n.formatCompactCurrency(value)
      },
      axisLine: {
        lineStyle: {
          color: '#333333',
          width: 1
        }
      },
      splitLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: 'Probability of Exceedance',
      nameLocation: 'middle',
      nameGap: 60,
      nameTextStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000'
      },
      min: 0,
      max: 1,
      axisLabel: {
        fontSize: 14,
        color: '#000000',
        formatter: (value) => (value * 100).toFixed(0) + '%'
      },
      axisLine: {
        lineStyle: {
          color: '#333333',
          width: 1
        }
      },
      splitLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      }
    },
    series: currentOption.series.map(s => ({
      ...s,
      lineStyle: {
        ...s.lineStyle,
        width: 3,
        color: '#0066cc'
      },
      markLine: s.markLine ? {
        ...s.markLine,
        lineStyle: {
          ...s.markLine.lineStyle,
          width: 2
        },
        label: {
          ...s.markLine.label,
          fontSize: 14,
          fontWeight: 'bold'
        },
        data: s.markLine.data.map(d => ({
          ...d,
          lineStyle: {
            ...d.lineStyle,
            color: d.name === 'Median' ? '#ff8800' : '#cc0000'
          }
        }))
      } : undefined
    }))
  };

  tempChart.setOption(exportOption);

  // Export based on format
  if (format === 'png') {
    const url = tempChart.getDataURL({
      type: 'png',
      pixelRatio: 3,
      backgroundColor: '#ffffff'
    });

    const link = document.createElement('a');
    link.download = `${scenarioName.replace(/\s+/g, '_')}_${Date.now()}.png`;
    link.href = url;
    link.click();
  } else if (format === 'svg') {
    const url = tempChart.getDataURL({
      type: 'svg',
      backgroundColor: '#ffffff'
    });

    const link = document.createElement('a');
    link.download = `${scenarioName.replace(/\s+/g, '_')}_${Date.now()}.svg`;
    link.href = url;
    link.click();
  }

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
