import path from 'path';
import { fileURLToPath } from 'url';
import { createStrapiClient } from './lib/strapi-client.js';
import { loadAllMarkdown } from './lib/markdown-reader.js';
import { uploadImage } from './lib/image-upload.js';
import { markdownToBlocks } from './lib/markdown-to-blocks.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GEKO_VEREIN_PATH =
  process.env.GEKO_VEREIN_PATH || path.resolve(__dirname, '../../../geko-verein');
const SOURCE_DIR = path.join(GEKO_VEREIN_PATH, 'collections/_announcements');
const ENDPOINT = '/api/geko-announcements';

const api = createStrapiClient();

function buildPayload(entry) {
  const { data, content, slug } = entry;
  const isEvent = data.layout === 'event';

  return {
    title: data.title || '',
    slug,
    teaser_text: data.teaser_text || '',
    is_event: isEvent,
    event_date: isEvent && data.event_date ? data.event_date : null,
    when_text: isEvent && data.when_text ? data.when_text : '',
    where_address: isEvent && data.where_address ? data.where_address : '',
    event_host: isEvent && data.event_host ? data.event_host : '',
    content: markdownToBlocks(content),
    publish_date: data.publish_date || null,
    publishedAt: data.publish_date ? new Date(data.publish_date).toISOString() : new Date().toISOString(),
  };
}

async function existsBySlug(slug) {
  try {
    const { data } = await api.get(ENDPOINT, {
      params: {
        'filters[slug][$eq]': slug,
        'pagination[pageSize]': 1,
        status: 'draft',
      },
    });
    return data?.data?.length > 0;
  } catch {
    return false;
  }
}

async function migrate() {
  console.log('\n=== Migrating Announcements ===');
  console.log(`Source: ${SOURCE_DIR}\n`);

  const entries = loadAllMarkdown(SOURCE_DIR);
  console.log(`Found ${entries.length} announcement files\n`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const entry of entries) {
    try {
      const existed = await existsBySlug(entry.slug);
      if (existed) {
        console.log(`⏭ Skipped (exists): ${entry.slug}`);
        skipped++;
        continue;
      }

      const payload = buildPayload(entry);

      const imagePath = entry.data.featured_image || entry.data.kicker_image;
      const imageAlt = entry.data.featured_image_alt || entry.data.kicker_image_alt || '';
      if (imagePath) {
        const imageId = await uploadImage({
          api,
          rootDir: GEKO_VEREIN_PATH,
          relativePath: imagePath,
          folderName: 'Announcements',
          altText: typeof imageAlt === 'string' ? imageAlt : '',
        });
        if (imageId) {
          payload.image = imageId;
        }
      }

      await api.post(ENDPOINT, { data: { ...payload, locale: 'de' } });
      console.log(`✓ Created: ${entry.data.title}`);
      created++;
    } catch (error) {
      console.error(`✗ Failed "${entry.slug}":`, error.response?.data || error.message);
      failed++;
    }
  }

  console.log(`\n=== Migration Complete ===`);
  console.log(`  Created: ${created}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Failed:  ${failed}`);
  console.log(`  Total:   ${entries.length}\n`);
}

migrate();
