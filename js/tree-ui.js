/**
 * Factor Tree UI
 * Renders FAIR factor tree as interactive DOM with ARIA roles, expand/collapse,
 * CI input fields, validation, tooltips, and keyboard navigation.
 */

import { FAIR } from './fair-model.js';

export class FactorTreeUI {
  constructor(container, modelTree, onChange) {
    this.container = container;
    this.modelTree = modelTree;
    this.onChange = onChange;

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
      // Collapse: delete children, restore low/high from model defaults
      factorState.expanded = false;
      delete factorState.children;
      factorState.low = modelNode.defaultLow;
      factorState.high = modelNode.defaultHigh;
    } else {
      // Expand: create children from model, delete low/high
      factorState.expanded = true;
      delete factorState.low;
      delete factorState.high;
      factorState.children = {};

      for (const child of modelNode.children) {
        factorState.children[child.id] = {
          expanded: false,
          low: child.defaultLow,
          high: child.defaultHigh
        };
      }
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
   * Render the entire tree
   */
  _render() {
    this.container.innerHTML = '';

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
    itemEl.style.paddingLeft = `${depth * 20}px`;

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
    labelEl.textContent = modelNode.label;
    labelEl.setAttribute('title', modelNode.tooltip);
    headerEl.appendChild(labelEl);

    // Unit indicator
    const unitEl = document.createElement('span');
    unitEl.className = 'factor-unit';
    unitEl.textContent = `(${modelNode.unit})`;
    headerEl.appendChild(unitEl);

    itemEl.appendChild(headerEl);

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
    lowLabelEl.textContent = 'Low:';
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
    highLabelEl.textContent = 'High:';
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

    // Validate: low <= high
    if (bound === 'low' && factorState.high !== undefined && value > factorState.high) {
      isValid = false;
    }
    if (bound === 'high' && factorState.low !== undefined && value < factorState.low) {
      isValid = false;
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

    // Make tree items focusable
    treeEl.addEventListener('click', (e) => {
      const treeitem = e.target.closest('[role="treeitem"]');
      if (treeitem) {
        treeitem.focus();
      }
    });
  }
}
