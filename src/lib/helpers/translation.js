import translation_de from '$lib/i18n/de.json';
import translation_en from '$lib/i18n/en.json';
import translation_ar from '$lib/i18n/ar.json';
import translation_fr from '$lib/i18n/fr.json';
import translation_ro from '$lib/i18n/ro.json';
import translation_tr from '$lib/i18n/tr.json';

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

/**
 * Get translations for a specific locale
 * @param {string} locale - The locale code
 * @returns {object} - The translation object
 */
export const t = (locale) => {
  if (locale === 'de') return translation_de;
  if (locale === 'en') return translation_en;
  if (locale === 'ar') return translation_ar;
  if (locale === 'fr') return translation_fr;
  if (locale === 'ro') return translation_ro;
  if (locale === 'tr') return translation_tr;
  return translation_de; // fallback to default
};
