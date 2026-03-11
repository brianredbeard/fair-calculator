# FAIR Calculator — User Manual

A single-page web application for performing Factor Analysis of Information Risk (FAIR) calculations, outputting annualized risk in dollar figures via Monte Carlo simulation.

## Getting Started

Serve the project directory with any static HTTP server:

```bash
python3 -m http.server 8080
# Open http://localhost:8080
```

The calculator loads with default values and immediately runs a simulation. The left panel contains the risk factor inputs; the right panel shows the simulation results.

## The FAIR Model

FAIR decomposes risk into two top-level factors:

- **Loss Event Frequency (LEF)** — how many loss events occur per year
- **Loss Magnitude (LM)** — how much each event costs in dollars

Annualized Loss Exposure (ALE) = LEF x LM, computed across thousands of Monte Carlo iterations to produce a probability distribution rather than a single number.

### Factor Tree

Each top-level factor can be decomposed into sub-factors for more precise estimation:

```
Risk (ALE)
├── Loss Event Frequency (LEF)
│   ├── Threat Event Frequency (TEF)
│   │   ├── Contact Frequency (CF) — events/year
│   │   └── Probability of Action (PoA) — 0 to 1
│   └── Vulnerability (Vuln)
│       ├── Threat Capability (TCap) — score 0–100
│       └── Resistance Strength (RS) — score 0–100
└── Loss Magnitude (LM)
    ├── Primary Loss
    │   ├── Productivity — dollars
    │   ├── Response — dollars
    │   └── Replacement — dollars
    └── Secondary Loss
        ├── Secondary Loss Event Frequency (SLEF) — 0 to 1
        └── Secondary Loss Magnitude (SLM)
            ├── Reputation — dollars
            ├── Competitive Advantage — dollars
            └── Fines & Judgments — dollars
```

### How Factors Combine

| Factor | Rule |
|--------|------|
| Risk (ALE) | LEF x LM |
| LEF | TEF x Vuln |
| TEF | CF x PoA |
| Vuln | 1 if TCap > RS, else 0 (per iteration) |
| LM | Primary + Secondary |
| Primary | Productivity + Response + Replacement |
| Secondary | SLEF x SLM |
| SLM | Reputation + Competitive Advantage + Fines |

## Entering Values

### Confidence Intervals

Every factor accepts a **90% confidence interval** — a low and high bound representing the range within which you believe the true value falls with 90% confidence. The engine fits a lognormal distribution to these bounds, meaning:

- Values cluster around the geometric mean of your low and high
- The distribution is right-skewed (there is always a long tail of high values)
- More extreme values are possible but increasingly unlikely

**Example:** If you enter LEF Low: 1, High: 10, you are saying "I am 90% confident that between 1 and 10 loss events will occur per year." The simulation will sample mostly in this range, but some iterations will produce values outside it — that is by design.

### Value Formats

| Factor Type | Unit | Input Format |
|-------------|------|-------------|
| Frequency (LEF, TEF, CF) | events/year | Plain numbers: `1`, `10`, `50` |
| Probability (PoA, Vuln, SLEF) | 0 to 1 | Decimal: `0.1`, `0.5`, `0.9` |
| Capability/Strength (TCap, RS) | Score 0–100 | Plain numbers: `20`, `50`, `80` |
| Loss amounts (all dollar factors) | USD | Supports shorthand: `50K`, `1.5M`, `2B` |

Dollar shorthand: `K` = thousands, `M` = millions, `B` = billions. Leading `$` and commas are stripped automatically.

### Validation Rules

- All values must be greater than zero (the lognormal distribution requires positive inputs)
- Low must be less than or equal to High
- Probability factors are constrained to the range (0, 1]
- Invalid inputs are highlighted in red and will not trigger a recalculation

## Flexible Depth — Expand and Collapse

You can enter values at whatever level of the tree you have data for. Each composite factor (one with sub-factors) has an expand/collapse toggle:

