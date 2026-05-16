/**
 * Idempotent migration: seed `geko-page-angebote` locales en, fr, ro, tr, ar.
 * Same intro_text (lorem) as DE; translated titles; header_image reuses DE geko_eingang (no upload).
 * body is omitted (optional field).
 *
 * Run: node migrate-page-angebote.js
 */
import { createStrapiClient } from './lib/strapi-client.js';
import { markdownToBlocks } from './lib/markdown-to-blocks.js';

const ENDPOINT = '/api/geko-page-angebote';
const LOCALES = ['en', 'fr', 'ro', 'tr', 'ar'];
const HEADER_IMAGE_DOCUMENT_ID = 'lktxzcdypq0lwwa99i0uitus';

const LOREM_INTRO = `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`;

const TITLES = {
  en: 'At the community center',
  fr: 'Au centre de quartier',
  ro: 'În centrul de cartier',
  tr: 'Mahalle merkezinde',
  ar: 'في مركز الحي',
};

const api = createStrapiClient();

function blocksFromMarkdown(markdown, fallback = '') {
  const cleaned = String(markdown ?? '').trim();
  const blocks = markdownToBlocks(cleaned);
  if (blocks && blocks.length > 0) return blocks;
  const text = fallback || cleaned || ' ';
  return [{ type: 'paragraph', children: [{ type: 'text', text }] }];
}

function localeIsComplete(row) {
  return Array.isArray(row?.intro_text) && row.intro_text.length > 0;
}

async function fetchRow(locale, params = {}) {
  try {
    const { data } = await api.get(ENDPOINT, { params: { locale, ...params } });
    return data?.data ?? null;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw err;
  }
}

/**
 * Strapi expects a numeric file `id` (or `{ connect: [...] }`) on
 * plugin::upload.file relations — `documentId` strings cause a
 * 400 ValidationError. Resolve the numeric id from the populated DE row
 * (already known-good) and reuse for every locale.
 */
async function resolveHeaderImageId() {
  const row = await fetchRow('de', { populate: 'header_image' });
  const numericId = row?.header_image?.id;
  if (!numericId) {
    throw new Error(
      `Could not resolve numeric id for header_image (expected documentId ${HEADER_IMAGE_DOCUMENT_ID}). ` +
        'Make sure the DE row exists and has its header_image set.',
    );
  }
  return numericId;
}

async function migrate() {
  console.log('=== Migrate geko-page-angebote ===\n');

  const stats = Object.fromEntries(
    LOCALES.map((l) => [l, { status: 'pending', documentId: null }]),
  );

  const headerImageId = await resolveHeaderImageId();
  console.log(`  → header_image numeric id: ${headerImageId}`);

  let primaryDocumentId = null;
  const introBlocks = blocksFromMarkdown(LOREM_INTRO);

  for (const locale of LOCALES) {
    try {
      const row = await fetchRow(locale);
      if (localeIsComplete(row)) {
        console.log(`⏭ Skip (${locale}): intro_text already present`);
        stats[locale].status = 'skipped';
        stats[locale].documentId = row?.documentId ?? null;
        if (!primaryDocumentId && row?.documentId) primaryDocumentId = row.documentId;
        continue;
      }

      const payload = {
        title: TITLES[locale],
        intro_text: introBlocks,
        header_image: headerImageId,
      };

      const { data } = await api.put(ENDPOINT, { data: payload }, { params: { locale } });
      const docId = data?.data?.documentId ?? primaryDocumentId;
      console.log(`  ✓ ${locale} → documentId ${docId}`);
      stats[locale].status = 'created';
      stats[locale].documentId = docId;
      if (!primaryDocumentId && docId) primaryDocumentId = docId;
    } catch (err) {
      stats[locale].status = 'failed';
      console.error(`  ✗ ${locale}:`, err.response?.data?.error || err.message);
    }
  }

  console.log('\n=== Summary ===');
  let created = 0;
  let skipped = 0;
  let failed = 0;
  for (const locale of LOCALES) {
    const s = stats[locale];
    if (s.status === 'created') created++;
    else if (s.status === 'skipped') skipped++;
    else if (s.status === 'failed') failed++;
    console.log(`  ${locale}: ${s.status}${s.documentId ? ` (${s.documentId})` : ''}`);
  }
  console.log(`\n  Created: ${created}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Failed:  ${failed}\n`);

  if (failed > 0) process.exit(1);
}

migrate();
