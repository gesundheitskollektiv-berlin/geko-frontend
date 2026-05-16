/**
 * Idempotent migration: seed localized `title` for `geko-page-datenschutzerklaerung` (en, fr, ro, tr, ar).
 * `content` blocks are non-localized — shared from DE; not sent here.
 *
 * Run: node migrate-page-datenschutz.js
 */
import { createStrapiClient } from './lib/strapi-client.js';

const ENDPOINT = '/api/geko-page-datenschutzerklaerung';
const LOCALES = ['en', 'fr', 'ro', 'tr', 'ar'];

const TITLES = {
  en: 'Privacy Policy',
  fr: 'Politique de confidentialité',
  ro: 'Politica de confidențialitate',
  tr: 'Gizlilik Politikası',
  ar: 'سياسة الخصوصية',
};

const api = createStrapiClient();

function localeIsComplete(row) {
  return typeof row?.title === 'string' && row.title.trim().length > 0;
}

async function fetchRow(locale) {
  try {
    const { data } = await api.get(ENDPOINT, { params: { locale } });
    return data?.data ?? null;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw err;
  }
}

async function migrate() {
  console.log('=== Migrate geko-page-datenschutzerklaerung ===\n');

  const stats = Object.fromEntries(
    LOCALES.map((l) => [l, { status: 'pending', documentId: null }]),
  );

  let primaryDocumentId = null;

  for (const locale of LOCALES) {
    try {
      const row = await fetchRow(locale);
      if (localeIsComplete(row)) {
        console.log(`⏭ Skip (${locale}): title already present`);
        stats[locale].status = 'skipped';
        stats[locale].documentId = row?.documentId ?? null;
        if (!primaryDocumentId && row?.documentId) primaryDocumentId = row.documentId;
        continue;
      }

      const payload = { title: TITLES[locale] };

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