- **Collapsed (default):** Enter a confidence interval directly for the composite factor. Use this when you have a direct estimate ("I think we'll see 1–10 loss events per year").
- **Expanded:** The direct input is replaced by its sub-factor inputs. Use this when you can estimate the components more precisely than the composite ("I don't know LEF directly, but I know we had about 5–50 threat events and our vulnerability is somewhere between 10–50%").

### Decomposition Changes the Distribution

**This is the most important concept to understand.** Expanding a factor into sub-factors changes the output distribution, even when the sub-factor ranges seem to "add up" to the original range. This is not a bug — it reflects a fundamental property of combining probability distributions.

**Example:**

| Configuration | Min | Median | Mean | 90th | Max |
|---|---|---|---|---|---|
| LM collapsed: $50K–$5M | $5.9K | $1.6M | $5.3M | $11.3M | $660.2M |
| LM expanded: Primary $30K–$3M + Secondary $10K–$2M | $20.7K | $2.0M | $4.3M | $9.4M | $102.4M |

**Why the numbers differ:**

- **Higher minimum** ($20.7K vs $5.9K): Two lognormal samples each have positive floors. Their sum can never be lower than both floors combined.
- **Lower maximum** ($102.4M vs $660.2M): The sum of two independent lognormals has a lighter tail than a single wide lognormal. Extreme outcomes require *both* components to be extreme simultaneously, which is less likely.
- **Higher median** ($2.0M vs $1.6M): The sum of medians from two distributions typically exceeds the median of a single wide distribution.
- **Tighter overall range**: Decomposition produces a more concentrated distribution because the sub-components constrain each other.

**The takeaway:** Decomposing factors gives you a more informative, typically tighter distribution. If you have specific knowledge about sub-factors, expanding them produces a more accurate risk estimate than guessing at the composite level.

### The Vulnerability Special Case

Vulnerability (Vuln) behaves differently from other factors when expanded. At the collapsed level, you enter a probability (e.g., 0.1–0.5). When expanded into Threat Capability (TCap) and Resistance Strength (RS), the calculation becomes binary per iteration:

- If TCap sample > RS sample → Vuln = 1 (the threat succeeds)
- If TCap sample ≤ RS sample → Vuln = 0 (the control holds)

This means LEF for that iteration is either the full TEF (threat succeeds) or zero (threat fails). The result is a distribution with many zero-loss iterations and some high-loss iterations — a bimodal pattern that produces a lower median but similar or higher mean compared to the collapsed estimate.

If you see a Minimum of $0 and a Median of $0 after expanding Vuln, this is correct — it means more than half of the simulated iterations had the controls hold (TCap ≤ RS), resulting in zero loss events.

## Results

### Loss Exceedance Curve

The primary output. Shows the probability that annualized loss exceeds any given dollar amount.

- **X-axis:** Annualized loss in dollars
- **Y-axis:** Probability of exceeding that amount (100% at the left, approaching 0% at the right)
- **Median marker (green dashed line):** The 50th percentile — there is a 50% chance actual loss will exceed this amount
- **90th Percentile marker (red dashed line):** The "reasonable worst case" — there is a 10% chance actual loss will exceed this amount

#### Log Scale vs. Linear

The chart defaults to **logarithmic x-axis** scaling, which is the industry standard for FAIR analysis. Because the underlying data follows a lognormal distribution, log scale spreads the curve into a readable S-shape where you can distinguish values across the full range ($1K to $1B).

Toggle to **Linear** to see the raw distribution shape. In linear mode, the heavy right tail compresses most of the curve into the left portion of the chart — useful for seeing how far the tail extends, but harder to read in the information-dense region.

### Summary Statistics

| Statistic | Meaning |
|-----------|---------|
| Minimum | Lowest simulated annual loss across all iterations |
| Mean | Average annual loss — the "expected value" used in cost-benefit analysis |
| Median | 50th percentile — half of iterations produced a loss below this amount |
| 90th Percentile | Only 10% of iterations exceeded this — the "reasonable worst case" |
| Maximum | Highest simulated annual loss — represents an extreme but possible outcome |

