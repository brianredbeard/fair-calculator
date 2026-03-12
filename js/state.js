/**
 * Base64url encode helper
 * Convert standard base64 to base64url (no +, /, or padding)
 * @param {string} base64 - Standard base64 string
 * @returns {string} Base64url encoded string
 */
function base64urlEncode(base64) {
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Base64url decode helper
 * Convert base64url back to standard base64 and decode
 * @param {string} base64url - Base64url encoded string
 * @returns {string} Decoded string
 */
function base64urlDecode(base64url) {
  // Restore standard base64 format
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  // Add padding
  const padding = 4 - (base64.length % 4);
  if (padding !== 4) {
    base64 += '='.repeat(padding);
  }
  return atob(base64);
}

/**
 * Encode state object to URL hash
 * JSON.stringify → pako.deflate → base64url encode
 * @param {object} state - Object to encode
 * @returns {string} Base64url encoded compressed state
 */
export function encodeStateToHash(state) {
  const json = JSON.stringify(state);
  const compressed = window.pako.deflate(json);
  const base64 = btoa(String.fromCharCode(...compressed));
  return base64urlEncode(base64);
}

/**
 * Decode state object from URL hash
 * base64url decode → pako.inflate → JSON.parse
 * @param {string} hash - Base64url encoded hash
 * @returns {object|null} Decoded state object, or null if invalid
 */
export function decodeStateFromHash(hash) {
  if (!hash || hash.length === 0) {
    return null;
  }

  try {
    const base64 = base64urlDecode(hash);
    const compressed = new Uint8Array(base64.length);
    for (let i = 0; i < base64.length; i++) {
      compressed[i] = base64.charCodeAt(i);
    }
    const inflated = window.pako.inflate(compressed, { to: 'string' });
    return JSON.parse(inflated);
  } catch (e) {
    return null;
  }
}

/**
 * Scenario storage manager using localStorage
 * Handles CRUD operations for simulation scenarios
 */
export class ScenarioStore {
  /**
   * @param {string} namespace - localStorage key namespace (default: 'fair-calc-scenarios')
   */
  constructor(namespace = 'fair-calc-scenarios') {
    this.namespace = namespace;
  }

  /**
   * Generate a unique ID for new scenarios
   * @returns {string} Unique ID
   */
  _generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  /**
   * Read all scenarios from localStorage
   * @returns {object} Map of id → scenario
   */
  _readAll() {
    const json = localStorage.getItem(this.namespace);
    if (!json) {
      return {};
    }
    try {
      return JSON.parse(json);
    } catch (e) {
      return {};
    }
  }

  /**
   * Write all scenarios to localStorage
   * @param {object} data - Map of id → scenario
   */
  _writeAll(data) {
    localStorage.setItem(this.namespace, JSON.stringify(data));
  }

  /**
   * List all scenarios with metadata (id, name, lastModified)
   * Sorted by lastModified descending (most recent first)
   * @returns {array} Array of {id, name, lastModified}
   */
  list() {
    const all = this._readAll();
    const list = Object.keys(all).map(id => ({
      id,
      name: all[id].name || 'Untitled',
      lastModified: all[id].lastModified || 0
    }));
    // Sort by lastModified descending (most recent first)
    list.sort((a, b) => b.lastModified - a.lastModified);
    return list;
  }

  /**
   * Load a scenario by id
   * @param {string} id - Scenario ID
   * @returns {object|null} Full scenario object or null if not found
   */
  load(id) {
    const all = this._readAll();
    return all[id] || null;
  }

  /**
   * Save a scenario (create new or update existing)
   * @param {object} scenario - Scenario object (should include name and other data)
   * @param {string} id - Optional ID for update. If not provided, generates new ID.
   * @returns {string} Scenario ID (new or existing)
   */
  save(scenario, id, timestamp) {
    const all = this._readAll();

    // Generate new ID if not provided
    if (!id) {
      id = this._generateId();
    }

    // Set/update lastModified timestamp
    scenario.lastModified = timestamp || Date.now();

    // Save or update
    all[id] = scenario;
    this._writeAll(all);
    return id;
  }

  /**
   * Remove a scenario by id
   * @param {string} id - Scenario ID
   */
  remove(id) {
    const all = this._readAll();
    delete all[id];
    this._writeAll(all);
  }

  /**
   * Remove all scenarios that have a specific flag set to true
   * @param {string} flagName - Name of the flag property to check
   */
  removeByFlag(flagName) {
    const all = this._readAll();
    const filtered = {};

    for (const id in all) {
      if (!all[id][flagName]) {
        // Keep scenarios that don't have the flag or have it set to false
        filtered[id] = all[id];
      }
    }

    this._writeAll(filtered);
  }
}

/**
 * Settings persistence (localStorage)
 */
export class SettingsStore {
  constructor() {
    this.storageKey = 'fair-calc-settings';
  }

  /**
   * Load settings from localStorage
   * @returns {Object} Settings object with defaults
   */
  load() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        return this._getDefaults();
      }
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure all keys exist
      return { ...this._getDefaults(), ...parsed };
    } catch (e) {
      console.warn('Failed to load settings:', e);
      return this._getDefaults();
    }
  }

  /**
   * Save settings to localStorage
   * @param {Object} settings - Settings object
   */
  save(settings) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  }

  /**
   * Get default settings
   * @returns {Object} Default settings
   */
  _getDefaults() {
    return {
      pertLambda: 4
    };
  }
}
