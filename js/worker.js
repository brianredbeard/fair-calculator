// js/worker.js

// --- Inlined FAIR Model ---

const FAIR = (() => {
  const tree = {
    id: 'risk',
    label: 'Risk',
    unit: 'dollars',
    defaultLow: 10000,
    defaultHigh: 10000000,
    tooltip: 'Annualized Loss Expectancy (ALE) - expected annual loss from a risk scenario',
    children: [
      {
        id: 'lef',
        label: 'LEF',
        unit: 'events/year',
        defaultLow: 1,
        defaultHigh: 10,
        tooltip: 'Loss Event Frequency - expected number of loss events per year',
        children: [
          {
            id: 'tef',
            label: 'TEF',
            unit: 'events/year',
            defaultLow: 5,
            defaultHigh: 50,
            tooltip: 'Threat Event Frequency - rate at which threat agents act against assets',
            children: [
              {
                id: 'cf',
                label: 'CF',
                unit: 'events/year',
                defaultLow: 10,
                defaultHigh: 100,
                tooltip: 'Contact Frequency - rate at which threat agents come into contact with assets',
                children: null
              },
              {
                id: 'poa',
                label: 'PoA',
                unit: 'probability',
                defaultLow: 0.1,
                defaultHigh: 0.8,
                tooltip: 'Probability of Action - likelihood threat agent acts given contact opportunity',
                children: null
              }
            ]
          },
          {
            id: 'vuln',
            label: 'Vuln',
            unit: 'probability',
            defaultLow: 0.1,
            defaultHigh: 0.5,
            tooltip: 'Vulnerability - probability that threat action results in loss',
            children: [
              {
                id: 'tcap',
                label: 'TCap',
                unit: 'score',
                defaultLow: 20,
                defaultHigh: 80,
                tooltip: 'Threat Capability - skill/resources of threat agent (0-100 scale)',
                children: null
              },
              {
                id: 'rs',
                label: 'RS',
                unit: 'score',
                defaultLow: 30,
                defaultHigh: 70,
                tooltip: 'Resistance Strength - strength of controls protecting asset (0-100 scale)',
                children: null
              }
            ]
          }
        ]
      },
      {
        id: 'lm',
        label: 'LM',
        unit: 'dollars',
        defaultLow: 50000,
        defaultHigh: 5000000,
        tooltip: 'Loss Magnitude - expected dollar loss from a single event',
        children: [
          {
            id: 'primary',
            label: 'Primary',
            unit: 'dollars',
            defaultLow: 30000,
            defaultHigh: 3000000,
            tooltip: 'Primary Loss - direct losses from the event itself',
            children: [
              {
                id: 'productivity',
                label: 'Productivity',
                unit: 'dollars',
                defaultLow: 10000,
                defaultHigh: 1000000,
                tooltip: 'Productivity loss from disrupted operations',
                children: null
              },
              {
                id: 'response',
                label: 'Response',
                unit: 'dollars',
                defaultLow: 10000,
                defaultHigh: 500000,
                tooltip: 'Cost of responding to and recovering from the event',
                children: null
              },
              {
                id: 'replacement',
                label: 'Replacement',
                unit: 'dollars',
                defaultLow: 5000,
                defaultHigh: 500000,
                tooltip: 'Cost of replacing compromised assets',
                children: null
              }
            ]
          },
          {
            id: 'secondary',
            label: 'Secondary',
            unit: 'dollars',
            defaultLow: 10000,
            defaultHigh: 2000000,
            tooltip: 'Secondary Loss - losses from external stakeholder reactions',
            children: [
              {
                id: 'slef',
                label: 'SLEF',
                unit: 'probability',
                defaultLow: 0.2,
                defaultHigh: 0.9,
                tooltip: 'Secondary Loss Event Frequency - probability that secondary losses occur',
                children: null
              },
              {
                id: 'slm',
                label: 'SLM',
                unit: 'dollars',
                defaultLow: 50000,
                defaultHigh: 5000000,
                tooltip: 'Secondary Loss Magnitude - expected dollar loss from secondary effects',
                children: [
                  {
                    id: 'reputation',
                    label: 'Reputation',
                    unit: 'dollars',
                    defaultLow: 10000,
                    defaultHigh: 2000000,
                    tooltip: 'Reputational damage costs',
                    children: null
                  },
                  {
                    id: 'competitive',
                    label: 'Competitive Advantage',
                    unit: 'dollars',
                    defaultLow: 5000,
                    defaultHigh: 1000000,
                    tooltip: 'Loss of competitive advantage',
                    children: null
                  },
                  {
                    id: 'fines',
                    label: 'Fines & Judgments',
                    unit: 'dollars',
                    defaultLow: 5000,
                    defaultHigh: 2000000,
                    tooltip: 'Regulatory fines and legal judgments',
                    children: null
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  const combinationRules = {
    risk: (values) => values.lef * values.lm,
    lef: (values) => values.tef * values.vuln,
    tef: (values) => values.cf * values.poa,
    vuln: (values) => values.tcap > values.rs ? 1 : 0,
    lm: (values) => values.primary + values.secondary,
    primary: (values) => values.productivity + values.response + values.replacement,
    secondary: (values) => values.slef * values.slm,
    slm: (values) => values.reputation + values.competitive + values.fines
  };

  function findNode(id, node = tree) {
    if (node.id === id) {
      return node;
    }
    if (node.children) {
      for (const child of node.children) {
        const found = findNode(id, child);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  function combine(factorId, childValues) {
    const rule = combinationRules[factorId];
    if (!rule) {
      throw new Error(`No combination rule for factor: ${factorId}`);
    }
    return rule(childValues);
  }

  return {
    tree,
    combinationRules,
    findNode,
    combine
  };
})();

// --- Inlined math utilities (from prng.js) ---

/**
 * FNV-1a 32-bit hash function
 * @param {string} str - Input string to hash
 * @returns {number} 32-bit unsigned integer hash
 */
function fnv1a32(str) {
  const FNV_OFFSET_BASIS = 0x811c9dc5;
  const FNV_PRIME = 0x01000193;

  let hash = FNV_OFFSET_BASIS;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, FNV_PRIME);
  }

  return hash >>> 0; // Convert to unsigned 32-bit integer
}

/**
 * Canonical JSON stringify with sorted keys at every level
 * @param {any} obj - Object to stringify
 * @returns {string} JSON string with sorted keys
 */
function canonicalJsonStringify(obj) {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return '[' + obj.map(item => canonicalJsonStringify(item)).join(',') + ']';
  }

  // Sort object keys
  const keys = Object.keys(obj).sort();
  const pairs = keys.map(key => {
    const value = canonicalJsonStringify(obj[key]);
    return `"${key}":${value}`;
  });

  return '{' + pairs.join(',') + '}';
}

/**
 * Splitmix32 helper for seeding xorshift128+
 * @param {number} seed - Input seed
 * @returns {number} 32-bit unsigned integer
 */
function splitmix32(seed) {
  seed = (seed + 0x9e3779b9) | 0;
  let z = seed;
  z = Math.imul(z ^ (z >>> 16), 0x21f0aaad);
  z = Math.imul(z ^ (z >>> 15), 0x735a2d97);
  return (z ^ (z >>> 15)) >>> 0;
}

/**
 * Create a seeded xorshift128+ PRNG
 * @param {number} seed - Seed value
 * @returns {function(): number} RNG function that returns numbers in [0, 1)
 */
function createPRNG(seed) {
  let s0 = splitmix32(seed) || 1;
  let s1 = splitmix32(seed + 0x9e3779b9) || 1;

  return function next() {
    let a = s0;
    const b = s1;
    s0 = b;

    a ^= (a << 23);
    a ^= (a >>> 17);
    a ^= b;
    a ^= (b >>> 26);
    s1 = a;

    return ((s0 + s1) >>> 0) / 0x100000000;
  };
}

/**
 * Derive lognormal distribution parameters from 90% confidence interval
 * @param {number} low - Lower bound (5th percentile)
 * @param {number} high - Upper bound (95th percentile)
 * @returns {{mu: number, sigma: number}} Distribution parameters
 */
function lognormalParams(low, high) {
  const mu = (Math.log(low) + Math.log(high)) / 2;
  const sigma = (Math.log(high) - Math.log(low)) / (2 * 1.645);
  return { mu, sigma };
}

/**
 * Sample from lognormal distribution using Box-Muller transform
 * @param {function(): number} rng - Random number generator
 * @param {number} mu - Lognormal mu parameter
 * @param {number} sigma - Lognormal sigma parameter
 * @param {number} [clampMax] - Optional maximum value to clamp to
 * @returns {number} Sample from lognormal distribution
 */
function sampleLognormal(rng, mu, sigma, clampMax) {
  // Box-Muller transform for standard normal
  let u1 = rng();
  // Avoid log(0)
  if (u1 === 0) u1 = 1e-10;
  const u2 = rng();

  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

  // Transform to lognormal
  let sample = Math.exp(mu + sigma * z);

  // Clamp if requested
  if (clampMax !== undefined) {
    sample = Math.max(0, Math.min(sample, clampMax));
  }

  return sample;
}

/**
 * Version constant for PERT implementation (must match prng.js)
 */
const PERT_VERSION = 1;

/**
 * Derive Beta-PERT distribution parameters
 * @param {number} min - Minimum value
 * @param {number} mode - Most likely value
 * @param {number} max - Maximum value
 * @param {number} [lambda=4] - Shape parameter (higher = more concentrated around mode)
 * @returns {{alpha: number, beta: number, min: number, max: number}} Distribution parameters
 */
function pertParams(min, mode, max, lambda = 4) {
  const range = max - min;
  const alpha = 1 + lambda * (mode - min) / range;
  const beta = 1 + lambda * (max - mode) / range;
  return { alpha, beta, min, max };
}

/**
 * Sample from gamma distribution using Marsaglia and Tsang's method
 * @param {function(): number} rng - Random number generator
 * @param {number} alpha - Shape parameter
 * @returns {number} Sample from Gamma(alpha, 1)
 */
function sampleGamma(rng, alpha) {
  // For alpha < 1, use transformation method
  if (alpha < 1) {
    const sample = sampleGamma(rng, alpha + 1);
    return sample * Math.pow(rng(), 1 / alpha);
  }

  // Marsaglia and Tsang's method for alpha >= 1
  const d = alpha - 1/3;
  const c = 1 / Math.sqrt(9 * d);

  while (true) {
    let x, v;
    do {
      // Box-Muller for standard normal
      let u1 = rng();
      if (u1 === 0) u1 = 1e-10;
      const u2 = rng();
      x = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      v = 1 + c * x;
    } while (v <= 0);

    v = v * v * v;
    const u = rng();

    if (u < 1 - 0.0331 * x * x * x * x) {
      return d * v;
    }

    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) {
      return d * v;
    }
  }
}

/**
 * Sample from Beta-PERT distribution
 * @param {function(): number} rng - Random number generator
 * @param {number} min - Minimum value
 * @param {number} mode - Most likely value
 * @param {number} max - Maximum value
 * @param {number} [lambda=4] - Shape parameter
 * @returns {number} Sample from PERT distribution in [min, max]
 */
function samplePERT(rng, min, mode, max, lambda = 4) {
  // Handle degenerate case where min == max (point mass)
  // This happens when all three PERT values are the same (e.g., [0.001, 0.001, 0.001])
  if (min === max) {
    return min;
  }

  const { alpha, beta } = pertParams(min, mode, max, lambda);

  // Sample from Beta(alpha, beta) using two gamma samples
  const x = sampleGamma(rng, alpha);
  const y = sampleGamma(rng, beta);
  const betaSample = x / (x + y);

  // Scale to [min, max]
  let sample = min + betaSample * (max - min);

  // Clamp to [min, max] as safety net
  sample = Math.max(min, Math.min(sample, max));

  return sample;
}

// --- Factor resolution ---

const PROBABILITY_FACTORS = ['poa', 'vuln', 'slef'];
const LOSS_CATEGORIES = [
  'productivity', 'response', 'replacement', 'reputation',
  'competitive_advantage', 'fines', 'primary', 'secondary', 'slm'
];

function isProbabilityFactor(factorId) {
  return PROBABILITY_FACTORS.includes(factorId);
}

function isLossCategory(id) {
  return LOSS_CATEGORIES.includes(id);
}

function validateFactor(factorId, low, high) {
  if (typeof low !== 'number' || typeof high !== 'number') {
    throw new Error(`Factor ${factorId}: low and high must be numbers`);
  }
  if (isNaN(low) || isNaN(high)) {
    throw new Error(`Factor ${factorId}: low and high cannot be NaN`);
  }
  if (low <= 0) {
    throw new Error(`Factor ${factorId}: low must be positive (got ${low})`);
  }
  if (high <= 0) {
    throw new Error(`Factor ${factorId}: high must be positive (got ${high})`);
  }
  if (low > high) {
    throw new Error(`Factor ${factorId}: low cannot be greater than high (${low} > ${high})`);
  }
}

function resolveFactor(factorId, factorState, rng, categoryAccum, settings) {
  if (!factorState.expanded || !factorState.children) {
    // Leaf or collapsed: check for PERT or CI mode
    let value;

    if (factorState.min !== undefined && factorState.max !== undefined) {
      // PERT mode: sample from PERT distribution
      const min = factorState.min;
      const mode = factorState.mode;
      const max = factorState.max;
      const lambda = settings && settings.pertLambda !== undefined ? settings.pertLambda : 4;

      // Validate PERT inputs
      if (typeof min !== 'number' || typeof mode !== 'number' || typeof max !== 'number') {
        throw new Error(`Factor ${factorId}: min, mode, max must be numbers`);
      }
      if (isNaN(min) || isNaN(mode) || isNaN(max)) {
        throw new Error(`Factor ${factorId}: min, mode, max cannot be NaN`);
      }
      if (min <= 0 || mode <= 0 || max <= 0) {
        throw new Error(`Factor ${factorId}: min, mode, max must be positive`);
      }
      if (min > mode || mode > max) {
        throw new Error(`Factor ${factorId}: must have min <= mode <= max (got min=${min}, mode=${mode}, max=${max})`);
      }
      if (isProbabilityFactor(factorId) && max > 1) {
        throw new Error(`Factor ${factorId}: probability max cannot exceed 1 (got ${max})`);
      }

      value = samplePERT(rng, min, mode, max, lambda);

      // Clamp probability factors to [0, 1]
      if (isProbabilityFactor(factorId)) {
        value = Math.max(0, Math.min(value, 1));
      }
    } else {
      // CI mode: sample from lognormal
      const low = factorState.low;
      const high = factorState.high;

      validateFactor(factorId, low, high);

      const { mu, sigma } = lognormalParams(low, high);
      const clampMax = isProbabilityFactor(factorId) ? 1 : undefined;
      value = sampleLognormal(rng, mu, sigma, clampMax);
    }

    // Track in categoryAccum if this is a loss category
    if (isLossCategory(factorId) && categoryAccum) {
      if (!categoryAccum[factorId]) {
        categoryAccum[factorId] = 0;
      }
      categoryAccum[factorId] += value;
    }

    return value;
  }

  // Expanded: resolve each child recursively, then FAIR.combine
  const childValues = {};
  for (const [childId, childState] of Object.entries(factorState.children)) {
    childValues[childId] = resolveFactor(childId, childState, rng, categoryAccum, settings);
  }

  const combinedValue = FAIR.combine(factorId, childValues);

  // If this expanded factor is itself a loss category, track the combined value
  if (isLossCategory(factorId) && categoryAccum) {
    if (!categoryAccum[factorId]) {
      categoryAccum[factorId] = 0;
    }
    categoryAccum[factorId] += combinedValue;
  }

  return combinedValue;
}

function hasExpandedLM(factors) {
  return factors.risk?.children?.lm?.expanded === true;
}

// --- Main simulation ---
self.onmessage = function(e) {
  try {
    const { iterations, factors, settings } = e.data;

    // Derive seed from canonical input
    const canonicalInput = canonicalJsonStringify(e.data);
    const seed = fnv1a32(canonicalInput);
    const rng = createPRNG(seed);

    // Check if we need to track category breakdown
    const trackCategories = hasExpandedLM(factors);

    // Storage for ALE values
    const ales = new Float64Array(iterations);

    // Category accumulator
    const categoryTotals = {};

    // Run iterations
    for (let i = 0; i < iterations; i++) {
      const categoryAccum = trackCategories ? {} : null;
      const ale = resolveFactor('risk', factors.risk, rng, categoryAccum, settings);
      ales[i] = ale;

      // Accumulate category totals
      if (trackCategories && categoryAccum) {
        for (const [cat, value] of Object.entries(categoryAccum)) {
          if (!categoryTotals[cat]) {
            categoryTotals[cat] = 0;
          }
          categoryTotals[cat] += value;
        }
      }
    }

    // Sort ALE values
    const sortedALE = Array.from(ales).sort((a, b) => a - b);

    // Compute statistics
    const sum = sortedALE.reduce((acc, val) => acc + val, 0);
    const mean = sum / iterations;
    const median = sortedALE[Math.floor(iterations * 0.5)];
    const p90 = sortedALE[Math.floor(iterations * 0.9)];
    const min = sortedALE[0];
    const max = sortedALE[iterations - 1];

    const stats = { mean, median, p90, min, max };

    // Compute category breakdown (means)
    const categoryBreakdown = {};
    if (trackCategories) {
      for (const [cat, total] of Object.entries(categoryTotals)) {
        categoryBreakdown[cat] = total / iterations;
      }
    }

    // Post results
    const result = {
      type: 'results',
      sortedALE,
      stats,
    };

    if (trackCategories) {
      result.categoryBreakdown = categoryBreakdown;
    }

    self.postMessage(result);
  } catch (err) {
    self.postMessage({ type: 'error', message: err.message });
  }
};
