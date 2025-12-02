/**
 * Format a date string for display
 * @param {string} dateString - The ISO date string from Strapi
 * @param {string} locale - The locale for formatting (e.g., 'de', 'en')
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} - The formatted date string
 */
export function formatDate(dateString, locale = 'de', options = {}) {
  if (!dateString) return '';

  const date = new Date(dateString);

  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  const formatOptions = { ...defaultOptions, ...options };

  return new Intl.DateTimeFormat(locale, formatOptions).format(date);
}

/**
 * Format a date and time string for display
 * @param {string} dateString - The ISO date string from Strapi
 * @param {string} locale - The locale for formatting
 * @returns {string} - The formatted date and time string
 */
export function formatDateTime(dateString, locale = 'de') {
  if (!dateString) return '';

  const date = new Date(dateString);

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Format a date string in short format
 * @param {string} dateString - The ISO date string from Strapi
 * @param {string} locale - The locale for formatting
 * @returns {string} - The formatted date string (e.g., "12.03.2024")
 */
export function formatDateShort(dateString, locale = 'de') {
  if (!dateString) return '';

  const date = new Date(dateString);

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };

  return new Intl.DateTimeFormat(locale, options).format(date);
}
