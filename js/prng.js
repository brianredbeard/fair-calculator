/**
 * FNV-1a 32-bit hash function
 * @param {string} str - Input string to hash
 * @returns {number} 32-bit unsigned integer hash
 */
export function fnv1a32(str) {
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
export function canonicalJsonStringify(obj) {
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
export function createPRNG(seed) {
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
export function lognormalParams(low, high) {
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
export function sampleLognormal(rng, mu, sigma, clampMax) {
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
 * Version constant for PERT implementation (must match worker.js)
 */
export const PERT_VERSION = 1;

/**
 * Derive Beta-PERT distribution parameters
 * @param {number} min - Minimum value
 * @param {number} mode - Most likely value
 * @param {number} max - Maximum value
 * @param {number} [lambda=4] - Shape parameter (higher = more concentrated around mode)
 * @returns {{alpha: number, beta: number, min: number, max: number}} Distribution parameters
 */
export function pertParams(min, mode, max, lambda = 4) {
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
export function samplePERT(rng, min, mode, max, lambda = 4) {
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
