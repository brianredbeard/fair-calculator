/**
 * Factor Tree UI
 * Renders FAIR factor tree as interactive DOM with ARIA roles, expand/collapse,
 * CI input fields, validation, tooltips, and keyboard navigation.
 */

import { FAIR } from './fair-model.js';

export class FactorTreeUI {
  constructor(container, modelTree, onChange, i18n) {
    this.container = container;
    this.modelTree = modelTree;
    this.onChange = onChange;
    this.i18n = i18n;
    this.inputMode = 'ci'; // 'ci' or 'pert'

    // Initialize state with Risk expanded by default
    this.state = this._initializeState(modelTree);

    // Render the tree
    this._render();
  }

  /**
   * Initialize state tree from model
   * Risk is always expanded, all others collapsed
   */
  _initializeState(modelNode, isRoot = true) {
    const state = {
      expanded: isRoot, // Risk starts expanded
    };

    if (modelNode.children && isRoot) {
      // Root has children - create collapsed child states
      state.children = {};
      for (const child of modelNode.children) {
        state.children[child.id] = {
          expanded: false,
          low: child.defaultLow,
          high: child.defaultHigh
        };
      }
    } else if (!modelNode.children) {
      // Leaf node - store low/high values
      state.low = modelNode.defaultLow;
      state.high = modelNode.defaultHigh;
    } else {
      // Collapsed composite - store low/high
      state.low = modelNode.defaultLow;
      state.high = modelNode.defaultHigh;
    }

    return { [modelNode.id]: state };
  }

  /**
   * Toggle expansion state of a factor
   */
  toggleExpand(factorId) {
    // Risk cannot be collapsed
    if (factorId === 'risk') {
      return;
    }

    const factorState = this._findFactorState(factorId);
    if (!factorState) {
      return;
    }

    const modelNode = FAIR.findNode(factorId);
    if (!modelNode || !modelNode.children) {
      return; // Can't expand leaf nodes
    }

    if (factorState.expanded) {
      // Collapse: roll up children into parent, stash children for re-expand
      factorState._remembered = JSON.parse(JSON.stringify(factorState.children));
      const rolledUp = this._rollUpChildren(factorId, factorState.children, modelNode);
      if (rolledUp.min !== undefined) {
        factorState.min = rolledUp.min;
        factorState.mode = rolledUp.mode;
        factorState.max = rolledUp.max;
        delete factorState.low;
        delete factorState.high;
      } else {
        factorState.low = rolledUp.low;
        factorState.high = rolledUp.high;
        delete factorState.min;
        delete factorState.mode;
        delete factorState.max;
      }
      factorState.expanded = false;
      delete factorState.children;
    } else if (factorState._remembered) {
      // Re-expand: restore stashed children
      factorState.expanded = true;
      factorState.children = JSON.parse(JSON.stringify(factorState._remembered));
      delete factorState._remembered;
      delete factorState.low;
      delete factorState.high;
      delete factorState.min;
      delete factorState.mode;
      delete factorState.max;
    } else {
      // First expand: proportional split of parent values
      factorState.expanded = true;
      factorState.children = this._proportionalSplit(factorState, modelNode);
      delete factorState.low;
      delete factorState.high;
      delete factorState.min;
      delete factorState.mode;
      delete factorState.max;
    }

    // Re-render
    this._render();
    this.onChange();
  }

  /**
   * Get current state (deep clone)
   */
  getState() {
    return JSON.parse(JSON.stringify(this.state));
  }

  /**
   * Restore state and re-render
   */
  setState(state) {
    this.state = JSON.parse(JSON.stringify(state));
    this._render();
  }

  /**
   * Set input mode (CI or PERT) and convert all factor states
   */
  setInputMode(mode) {
    if (mode !== 'ci' && mode !== 'pert') {
      throw new Error(`Invalid inputMode: ${mode}. Must be 'ci' or 'pert'.`);
    }

    if (this.inputMode === mode) {
      return; // Already in requested mode
    }

    this.inputMode = mode;

    // Convert all leaf/collapsed factors in state
    this._convertFactorStateRecursive(this.state, mode);

    // Re-render with new input mode
    this._render();
    this.onChange();
  }

