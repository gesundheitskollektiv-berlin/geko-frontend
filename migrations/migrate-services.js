import path from 'path';
import { fileURLToPath } from 'url';
import { createStrapiClient } from './lib/strapi-client.js';
import { loadLocalizedEntries } from './lib/localized-reader.js';
import { uploadImage } from './lib/image-upload.js';
import { markdownToBlocks } from './lib/markdown-to-blocks.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GEKO_VEREIN_PATH =
  process.env.GEKO_VEREIN_PATH || path.resolve(__dirname, '../../../geko-verein');
const SOURCE_DIR = path.join(GEKO_VEREIN_PATH, 'collections/_services');
const ENDPOINT = '/api/geko-services';

const LOCALES = ['de', 'en', 'fr', 'ro', 'tr', 'ar'];

const ICON_MAPPING = {
  'kindermedizinische-praxis': 'fa-hands-holding-child',
  stadtteilpraxis: 'fa-stethoscope',
  therapie: 'fa-comments',
  'sport-und-spiel-im-kiez': 'fa-heart-pulse',
  beratung: 'fa-people-arrows',
  nachbarschaftsprojekte: 'fa-people-group',
  cafe: 'fa-mug-saucer',
  'mobile-gesundheitsberatung': 'fa-circle-info',
  navigation: 'fa-satellite-dish',
};

const api = createStrapiClient();

const LOREM_TEASER =
  'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat. Sed diam voluptua — at vero eos et accusam et justo duo dolores et ea rebum.';

// ── helpers ─────────────────────────────────────────────────────────────────

function bool(value, fallback = false) {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const v = value.toLowerCase();
    if (['true', '1', 'yes'].includes(v)) return true;
    if (['false', '0', 'no'].includes(v)) return false;
  }
  return Boolean(value);
}

function sanitizeText(value) {
  if (!value) return '';
  return String(value).replace(/\{%.*?%\}/gs, '').trim();
}

function pickIconName(slug, data) {
  if (ICON_MAPPING[slug]) return ICON_MAPPING[slug];
  if (data.icon_name) return data.icon_name;
  if (data.icon) return path.basename(String(data.icon));
  return null;
}

// ── payload building ────────────────────────────────────────────────────────

function buildLocalizedPayload(data) {
  return {
    title: data.title || 'Ohne Titel',
    where_address: sanitizeText(data.where_address || ''),
    description: markdownToBlocks(data.blurb || data.description || ''),
    offer: markdownToBlocks(data.offer || ''),
    who: markdownToBlocks(data.who || ''),
    when: markdownToBlocks(data.when || ''),
    languages: markdownToBlocks(data.languages || ''),
    teaser_text: markdownToBlocks(LOREM_TEASER),
  };
}

/** Non-localized fields in Strapi v5 still need to be sent on every locale row. */
function buildNonLocalizedPayload(slug, data, imageId) {
  const isExternal = bool(data.external_service || data.external_link_only, false);
  const payload = {
    slug,
    icon_name: pickIconName(slug, data),
    inhouse: bool(data.inhouse, true),
    external_link_only: isExternal,
    project_url: data.external_service_url || data.project_url || null,
  };
  if (imageId) payload.image = imageId;
  return payload;
}

// ── delete-all ──────────────────────────────────────────────────────────────

async function deleteAllServices() {
  console.log('\n=== Cleaning up existing services ===');

  let deleted = 0;

  // Strapi 5: DELETE without `locale` may not remove all locale rows. Purge each
  // locale explicitly by re-fetching page 1 until empty (deleted rows shift pagination).
  for (const locale of LOCALES) {
    process.stdout.write(`  Purging locale ${locale}...`);
    try {
      for (;;) {
        const { data } = await api.get(ENDPOINT, {
          params: {
            locale,
            'pagination[page]': 1,
            'pagination[pageSize]': 100,
          },
        });

        const rows = data.data || [];
        if (rows.length === 0) break;

        for (const row of rows) {
          if (!row.documentId) continue;
          try {
            await api.delete(`${ENDPOINT}/${row.documentId}`, { params: { locale } });
            deleted++;
          } catch (err) {
            if (err.response?.status !== 404) {
              console.error(
                `  ✗ Delete failed ${row.documentId} (${locale}):`,
                err.response?.data?.error?.message || err.message
              );
            }
          }
        }
      }
      process.stdout.write(' done\n');
    } catch (err) {
      console.warn(` failed (${err.response?.status || err.message})`);
    }
  }

  console.log(`  ✓ Deleted locale rows: ${deleted}`);

  console.log('  Verifying...');
  for (const locale of LOCALES) {
    try {
      const { data } = await api.get(ENDPOINT, {
        params: { locale, 'pagination[pageSize]': 1 },
      });
      const total = data.meta?.pagination?.total ?? 0;
      console.log(`    ${locale}: ${total} remaining`);
    } catch {
      /* ignore */
    }
  }

  return deleted;
}

