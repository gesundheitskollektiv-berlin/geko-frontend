// Supported locales
export const SUPPORTED_LOCALES = ['de', 'en', 'ar', 'fr', 'ro', 'tr'];

// Default locale
export const DEFAULT_LOCALE = 'de';

/**
 * Validate if a locale is supported
 * @param {string} locale - The locale to validate
 * @returns {boolean} - Whether the locale is supported
 */
export function isValidLocale(locale) {
  return SUPPORTED_LOCALES.includes(locale);
}

/**
 * Get a valid locale or return the default
 * @param {string} locale - The locale to check
 * @returns {string} - The valid locale or default
 */
export function getValidLocale(locale) {
  return isValidLocale(locale) ? locale : DEFAULT_LOCALE;
}

/**
 * Get locale name in native language
 * @param {string} locale - The locale code
 * @returns {string} - The locale name
 */
export function getLocaleName(locale) {
  const localeNames = {
    de: 'Deutsch',
    en: 'English',
    ar: 'العربية',
    fr: 'Français',
    ro: 'Română',
    tr: 'Türkçe'
  };
  return localeNames[locale] || locale;
}