  /**
   * Recursively convert factor states between CI and PERT modes
   */
  _convertFactorStateRecursive(stateNode, targetMode) {
    for (const key in stateNode) {
      const factorState = stateNode[key];

      // If collapsed or leaf (has low/high or min/mode/max), convert
      if (factorState.low !== undefined && factorState.high !== undefined) {
        // Currently CI mode, convert to PERT
        if (targetMode === 'pert') {
          factorState.min = factorState.low;
          factorState.max = factorState.high;
          factorState.mode = (factorState.low + factorState.high) / 2;
          delete factorState.low;
          delete factorState.high;
        }
      } else if (factorState.min !== undefined && factorState.max !== undefined) {
        // Currently PERT mode, convert to CI
        if (targetMode === 'ci') {
          factorState.low = factorState.min;
          factorState.high = factorState.max;
          delete factorState.min;
          delete factorState.mode;
          delete factorState.max;
        }
      }

      // Recurse into children
      if (factorState.children) {
        this._convertFactorStateRecursive(factorState.children, targetMode);
      }
    }
  }

  /**
   * Find factor state in tree by ID
   */
  _findFactorState(factorId, stateNode = this.state) {
    for (const key in stateNode) {
      if (key === factorId) {
        return stateNode[key];
      }
      if (stateNode[key].children) {
        const found = this._findFactorState(factorId, stateNode[key].children);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  /**
   * Proportional split: distribute parent's low/high to children
   * based on each child's default proportion of the parent's defaults.
   */
  _proportionalSplit(parentState, modelNode) {
    const children = {};
    const defaultLows = modelNode.children.map(c => c.defaultLow);
    const defaultHighs = modelNode.children.map(c => c.defaultHigh);
    const totalDefaultLow = defaultLows.reduce((s, v) => s + v, 0);
    const totalDefaultHigh = defaultHighs.reduce((s, v) => s + v, 0);

    const isPertMode = parentState.min !== undefined;
    const parentLow = isPertMode ? (parentState.min || modelNode.defaultLow) : (parentState.low || modelNode.defaultLow);
    const parentHigh = isPertMode ? (parentState.max || modelNode.defaultHigh) : (parentState.high || modelNode.defaultHigh);
    const parentMode = isPertMode ? (parentState.mode || (parentState.min + parentState.max) / 2) : (parentLow + parentHigh) / 2;

    modelNode.children.forEach((child, i) => {
      // For additive factors: split proportionally
      // For multiplicative factors: use defaults since splitting a product is ambiguous
      const isAdditive = this._isAdditiveFactor(modelNode.id);

      let childLow, childHigh, childMode;
      if (isAdditive && totalDefaultLow > 0 && totalDefaultHigh > 0) {
        childLow = parentLow * (defaultLows[i] / totalDefaultLow);
        childHigh = parentHigh * (defaultHighs[i] / totalDefaultHigh);
        childMode = parentMode * ((defaultLows[i] + defaultHighs[i]) / 2) / ((totalDefaultLow + totalDefaultHigh) / 2);
        // Round to reasonable precision
        childLow = this._roundSensible(childLow);
        childHigh = this._roundSensible(childHigh);
        childMode = this._roundSensible(childMode);
      } else {
        // Multiplicative or special factors: use model defaults
        childLow = child.defaultLow;
        childHigh = child.defaultHigh;
        childMode = (childLow + childHigh) / 2;
      }

      if (isPertMode) {
        children[child.id] = {
          expanded: false,
          min: childLow,
          mode: childMode,
          max: childHigh
        };
      } else {
        children[child.id] = {
          expanded: false,
          low: childLow,
          high: childHigh
        };
      }
    });

    return children;
  }

  /**
   * Roll up children into parent on collapse (handles both CI and PERT modes).
   * Additive: sum of lows/mins, highs/maxes, modes
   * Multiplicative: product of lows/mins, highs/maxes, modes
   * Vuln (comparison): preserve the pre-expansion value via approximation
   */
  _rollUpChildren(factorId, children, modelNode) {
    // Detect mode from first child
    const firstChild = Object.values(children)[0];
    const isPertMode = firstChild && firstChild.min !== undefined;

    const childMins = {};
    const childModes = {};
    const childMaxes = {};

    for (const [childId, childState] of Object.entries(children)) {
      if (childState.expanded && childState.children) {
        // Recursively roll up nested expanded children
        const childModel = modelNode.children.find(c => c.id === childId);
        const rolled = this._rollUpChildren(childId, childState.children, childModel);
        if (isPertMode) {
          childMins[childId] = rolled.min;
          childModes[childId] = rolled.mode;
          childMaxes[childId] = rolled.max;
        } else {
          childMins[childId] = rolled.low;
          childMaxes[childId] = rolled.high;
        }
      } else {
        if (isPertMode) {
          childMins[childId] = childState.min;
          childModes[childId] = childState.mode;
          childMaxes[childId] = childState.max;
        } else {
          childMins[childId] = childState.low;
          childMaxes[childId] = childState.high;
        }
      }
    }

    if (this._isAdditiveFactor(factorId)) {
      const result = {
        low: this._roundSensible(Object.values(childMins).reduce((s, v) => s + v, 0)),
        high: this._roundSensible(Object.values(childMaxes).reduce((s, v) => s + v, 0))
      };
      if (isPertMode) {
        result.min = result.low;
        result.max = result.high;
        result.mode = this._roundSensible(Object.values(childModes).reduce((s, v) => s + v, 0));
        delete result.low;
        delete result.high;
      }
      return result;
    } else if (factorId === 'vuln') {
      // Vuln comparison: approximate from TCap/RS overlap
      const tcapMin = childMins.tcap, tcapMax = childMaxes.tcap;
      const rsMin = childMins.rs, rsMax = childMaxes.rs;
      // Rough probability that TCap > RS given the ranges
      const lowEstimate = Math.max(0.01, Math.min(1, (tcapMin - rsMax) / (tcapMax - rsMin + 1)));
      const highEstimate = Math.max(0.01, Math.min(1, (tcapMax - rsMin) / (tcapMax - rsMin + 1)));
      const result = {
        low: this._roundSensible(Math.max(0.01, Math.min(lowEstimate, highEstimate))),
        high: this._roundSensible(Math.min(1, Math.max(lowEstimate, highEstimate)))
      };
      if (isPertMode) {
        result.min = result.low;
        result.max = result.high;
        result.mode = this._roundSensible((result.low + result.high) / 2);
        delete result.low;
        delete result.high;
      }
      return result;
    } else {
      // Multiplicative: product of lows/mins, highs/maxes, modes
      const result = {
        low: this._roundSensible(Object.values(childMins).reduce((s, v) => s * v, 1)),
        high: this._roundSensible(Object.values(childMaxes).reduce((s, v) => s * v, 1))
      };
      if (isPertMode) {
        result.min = result.low;
        result.max = result.high;
        result.mode = this._roundSensible(Object.values(childModes).reduce((s, v) => s * v, 1));
        delete result.low;
        delete result.high;
      }
      return result;
    }
  }

  /**
   * Check if a factor uses additive combination (sum) vs multiplicative (product).
   */
  _isAdditiveFactor(factorId) {
    return ['lm', 'primary', 'slm'].includes(factorId);
  }

  /**
   * Round to sensible significant figures for display.
   */
  _roundSensible(value) {
    if (value === 0) return 0.001;
    if (value >= 1000) return Math.round(value);
    if (value >= 1) return Math.round(value * 100) / 100;
    return Math.round(value * 10000) / 10000;
  }

  /**
   * Expand all composite factors in the tree.
   */
  expandAll() {
    this._expandRecursive(this.state.risk, this.modelTree);
    this._render();
    this.onChange();
  }

  /**
   * Collapse all composite factors (except Risk, which stays expanded).
   */
  collapseAll() {
    this._collapseRecursive(this.state.risk, this.modelTree);
    this._render();
    this.onChange();
  }

  _expandRecursive(factorState, modelNode) {
    if (!modelNode.children) return; // Leaf

    if (!factorState.expanded) {
      // Expand using proportional split (or remembered children)
      if (factorState._remembered) {
        factorState.expanded = true;
        factorState.children = JSON.parse(JSON.stringify(factorState._remembered));
        delete factorState._remembered;
        delete factorState.low;
        delete factorState.high;
      } else {
        factorState.expanded = true;
        factorState.children = this._proportionalSplit(factorState, modelNode);
        delete factorState.low;
        delete factorState.high;
      }
    }

    // Recurse into children
    for (const childModel of modelNode.children) {
      const childState = factorState.children[childModel.id];
      if (childState && childModel.children) {
        this._expandRecursive(childState, childModel);
      }
    }
  }

  _collapseRecursive(factorState, modelNode) {
    if (!modelNode.children || !factorState.expanded) return;

    // Collapse children first (bottom-up)
    for (const childModel of modelNode.children) {
      const childState = factorState.children[childModel.id];
      if (childState && childModel.children && childState.expanded) {
        this._collapseRecursive(childState, childModel);
      }
    }

    // Don't collapse the Risk root
    if (modelNode.id === 'risk') return;

    // Now collapse this node
    factorState._remembered = JSON.parse(JSON.stringify(factorState.children));
    const rolledUp = this._rollUpChildren(modelNode.id, factorState.children, modelNode);
    if (rolledUp.min !== undefined) {
      // PERT mode roll-up
      factorState.min = rolledUp.min;
      factorState.mode = rolledUp.mode;
      factorState.max = rolledUp.max;
      delete factorState.low;
      delete factorState.high;
    } else {
      // CI mode roll-up
      factorState.low = rolledUp.low;
      factorState.high = rolledUp.high;
      delete factorState.min;
      delete factorState.mode;
      delete factorState.max;
    }
    factorState.expanded = false;
    delete factorState.children;
  }

  /**
   * Check if any composite factor (besides Risk) is currently expanded.
   */
  _hasExpandedFactors(factorState = this.state.risk) {
    if (factorState.children) {
      for (const [, childState] of Object.entries(factorState.children)) {
        if (childState.expanded) return true;
        if (childState.children && this._hasExpandedFactors(childState)) return true;
      }
    }
    return false;
  }

  /**
   * Render the entire tree
   */
  _render() {
    this.container.innerHTML = '';

    // Expand/Collapse All toggle
    const toolbar = document.createElement('div');
    toolbar.className = 'tree-toolbar';
    const allExpanded = this._hasExpandedFactors();
    const toggleAllBtn = document.createElement('button');
    toggleAllBtn.className = 'btn-small btn-expand-all';
    toggleAllBtn.textContent = allExpanded ? (this.i18n ? this.i18n.t('input.collapse_all') : 'Collapse All') : (this.i18n ? this.i18n.t('input.expand_all') : 'Expand All');
    toggleAllBtn.setAttribute('aria-label', allExpanded ? (this.i18n ? this.i18n.t('input.collapse_all_tooltip') : 'Collapse all factors') : (this.i18n ? this.i18n.t('input.expand_all_tooltip') : 'Expand all factors (Stage 2: full decomposition)'));
    if (this._currentTutorialStep) {
      toggleAllBtn.disabled = true;
      toggleAllBtn.title = 'Disabled during tutorial';
    }
    toggleAllBtn.addEventListener('click', () => {
      if (this._currentTutorialStep) return;
      if (this._hasExpandedFactors()) {
        this.collapseAll();
      } else {
        this.expandAll();
      }
    });
    toolbar.appendChild(toggleAllBtn);
    this.container.appendChild(toolbar);

    const treeEl = document.createElement('div');
    treeEl.setAttribute('role', 'tree');
    treeEl.className = 'factor-tree';

    // Render from root
    this._renderNode('risk', this.state.risk, this.modelTree, treeEl, 0);

    this.container.appendChild(treeEl);

    // Setup keyboard navigation
    this._setupKeyboardNav(treeEl);
  }

  /**
   * Render a single node and its children/inputs
   */
  _renderNode(factorId, factorState, modelNode, parentEl, depth) {
    const itemEl = document.createElement('div');
    itemEl.setAttribute('role', 'treeitem');
    itemEl.setAttribute('data-factor-id', factorId);
    itemEl.setAttribute('tabindex', depth === 0 ? '0' : '-1');
    itemEl.className = 'factor-item';
    itemEl.style.setProperty('--depth', depth);

    // Composite factors have aria-expanded
    if (modelNode.children) {
      itemEl.setAttribute('aria-expanded', factorState.expanded ? 'true' : 'false');
    }

    // Create header row
    const headerEl = document.createElement('div');
    headerEl.className = 'factor-header';

    // Expand/collapse button for composites (except risk)
    if (modelNode.children && factorId !== 'risk') {
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'expand-toggle';
      toggleBtn.textContent = factorState.expanded ? '▼' : '▶';
      toggleBtn.setAttribute('aria-label', `${factorState.expanded ? 'Collapse' : 'Expand'} ${modelNode.label}`);
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleExpand(factorId);
      });
      headerEl.appendChild(toggleBtn);
    } else if (factorId !== 'risk') {
      // Spacer for leaf nodes to align labels
      const spacer = document.createElement('span');
      spacer.className = 'expand-toggle';
      spacer.style.visibility = 'hidden';
      spacer.textContent = '▶';
      headerEl.appendChild(spacer);
    }

    // Factor label with tooltip
    const labelEl = document.createElement('span');
    labelEl.className = 'factor-label';
    const labelKey = `factor.${factorId}.label`;
    const tooltipKey = `factor.${factorId}.tooltip`;
    labelEl.textContent = this.i18n ? this.i18n.t(labelKey) : modelNode.label;
    labelEl.setAttribute('title', this.i18n ? this.i18n.t(tooltipKey) : modelNode.tooltip);
    headerEl.appendChild(labelEl);

    // Unit indicator
    const unitEl = document.createElement('span');
    unitEl.className = 'factor-unit';
    const unitKey = modelNode.unit.replace('/', '_');
    const unitLabel = this.i18n ? this.i18n.t(`input.unit_labels.${unitKey}`) : modelNode.unit;
    unitEl.textContent = `(${unitLabel})`;
    headerEl.appendChild(unitEl);

    itemEl.appendChild(headerEl);

    // Factor description (visible help text) with linked references
    if (modelNode.description) {
      const descEl = document.createElement('p');
      descEl.className = 'factor-description';

      const descKey = `factor.${factorId}.description`;
      const description = this.i18n ? this.i18n.t(descKey) : modelNode.description;
      const textNode = document.createTextNode(description);
      descEl.appendChild(textNode);

      if (modelNode.references && modelNode.references.length > 0) {
        const refsSpan = document.createElement('span');
        refsSpan.className = 'factor-references';
        refsSpan.appendChild(document.createTextNode(' ['));
        modelNode.references.forEach((ref, i) => {
          if (i > 0) {
            refsSpan.appendChild(document.createTextNode('; '));
          }
          const a = document.createElement('a');
          a.href = ref.url;
          a.textContent = ref.label;
          a.title = ref.citation;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          refsSpan.appendChild(a);
        });
        refsSpan.appendChild(document.createTextNode(']'));
        descEl.appendChild(refsSpan);
      }

      itemEl.appendChild(descEl);
    }

    // Render children or inputs based on expansion state
    if (factorState.expanded && factorState.children) {
      // Render children in a group
      const groupEl = document.createElement('div');
      groupEl.setAttribute('role', 'group');
      groupEl.className = 'factor-children';

      for (const childId in factorState.children) {
        const childState = factorState.children[childId];
        const childModel = modelNode.children.find(c => c.id === childId);
        this._renderNode(childId, childState, childModel, groupEl, depth + 1);
      }

      itemEl.appendChild(groupEl);
    } else if (factorState.low !== undefined && factorState.high !== undefined) {
      // Render CI input row
      const inputRow = this._createInputRow(factorId, factorState, modelNode);
      itemEl.appendChild(inputRow);
    } else if (factorState.min !== undefined && factorState.max !== undefined) {
      // Render PERT input row
      const inputRow = this._createPertInputRow(factorId, factorState, modelNode);
      itemEl.appendChild(inputRow);
    }

    parentEl.appendChild(itemEl);
  }

  /**
   * Create CI input row for a factor
   */
  _createInputRow(factorId, factorState, modelNode) {
    const rowEl = document.createElement('div');
    rowEl.className = 'ci-input-row';

    // Low input
    const lowLabelEl = document.createElement('span');
    lowLabelEl.className = 'ci-label';
    lowLabelEl.textContent = this.i18n ? this.i18n.t('input.low') : 'Low:';
    rowEl.appendChild(lowLabelEl);

    const lowInputEl = document.createElement('input');
    lowInputEl.type = 'text';
    lowInputEl.className = 'ci-input';
    lowInputEl.setAttribute('data-bound', 'low');
    lowInputEl.setAttribute('aria-label', `${modelNode.label} low`);
    lowInputEl.value = this._formatValue(factorState.low, modelNode.unit);
    lowInputEl.addEventListener('change', (e) => {
      this._handleInputChange(factorId, 'low', e.target.value, modelNode.unit, e.target);
    });
    rowEl.appendChild(lowInputEl);

    // High input
    const highLabelEl = document.createElement('span');
    highLabelEl.className = 'ci-label';
    highLabelEl.textContent = this.i18n ? this.i18n.t('input.high') : 'High:';
    rowEl.appendChild(highLabelEl);

    const highInputEl = document.createElement('input');
    highInputEl.type = 'text';
    highInputEl.className = 'ci-input';
    highInputEl.setAttribute('data-bound', 'high');
    highInputEl.setAttribute('aria-label', `${modelNode.label} high`);
    highInputEl.value = this._formatValue(factorState.high, modelNode.unit);
    highInputEl.addEventListener('change', (e) => {
      this._handleInputChange(factorId, 'high', e.target.value, modelNode.unit, e.target);
    });
    rowEl.appendChild(highInputEl);

    return rowEl;
  }

  /**
   * Create PERT input row for a factor (min/mode/max)
   */
  _createPertInputRow(factorId, factorState, modelNode) {
    const rowEl = document.createElement('div');
    rowEl.className = 'pert-input-row';

    // Min input
    const minLabelEl = document.createElement('span');
    minLabelEl.className = 'pert-label';
    minLabelEl.textContent = this.i18n ? this.i18n.t('input.min') : 'Min:';
    rowEl.appendChild(minLabelEl);

    const minInputEl = document.createElement('input');
    minInputEl.type = 'text';
    minInputEl.className = 'pert-input';
    minInputEl.setAttribute('data-bound', 'min');
    minInputEl.setAttribute('aria-label', `${modelNode.label} min`);
    minInputEl.value = this._formatValue(factorState.min, modelNode.unit);
    minInputEl.addEventListener('change', (e) => {
      this._handleInputChange(factorId, 'min', e.target.value, modelNode.unit, e.target);
    });
    rowEl.appendChild(minInputEl);

    // Mode input
    const modeLabelEl = document.createElement('span');
    modeLabelEl.className = 'pert-label';
    modeLabelEl.textContent = this.i18n ? this.i18n.t('input.mode') : 'Mode:';
    rowEl.appendChild(modeLabelEl);

    const modeInputEl = document.createElement('input');
    modeInputEl.type = 'text';
    modeInputEl.className = 'pert-input';
    modeInputEl.setAttribute('data-bound', 'mode');
    modeInputEl.setAttribute('aria-label', `${modelNode.label} mode`);
    modeInputEl.value = this._formatValue(factorState.mode, modelNode.unit);
    modeInputEl.addEventListener('change', (e) => {
      this._handleInputChange(factorId, 'mode', e.target.value, modelNode.unit, e.target);
    });
    rowEl.appendChild(modeInputEl);

    // Max input
    const maxLabelEl = document.createElement('span');
    maxLabelEl.className = 'pert-label';
    maxLabelEl.textContent = this.i18n ? this.i18n.t('input.max') : 'Max:';
    rowEl.appendChild(maxLabelEl);

    const maxInputEl = document.createElement('input');
    maxInputEl.type = 'text';
    maxInputEl.className = 'pert-input';
    maxInputEl.setAttribute('data-bound', 'max');
    maxInputEl.setAttribute('aria-label', `${modelNode.label} max`);
    maxInputEl.value = this._formatValue(factorState.max, modelNode.unit);
    maxInputEl.addEventListener('change', (e) => {
      this._handleInputChange(factorId, 'max', e.target.value, modelNode.unit, e.target);
    });
    rowEl.appendChild(maxInputEl);

    return rowEl;
  }

  /**
   * Format value for display
   */
  _formatValue(value, unit) {
    if (unit === 'dollars') {
      // Format large numbers with K/M/B
      if (value >= 1000000000) {
        return `${(value / 1000000000).toFixed(1)}B`;
      } else if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
    }
    return value.toString();
  }

  /**
   * Parse input value (handles K/M/B shorthand for dollars)
   */
  _parseValue(valueStr, unit) {
    const str = valueStr.trim().toUpperCase();

    if (unit === 'dollars') {
      // Handle K/M/B suffixes
      const match = str.match(/^([\d.]+)([KMB]?)$/);
      if (match) {
        const num = parseFloat(match[1]);
        const suffix = match[2];
        if (suffix === 'K') return num * 1000;
        if (suffix === 'M') return num * 1000000;
        if (suffix === 'B') return num * 1000000000;
        return num;
      }
    }

    return parseFloat(str);
  }

  /**
   * Handle input change with validation
   */
  _handleInputChange(factorId, bound, valueStr, unit, inputEl) {
    const value = this._parseValue(valueStr, unit);
    const factorState = this._findFactorState(factorId);

    // Clear previous errors
    inputEl.classList.remove('input-error');
    inputEl.removeAttribute('aria-invalid');

    let isValid = true;

    // Validate: value must be > 0
    if (isNaN(value) || value <= 0) {
      isValid = false;
    }

    // Validate: probability must be <= 1
    if (unit === 'probability' && value > 1) {
      isValid = false;
    }

    // Validate: low <= high (CI mode)
    if (bound === 'low' && factorState.high !== undefined && value > factorState.high) {
      isValid = false;
    }
    if (bound === 'high' && factorState.low !== undefined && value < factorState.low) {
      isValid = false;
    }

    // Validate: min <= mode <= max (PERT mode)
    if (bound === 'min') {
      if (factorState.mode !== undefined && value > factorState.mode) {
        isValid = false;
      }
      if (factorState.max !== undefined && value > factorState.max) {
        isValid = false;
      }
    }
    if (bound === 'mode') {
      if (factorState.min !== undefined && value < factorState.min) {
        isValid = false;
      }
      if (factorState.max !== undefined && value > factorState.max) {
        isValid = false;
      }
    }
    if (bound === 'max') {
      if (factorState.min !== undefined && value < factorState.min) {
        isValid = false;
      }
      if (factorState.mode !== undefined && value < factorState.mode) {
        isValid = false;
      }
    }

    if (!isValid) {
      inputEl.classList.add('input-error');
      inputEl.setAttribute('aria-invalid', 'true');
      return;
    }

    // Update state
    factorState[bound] = value;
    this.onChange();
  }

  /**
   * Setup keyboard navigation for tree
   */
  _setupKeyboardNav(treeEl) {
    treeEl.addEventListener('keydown', (e) => {
      const currentItem = e.target.closest('[role="treeitem"]');
      if (!currentItem) return;

      const allItems = Array.from(treeEl.querySelectorAll('[role="treeitem"]'));
      const currentIndex = allItems.indexOf(currentItem);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (currentIndex < allItems.length - 1) {
            allItems[currentIndex + 1].focus();
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (currentIndex > 0) {
            allItems[currentIndex - 1].focus();
          }
          break;

        case 'ArrowRight': {
          e.preventDefault();
          const factorId = currentItem.getAttribute('data-factor-id');
          const expanded = currentItem.getAttribute('aria-expanded') === 'true';
          if (!expanded && currentItem.hasAttribute('aria-expanded')) {
            this.toggleExpand(factorId);
          }
          break;
        }

        case 'ArrowLeft': {
          e.preventDefault();
          const factorId = currentItem.getAttribute('data-factor-id');
          const expanded = currentItem.getAttribute('aria-expanded') === 'true';
          if (expanded && factorId !== 'risk') {
            this.toggleExpand(factorId);
          }
          break;
        }

        case 'Enter': {
          e.preventDefault();
          const factorId = currentItem.getAttribute('data-factor-id');
          if (currentItem.hasAttribute('aria-expanded') && factorId !== 'risk') {
            this.toggleExpand(factorId);
          }
          break;
        }

        case 'Escape': {
          e.preventDefault();
          const factorId = currentItem.getAttribute('data-factor-id');
          const expanded = currentItem.getAttribute('aria-expanded') === 'true';
          if (expanded && factorId !== 'risk') {
            this.toggleExpand(factorId);
          }
          break;
        }
      }
    });

    // Make tree items focusable — but don't steal focus from inputs/buttons
    treeEl.addEventListener('click', (e) => {
      if (e.target.closest('input, button')) return;
      const treeitem = e.target.closest('[role="treeitem"]');
      if (treeitem) {
        treeitem.focus();
      }
    });

    // Re-apply tutorial UI if active (prevents callout destruction on re-render)
    if (this._currentTutorialStep) {
      this._reapplyTutorialUI();
    }
  }

  /**
   * Re-apply tutorial UI after tree re-render
   * @private
   */
  async _reapplyTutorialUI() {
    if (!this._currentTutorialStep) return;
    await this.setTutorialUI(this._currentTutorialStep, this._tutorialI18n);
  }

  /**
   * Update UI for tutorial mode
   * @param {Object} stepData - Current tutorial step
   * @param {Object} i18n - I18n instance
   */
  async setTutorialUI(stepData, i18n) {
    const { renderCallout, renderResultsCallout, highlightFactor } = await import('./tutorial-ui.js');

    // Store for re-rendering after tree updates
    this._currentTutorialStep = stepData;
    this._tutorialI18n = i18n;

    // Disable expand/collapse all during tutorial
    const expandAllBtn = this.container.querySelector('.btn-expand-all');
    if (expandAllBtn) {
      expandAllBtn.disabled = true;
      expandAllBtn.title = 'Disabled during tutorial';
    }

    // Highlight factor if specified
    if (stepData.factorId) {
      highlightFactor(stepData.factorId);
    }

    // Render callout and scroll it into view
    if (stepData.factorId && stepData.factorId !== 'results') {
      const factorEl = this.container.querySelector(`[data-factor-id="${stepData.factorId}"]`);
      if (factorEl) {
        renderCallout(factorEl, stepData, i18n);
        const callout = factorEl.querySelector('.tutorial-callout');
        if (callout) {
          requestAnimationFrame(() => callout.scrollIntoView({ behavior: 'smooth', block: 'center' }));
        }
      }
    } else if (stepData.factorId === 'results') {
      const resultsPanel = document.getElementById('results-panel');
      if (resultsPanel) {
        renderResultsCallout(resultsPanel, stepData, i18n);
        const callout = resultsPanel.querySelector('.tutorial-callout');
        if (callout) {
          requestAnimationFrame(() => callout.scrollIntoView({ behavior: 'smooth', block: 'center' }));
        }
      }
    }
  }

  /**
   * Clear tutorial UI elements
   */
  async clearTutorialUI() {
    this._currentTutorialStep = null;
    this._tutorialI18n = null;

    // Re-enable expand/collapse all
    const expandAllBtn = this.container.querySelector('.btn-expand-all');
    if (expandAllBtn) {
      expandAllBtn.disabled = false;
      expandAllBtn.title = '';
    }

    const { clearAllTutorialUI } = await import('./tutorial-ui.js');
    clearAllTutorialUI();
  }
}
