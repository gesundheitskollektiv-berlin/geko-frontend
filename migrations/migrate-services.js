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

function buildBasePayload(slug, data) {
  const isExternal = bool(data.external_service || data.external_link_only, false);

  return {
    slug,
    icon_name: pickIconName(slug, data),
    inhouse: bool(data.inhouse, true),
    external_link_only: isExternal,
    project_url: data.external_service_url || data.project_url || null,
    ...buildLocalizedPayload(data),
  };
}

// ── delete-all ──────────────────────────────────────────────────────────────

async function deleteAllServices() {
  console.log('\n=== Cleaning up existing services ===');

  const documentIds = new Set();

  for (const locale of LOCALES) {
    let page = 1;
    let pageCount = 1;
    process.stdout.write(`  Scanning locale ${locale}...`);

    try {
      do {
        const { data } = await api.get(ENDPOINT, {
          params: {
            locale,
            'pagination[page]': page,
            'pagination[pageSize]': 100,
          },
        });

        (data.data || []).forEach((s) => {
          if (s.documentId) documentIds.add(s.documentId);
        });

        pageCount = data.meta?.pagination?.pageCount || 1;
        page++;
      } while (page <= pageCount);
      process.stdout.write(' done\n');
    } catch (err) {
      console.warn(` failed (${err.response?.status || err.message})`);
    }
  }

  const ids = Array.from(documentIds);
  console.log(`  Found ${ids.length} unique services to delete`);

  let deleted = 0;
  for (const id of ids) {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
      deleted++;
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error(`  ✗ Delete failed ${id}:`, err.response?.data?.error?.message || err.message);
      }
    }
  }

  console.log(`  ✓ Deleted ${deleted} services`);

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
  const payload = buildBasePayload(slug, baseEntry.data);

  let imageId = null;
  if (!payload.external_link_only && baseEntry.data.featured_image) {
    imageId = await uploadImage({
      api,
      rootDir: GEKO_VEREIN_PATH,
      relativePath: baseEntry.data.featured_image,
      folderName: 'Services',
      altText: baseEntry.data.featured_image_alt || '',
    });
    if (imageId) payload.image = imageId;
  }

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

  if (imageId) {
    try {
      await api.put(`${ENDPOINT}/${documentId}`, { data: { image: imageId } });
    } catch (err) {
      console.warn(`    ⚠ Image attach failed:`, err.response?.data?.error?.message || err.message);
    }
  }

  const localized = { [baseLocale]: true };

  for (const locale of LOCALES) {
    if (locale === baseLocale) continue;
    if (!localesData[locale]) continue;

    const localizedPayload = buildLocalizedPayload(localesData[locale].data);

    try {
      await api.put(
        `${ENDPOINT}/${documentId}`,
        { data: localizedPayload },
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
