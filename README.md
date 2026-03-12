# FAIR Calculator

A browser-based calculator for [Factor Analysis of Information Risk (FAIR)](https://www.opengroup.org/forum/the-open-group-fair-body-of-knowledge) that estimates annualized cyber risk in dollar figures using Monte Carlo simulation.

No server, no accounts, no dependencies to install. Open `index.html` in a browser and start analyzing risk.

## Quick Start

Serve the project directory with any static HTTP server:

```bash
python3 -m http.server 8000
```

Open http://localhost:8000. The calculator loads with default values and immediately runs a simulation.

## What It Does

Enter estimates for how often bad things happen (Loss Event Frequency) and how much they cost (Loss Magnitude). The calculator runs 10,000 Monte Carlo iterations and produces:

- A **loss exceedance curve** showing the probability of exceeding any given dollar amount
- **Summary statistics**: mean, median, 90th percentile, min, and max annualized loss
- **Loss category breakdown** when sub-factors are expanded

### Two Levels of Analysis

- **Stage 1** — Estimate LEF and LM directly. Fast, good for initial scoping.
- **Stage 2** — Decompose into sub-factors (Threat Event Frequency, Vulnerability, Primary/Secondary loss categories, etc.) for more granular, defensible estimates.

Expand or collapse any factor in the tree to work at whatever level you have data for.

### Input Modes

- **CI (Confidence Interval)** — Enter low and high bounds (90% CI). Values are sampled from a lognormal distribution.
- **PERT** — Enter min, most likely, and max. Values are sampled from a Beta-PERT distribution. Adjust the lambda parameter in Settings to control concentration around the mode.

## Features

- **Deterministic simulation** — Same inputs always produce the same outputs (seeded PRNG)
- **URL sharing** — Every input change updates the URL hash. Copy the URL to share exact scenarios.
- **Scenario management** — Save, load, and compare multiple scenarios in localStorage
- **JSON import/export** — Serialize scenario configurations for backup or team sharing
- **Report generation** — Download a plain-text analysis stub with all factor values and rationale placeholders for analyst write-ups
- **Chart export** — Publication-quality PNG and SVG export of the loss exceedance curve
- **Example scenarios** — Load pre-built scenarios (ransomware, insider threat, cloud breach) to explore the model
- **Three themes** — Dark, Light, and High Contrast (WCAG AAA)
- **Accessible** — WAI-ARIA tree roles, full keyboard navigation, screen reader labels, skip-nav
- **Offline-capable** — No network requests after initial page load. All computation runs client-side in a Web Worker.

## Project Structure

```
index.html              Entry point (single page)
css/styles.css          All styles: themes, layout, components
js/
  app.js                App controller: init, events, state, rendering
  tree-ui.js            Factor tree UI: inputs, expand/collapse, ARIA
  fair-model.js         FAIR model definition: tree structure, labels, units
  prng.js               Seeded PRNG (FNV-1a + xoshiro128**), lognormal & PERT sampling
  worker.js             Web Worker: Monte Carlo simulation engine
  state.js              Persistence: scenarios, settings, URL hash encoding
  examples.js           Pre-built example scenarios
  i18n.js               Internationalization support
locales/en.json         English UI strings
vendor/
  echarts.min.js        Apache ECharts 5.6.1 (charting)
  pako.min.js           pako 2.1.0 (URL hash compression)
tests/                  Browser-based test suites (open in browser to run)
DETAILS.md              Comprehensive user manual
```

## Architecture

Zero build step. Vanilla ES modules served directly by any static file server.

- **Simulation** runs in a Web Worker (`worker.js`) to keep the UI responsive
- **State** is serialized to the URL hash (compressed with pako/deflate) for sharing, and to localStorage for persistence
- **PRNG** uses FNV-1a hashing of the full input state as a seed, ensuring deterministic results
- **Rendering** uses ECharts for the loss exceedance curve and pure CSS for the breakdown bars

## Tests

Open any test file in a browser (via a local server):

```bash
# Run all tests
for f in tests/*.test.html; do echo "$f"; done

# Or open individually
open http://localhost:8000/tests/smoke.test.html
```

Test suites: `prng`, `state`, `tree-ui`, `worker`, `fair-model`, `i18n`, `integration`, `smoke`, `export`.

## References

- [Open FAIR Risk Taxonomy (O-RT)](https://publications.opengroup.org/c13k), The Open Group Standard C13K
- Freund & Jones, *Measuring and Managing Information Risk: A FAIR Approach* (2014)
- [FAIR Institute](https://www.fairinstitute.org/)

## License

[MIT](LICENSE) — see LICENSE file for third-party notices.

SPDX-License-Identifier: MIT
