const STYLE_MAP = { solid: 'fa-solid', brands: 'fa-brands', regular: 'fa-regular' };

// Matches: <#fa-<style>-<name>>
//   style: solid | brands | regular
//   name : letters, digits, hyphens (e.g. arrow-up-right-from-square)
const FA_TOKEN = /<#fa-(solid|brands|regular)-([a-z0-9-]+)>/g;

/** @param {string} s */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Replace <#fa-style-name> tokens in a plain-text string with FA <i> markup.
 * Non-token segments are HTML-escaped for safe {@html} use.
 *
 * @param {string} text
 */
export function renderFaTokens(text) {
  if (typeof text !== 'string' || text.length === 0) return '';
  let out = '';
  let lastIndex = 0;
  FA_TOKEN.lastIndex = 0;
  let m = FA_TOKEN.exec(text);
  while (m !== null) {
    const match = m[0];
    const style = m[1];
    const name = m[2];
    const start = m.index;
    out += escapeHtml(text.slice(lastIndex, start));
    const prefix = STYLE_MAP[/** @type {keyof typeof STYLE_MAP} */ (style)];
    out += `<i class="${prefix} fa-${name} me-2" aria-hidden="true"></i>`;
    lastIndex = start + match.length;
    m = FA_TOKEN.exec(text);
  }
  out += escapeHtml(text.slice(lastIndex));
  return out;
}
