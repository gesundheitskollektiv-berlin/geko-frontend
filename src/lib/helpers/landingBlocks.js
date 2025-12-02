/**
 * Convert text to URL-safe slug
 * @param {string} value - Text to slugify
 * @returns {string} - URL-safe slug
 */
export function slugify(value = '') {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9äöüß\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