// ── create ──────────────────────────────────────────────────────────────────

async function createService(slug, localesData) {
  const baseLocale = localesData.de ? 'de' : Object.keys(localesData)[0];
  if (!baseLocale) {
    console.log(`  ⚠ No locales for ${slug}, skipping`);
    return { created: false, localized: {} };
  }

  const baseEntry = localesData[baseLocale];
  const baseData = baseEntry.data;

  let imageId = null;
  const nonLocalizedProbe = buildNonLocalizedPayload(slug, baseData, null);
  if (!nonLocalizedProbe.external_link_only && baseData.featured_image) {
    imageId = await uploadImage({
      api,
      rootDir: GEKO_VEREIN_PATH,
      relativePath: baseData.featured_image,
      folderName: 'Services',
      altText: baseData.featured_image_alt || '',
    });
  }

  const nonLocalized = buildNonLocalizedPayload(slug, baseData, imageId);
  const payload = { ...nonLocalized, ...buildLocalizedPayload(baseData) };

  let documentId;
  try {
    const response = await api.post(ENDPOINT, { data: payload }, { params: { locale: baseLocale } });
    const created = response.data.data;
    documentId = created.documentId;
    console.log(`  ✓ ${slug} (${baseLocale}) → ${documentId}`);
  } catch (err) {
    console.error(`  ✗ Failed ${slug} (${baseLocale}):`, err.response?.data?.error || err.message);
    return { created: false, localized: {} };
  }

  const localized = { [baseLocale]: true };

  for (const locale of LOCALES) {
    if (locale === baseLocale) continue;
    if (!localesData[locale]) continue;

    const localizedPayload = buildLocalizedPayload(localesData[locale].data);

    try {
      await api.put(
        `${ENDPOINT}/${documentId}`,
        { data: { ...nonLocalized, ...localizedPayload } },
        { params: { locale } },
      );
      console.log(`    ↳ ${locale}`);
      localized[locale] = true;
    } catch (err) {
      console.error(`    ✗ ${locale}:`, err.response?.data?.error || err.message);
      localized[locale] = false;
    }
  }

  return { created: true, localized };
}

// ── main ────────────────────────────────────────────────────────────────────

async function migrate() {
  console.log('=== Migrating Services ===');
  console.log(`Source: ${SOURCE_DIR}`);

  const deletedCount = await deleteAllServices();

  console.log('\n=== Loading markdown ===');
  const groups = loadLocalizedEntries(SOURCE_DIR, LOCALES);
  const slugs = Object.keys(groups);
  console.log(`Found ${slugs.length} service groups`);

  let created = 0;
  let failed = 0;
  const localeStats = Object.fromEntries(LOCALES.map((l) => [l, { ok: 0, fail: 0 }]));

  for (const slug of slugs) {
    console.log(`\nProcessing ${slug}`);
    const result = await createService(slug, groups[slug]);

    if (result.created) {
      created++;
    } else {
      failed++;
    }

    for (const locale of LOCALES) {
      if (result.localized[locale] === true) localeStats[locale].ok++;
      else if (result.localized[locale] === false) localeStats[locale].fail++;
    }
  }

  console.log('\n=== Migration Complete ===');
  console.log(`  Deleted:    ${deletedCount}`);
  console.log(`  Groups:     ${slugs.length}`);
  console.log(`  Created:    ${created}`);
  console.log(`  Failed:     ${failed}`);
  console.log('  Localized entries:');
  for (const locale of LOCALES) {
    const { ok, fail } = localeStats[locale];
    console.log(`    ${locale}: ${ok} ok${fail ? `, ${fail} failed` : ''}`);
  }
  console.log('');
}

migrate();
