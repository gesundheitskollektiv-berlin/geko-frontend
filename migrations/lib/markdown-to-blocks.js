import { marked } from 'marked';

/**
 * Convert markdown text to Strapi's "blocks" JSON format.
 *
 * Strapi blocks schema reference (v4/v5 rich-text blocks):
 *   paragraph  → { type: 'paragraph', children: [inline…] }
 *   heading    → { type: 'heading', level: N, children: [inline…] }
 *   list       → { type: 'list', format: 'ordered'|'unordered', children: [list-item…] }
 *   list-item  → { type: 'list-item', children: [inline…] }
 *   inline     → { type: 'text', text, bold?, italic?, underline?, strikethrough?, code? }
 *                 or { type: 'link', url, children: [inline…] }
 */

export function markdownToBlocks(markdown) {
  const cleaned = sanitize(markdown);
  if (!cleaned) return null;

  const tokens = marked.lexer(cleaned);
  return tokens.flatMap(tokenToBlocks).filter(Boolean);
}

function sanitize(text) {
  if (!text) return '';
  return text
    .replace(/\{%.*?%\}/gs, '') // strip Jekyll/Liquid tags
    .replace(/\r\n/g, '\n')
    .trim();
}

// ── Top-level token → block(s) ───────────────────────────────────────────────

function tokenToBlocks(token) {
  switch (token.type) {
    case 'heading':
      return [
        {
          type: 'heading',
          level: token.depth,
          children: inlineTokensToChildren(token.tokens),
        },
      ];

    case 'paragraph':
      return [
        {
          type: 'paragraph',
          children: inlineTokensToChildren(token.tokens),
        },
      ];

    case 'list':
      return [
        {
          type: 'list',
          format: token.ordered ? 'ordered' : 'unordered',
          children: token.items.map((item) => ({
            type: 'list-item',
            children: listItemChildren(item),
          })),
        },
      ];

    case 'blockquote':
      return (token.tokens || []).flatMap(tokenToBlocks);

    case 'space':
      return [];

    case 'hr':
      return [];

    default:
      if (token.text || token.raw) {
        return [
          {
            type: 'paragraph',
            children: [{ type: 'text', text: (token.text || token.raw).trim() }],
          },
        ];
      }
      return [];
  }
}

// ── List item handling ───────────────────────────────────────────────────────

function listItemChildren(item) {
  if (item.tokens) {
    const inlines = [];
    for (const t of item.tokens) {
      if (t.type === 'text' && t.tokens) {
        inlines.push(...inlineTokensToChildren(t.tokens));
      } else if (t.type === 'paragraph' && t.tokens) {
        inlines.push(...inlineTokensToChildren(t.tokens));
      } else if (t.type === 'text') {
        inlines.push({ type: 'text', text: t.text });
      }
    }
    return inlines.length ? inlines : [{ type: 'text', text: item.text || '' }];
  }
  return [{ type: 'text', text: item.text || '' }];
}

// ── Inline tokens → children array ──────────────────────────────────────────

function inlineTokensToChildren(tokens) {
  if (!tokens || !tokens.length) return [{ type: 'text', text: '' }];

  const children = tokens.flatMap((t) => inlineTokenToNodes(t)).filter(Boolean);
  return children.length ? children : [{ type: 'text', text: '' }];
}

function inlineTokenToNodes(token) {
  switch (token.type) {
    case 'text':
      return [{ type: 'text', text: token.text }];

    case 'strong':
      return applyMark(token.tokens, 'bold');

    case 'em':
      return applyMark(token.tokens, 'italic');

    case 'del':
      return applyMark(token.tokens, 'strikethrough');

    case 'codespan':
      return [{ type: 'text', text: token.text, code: true }];

    case 'link':
      return [
        {
          type: 'link',
          url: token.href,
          children: inlineTokensToChildren(token.tokens),
        },
      ];

    case 'br':
      return [{ type: 'text', text: '\n' }];

    case 'escape':
      return [{ type: 'text', text: token.text }];

    case 'image':
      return [{ type: 'text', text: token.text || token.href }];

    default:
      if (token.text) return [{ type: 'text', text: token.text }];
      if (token.raw) return [{ type: 'text', text: token.raw.trim() }];
      return [];
  }
}

// ── Formatting helpers ───────────────────────────────────────────────────────

function applyMark(tokens, mark) {
  if (!tokens?.length) return [];

  return tokens.flatMap((t) => {
    const nodes = inlineTokenToNodes(t);
    return nodes.map((node) => {
      if (node.type === 'text') return { ...node, [mark]: true };
      if (node.type === 'link') {
        return {
          ...node,
          children: node.children.map((c) => (c.type === 'text' ? { ...c, [mark]: true } : c)),
        };
      }
      return node;
    });
  });
}
