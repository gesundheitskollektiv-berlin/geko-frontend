import { env } from '$env/dynamic/public';
import { getStrapiPublicUrl } from '$lib/helpers/strapiPublicUrl';

export const DEFAULT_OG_IMAGE_PATH = '/assets/img/favicon.png';
const SITE_NAME = 'Geko';

/**
 * @param {URL | { origin?: string } | null | undefined} url
 */
export function getSiteOrigin(url) {
  const fromEnv = env.PUBLIC_SITE_URL;
  if (fromEnv != null && String(fromEnv).trim() !== '') {
    return String(fromEnv).replace(/\/$/, '');
  }
  if (url?.origin) {
    return url.origin;
  }
  return '';
}

/**
 * @param {string | null | undefined} pathOrUrl
 * @param {string} origin
 */
export function toAbsoluteUrl(pathOrUrl, origin) {
  if (!pathOrUrl) return '';
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  if (!origin) return pathOrUrl;
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${origin}${path}`;
}

/**
 * @param {string | null | undefined} rawUrl
 */
export function resolveMediaPath(rawUrl) {
  if (!rawUrl) return '';
  const base = getStrapiPublicUrl();
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    return rawUrl;
  }
  return `${base}${rawUrl}`;
}

/**
 * @param {{ url?: string } | null | undefined} asset
 */
export function resolveStrapiAssetUrl(asset) {
  return resolveMediaPath(asset?.url);
}

/**
 * Prefer large format for OG previews, then original asset URL.
 * @param {{ url?: string, formats?: { large?: { url?: string } } } | null | undefined} asset
 */
export function resolveStrapiMediaUrl(asset) {
  if (!asset) return '';
  const preferred = asset.formats?.large?.url || asset.url;
  return resolveMediaPath(preferred);
}

/**
 * @param {unknown} nodes
 */
export function plainTextFromRichText(nodes) {
  if (!nodes) return '';
  if (typeof nodes === 'string') return nodes.trim();
  if (!Array.isArray(nodes)) return '';

  for (const node of nodes) {
    const text = extractPlainText(node);
    if (text) return text;
  }

  return '';
}

/**
 * @param {unknown} node
 */
function extractPlainText(node) {
  if (!node || typeof node !== 'object') return '';

  if (node.type === 'text' && typeof node.text === 'string') {
    return node.text.trim();
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      const text = extractPlainText(child);
      if (text) return text;
    }
  }

  return '';
}

/**
 * @param {{
 *   title?: string,
 *   description?: string,
 *   imageAsset?: { url?: string, formats?: { large?: { url?: string } } } | null,
 *   pageUrl?: URL | { href?: string, origin?: string } | null,
 *   locale?: string,
 *   type?: string
 * }} options
 */
export function buildPageMeta({
  title = SITE_NAME,
  description = '',
  imageAsset = null,
  pageUrl = null,
  locale = 'de',
  type = 'website'
}) {
  const origin = getSiteOrigin(pageUrl);
  const strapiImage = resolveStrapiMediaUrl(imageAsset);
  const image = strapiImage || toAbsoluteUrl(DEFAULT_OG_IMAGE_PATH, origin);
  const url = pageUrl?.href ? String(pageUrl.href) : '';

  return {
    title: title.trim() || SITE_NAME,
    description: description.trim(),
    image,
    url,
    locale,
    type,
    siteName: SITE_NAME
  };
}
