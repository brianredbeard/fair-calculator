/**
 * Internationalization (i18n) module
 * Provides translation, number formatting, currency formatting, and currency shorthand parsing
 */

const CURRENCY = 'USD';

/**
 * I18n class for handling translations and locale-specific formatting
 */
export class I18n {
  /**
   * @param {Object} strings - Key-value pairs of translation strings
   * @param {string} locale - BCP 47 locale (default: 'en-US')
   * @param {string} currency - ISO 4217 currency code (default: 'USD')
   */
  constructor(strings, locale = 'en-US', currency = CURRENCY) {
    this._strings = strings || {};
    this._locale = locale;
    this._currency = currency;

    // Create number and currency formatters
    this._numberFmt = new Intl.NumberFormat(locale);
    this._currencyFmt = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  /**
   * Translate a key with optional parameter interpolation
   * @param {string} key - Translation key
   * @param {Object} params - Optional parameters for placeholder replacement
   * @returns {string} Translated string with interpolated parameters
   */
  t(key, params) {
    const parts = key.split('.');
    let str = this._strings;
    
    for (const part of parts) {
      if (str && str[part] !== undefined) {
        str = str[part];
      } else {
        return `[missing_${key}]`;
      }
    }
    
    if (typeof str !== 'string' && str.label) {
      str = str.label;
    }

    if (typeof str !== 'string') {
      return `[missing_${key}]`;
    }

    // Replace {placeholder} with parameter values
    if (params) {
      str = str.replace(/{(\w+)}/g, (match, param) => {
        return params[param] !== undefined ? params[param] : match;
      });
    }

    return str;
  }

  /**
   * Format a number with locale-specific separators
   * @param {number} value - Number to format
   * @returns {string} Formatted number string
   */
  formatNumber(value) {
    return this._numberFmt.format(value);
  }

  /**
   * Format a number as currency with currency symbol
   * @param {number} value - Amount to format
   * @returns {string} Formatted currency string (e.g., "$1,234.56")
   */
  formatCurrency(value) {
    return this._currencyFmt.format(value);
  }

  /**
   * Format currency in compact notation (K for thousands, M for millions, B for billions)
   * @param {number} value - Amount to format
   * @returns {string} Compact currency string (e.g., "$1.5M", "$50K", "$999")
   */
  formatCompactCurrency(value) {
    const absValue = Math.abs(value);

    if (absValue >= 1e9) {
      return '$' + (value / 1e9).toFixed(0) + 'B';
    } else if (absValue >= 1e6) {
      // For millions, show one decimal place if needed
      const millions = value / 1e6;
      const formatted = millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1);
      return '$' + formatted + 'M';
    } else if (absValue >= 1e3) {
      // For thousands, show one decimal place if needed
      const thousands = value / 1e3;
      const formatted = thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1);
      return '$' + formatted + 'K';
    }

    // For values less than 1000, return as-is with dollar sign
    return '$' + this.formatNumber(value);
  }

  /**
   * Parse dollar shorthand notation back to number
   * Handles: K (thousands), M (millions), B (billions), plain numbers, $, and commas
   * @param {string} input - String like "50K", "$1.5M", "$2,500", "1000"
   * @returns {number} Parsed number, or NaN if unparseable
   */
  parseDollarShorthand(input) {
    if (typeof input !== 'string') {
      return NaN;
    }

    // Strip $ and commas
    let cleaned = input.replace(/[$,]/g, '').trim();

    // Check for K, M, B suffix
    const kMatch = cleaned.match(/^([-\d.]+)K$/i);
    const mMatch = cleaned.match(/^([-\d.]+)M$/i);
    const bMatch = cleaned.match(/^([-\d.]+)B$/i);

    if (kMatch) {
      return parseFloat(kMatch[1]) * 1e3;
    } else if (mMatch) {
      return parseFloat(mMatch[1]) * 1e6;
    } else if (bMatch) {
      return parseFloat(bMatch[1]) * 1e9;
    }

    // Try to parse as plain number
    return parseFloat(cleaned);
  }
}

/**
 * Load i18n configuration from locale JSON file
 * @param {string} locale - Locale code (e.g., 'en', 'fr')
 * @returns {Promise<I18n>} I18n instance with loaded strings
 */
export async function loadI18n(locale = 'en') {
  const resp = await fetch(`./locales/${locale}.json`);
  const strings = await resp.json();
  const displayLocale = locale === 'en' ? 'en-US' : locale;
  return new I18n(strings, displayLocale);
}
