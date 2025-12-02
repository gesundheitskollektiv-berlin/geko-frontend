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

/**
 * Turn Strapi landing content (dynamic zone) into something easier to iterate over.
 * @param {Array} content
 * @returns {Array<{ key: string, type: string, data: object }>}
 */
export function mapLandingBlocks(content = []) {
  if (!Array.isArray(content)) return [];

  return content.map((block, idx) => {
    const type = block?.__component ?? 'unknown';
    return {
      key: block?.id ? `${type}-${block.id}` : `${type}-${idx}`,
      type,
      data: block
    };
  });
}
