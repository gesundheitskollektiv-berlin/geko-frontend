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