**Which number to use:** Use the **Mean** for budgeting and cost-benefit analysis (it represents expected annual cost). Use the **90th Percentile** for risk appetite statements and insurance discussions (it represents a credible worst case without being alarmist). Use the **Median** to understand the "typical" year.

### Loss Category Breakdown

Visible when Loss Magnitude sub-factors are expanded. Shows the mean contribution of each loss category as a proportion of total loss. Categories are sorted by contribution, with colored bars showing relative magnitude.

When only some sub-factors are expanded, collapsed composites appear as a single entry (e.g., "Secondary Loss" as one row when only Primary is expanded).

## Monte Carlo Simulation

### How It Works

The calculator runs a configurable number of iterations (default: 10,000). Each iteration:

1. Samples a value for each leaf-level factor from its lognormal distribution
2. Walks up the tree, combining values per the FAIR rules
3. Produces one Annualized Loss Exposure (ALE) value

The collection of ALE values across all iterations forms the loss distribution shown in the chart and statistics.

### Iteration Count

Adjustable from 1,000 to 100,000 via the iterations input in the top bar.

- **1,000:** Fast results, lower precision. Good for quick exploration.
- **10,000 (default):** Good balance of speed and precision for most analyses.
- **100,000:** Higher precision, slightly slower. Use when you need stable percentile estimates for reporting.

The simulation runs in a background Web Worker, so the interface stays responsive during computation.

### Determinism

Results are deterministic — the same inputs always produce the same outputs. The random number generator is seeded from a hash of the input state, so sharing a URL guarantees the recipient sees identical results.

## Saving and Sharing

### URL Sharing

Every input change updates the URL hash in real time. The URL encodes the complete calculator state — all factor values, expansion states, scenario name, and iteration count.

To share a scenario: click **Copy URL** and send the link. The recipient opens it and sees the exact same inputs and results. No account or server needed.

### Local Scenarios

Click **Scenarios** in the top bar to save, load, and manage scenarios in your browser's local storage. Scenarios persist across browser sessions on the same device but are not synced across devices — use URL sharing for that.

## Exporting Charts

**Export PNG** and **Export SVG** buttons produce presentation-grade images suitable for executive reports:

- High resolution (3x pixel density for PNG)
- White background with large, readable fonts
- Title block with scenario name, date, and iteration count
- Percentile annotations positioned for clarity

The exported image uses a separate rendering configuration optimized for print and slides, independent of the in-app display.

## Themes

Three themes are available via the toggle button in the top bar:

| Theme | Use When |
|-------|----------|
| Dark (default) | Standard use, reduced eye strain |
| Light | Bright environments, projector presentations |
| High Contrast | Visual impairment support, WCAG AAA compliance |

The selected theme is saved to local storage and persists across sessions. On first visit, the calculator respects your system's color scheme preference.

## Accessibility

- Full WAI-ARIA 2.0 tree roles on the factor input panel
- Keyboard navigation: Arrow keys to move between factors, Enter/Right to expand, Left/Escape to collapse, Tab between input fields
- Skip navigation link to jump directly to results
- Screen reader labels on all inputs include factor name, bound type, and unit
- High contrast mode with WCAG AAA contrast ratios
- Reduced motion support for users with `prefers-reduced-motion` enabled

## Technical Notes

### Lognormal Distribution

Given a 90% confidence interval [Low, High], the lognormal parameters are:

```
μ = (ln(Low) + ln(High)) / 2
σ = (ln(High) - ln(Low)) / (2 × 1.645)
```

Where 1.645 is the z-score for a 90% confidence interval. Samples are generated via the Box-Muller transform.

Probability factors (PoA, Vuln when collapsed, SLEF) are clamped to [0, 1] after sampling to prevent values exceeding 100%.

### Zero Values

All inputs must be greater than zero because the lognormal distribution requires positive values (ln(0) is undefined). If you believe a factor could be zero, use a very small positive number (e.g., 0.001) as the low bound.

### Browser Requirements

Modern browser with ES module support, Web Workers, and the Clipboard API. No server-side processing — all computation happens in your browser.
