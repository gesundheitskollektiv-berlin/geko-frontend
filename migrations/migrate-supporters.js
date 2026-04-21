import path from 'path';
import { fileURLToPath } from 'url';
import { createStrapiClient } from './lib/strapi-client.js';
import { uploadImage } from './lib/image-upload.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GEKO_VEREIN_PATH =
  process.env.GEKO_VEREIN_PATH || path.resolve(__dirname, '../../../geko-verein');
const ENDPOINT = '/api/geko-supporters';

const SUPPORTERS = [
  {
    title: 'Robert Bosch Stiftung',
    project_url: 'https://www.bosch-stiftung.de/de',
    image: '/assets/img/supporters/BHC_Logo_mit_Schutzzone_RGB.png',
    width: 'half',
  },
  {
    title: 'Robert Bosch Allzeitorte',
    project_url: 'https://www.bosch-stiftung.de/de/projekt/allzeitorte',
    image: '/assets/img/supporters/Allzeitorte_nurLogos_nebeneinander_Web.png',
    width: 'half',
  },
  {
    title: 'Rollberg Quartier',
    project_url: 'http://www.rollberg-quartier.de/',
    image: '/assets/img/supporters/Logoleiste_A4_quer.jpg',
    width: 'full',
  },
  {
    title: 'Quartiersmanagement Flughafenstraße',
    project_url: 'https://www.qm-flughafenstrasse.de/',
    image: '/assets/img/supporters/QM_Flughafen_neu.jpeg',
    width: 'full',
  },
  {
    title: 'Berliner Senat für Integration und Migration',
    project_url:
      'https://www.berlin.de/ba-neukoelln/politik-und-verwaltung/beauftragte/neukoellner-koordination-fuer-fluechtlingsfragen/artikel.1288259.php',
    image: '/assets/img/supporters/B_SEN_ASGIVA_PartIntMig_Integrationsfonds_3erlogo_DE_H_PW_4C.png',
    width: 'full',
  },
  {
    title: 'Gemeinsam Gesundes Berlin',
    project_url:
      'https://www.berlin.de/sen/gesundheit/themen/gesundheitsfoerderung-und-praevention/aktionsprogramm-gesundheit/',
    image: '/assets/img/supporters/gemeinsam_gesundes_berlin.png',
    width: 'half',
  },
  {
    title: 'Bundesstiftung Frühe Hilfen',
    project_url:
      'https://www.fruehehilfen.de/grundlagen-und-fachthemen/grundlagen-der-fruehen-hilfen/bundesstiftung-fruehe-hilfen/',
    image: '/assets/img/supporters/logo_bundesstiftung_fh_und_bmfsfj.jpg',
    width: 'half',
  },
];

const api = createStrapiClient();

// ── delete-all ──────────────────────────────────────────────────────────────

async function deleteAllSupporters() {
  console.log('\n=== Cleaning up existing supporters ===');

  const documentIds = new Set();
  let page = 1;
  let pageCount = 1;

  try {
    do {
      const { data } = await api.get(ENDPOINT, {
        params: {
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
  } catch (err) {
    console.warn(`  Scan failed (${err.response?.status || err.message})`);
  }

  const ids = Array.from(documentIds);
  console.log(`  Found ${ids.length} supporters to delete`);

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

  console.log(`  ✓ Deleted ${deleted} supporters`);

  try {
    const { data } = await api.get(ENDPOINT, { params: { 'pagination[pageSize]': 1 } });
    const total = data.meta?.pagination?.total ?? 0;
    console.log(`  Verified: ${total} remaining`);
  } catch {
    /* ignore */
  }

  return deleted;
}

// ── create ──────────────────────────────────────────────────────────────────

async function createSupporter(supporter) {
  const imageId = await uploadImage({
    api,
    rootDir: GEKO_VEREIN_PATH,
    relativePath: supporter.image,
    folderName: 'Supporters',
    altText: supporter.title,
  });

  if (!imageId) {
    console.error(`  ✗ Skipping ${supporter.title}: image upload failed`);
    return false;
  }

  const payload = {
    title: supporter.title,
    project_url: supporter.project_url,
    width: supporter.width,
    image: imageId,
  };

  let documentId;
  try {
    const response = await api.post(ENDPOINT, { data: payload });
    documentId = response.data.data.documentId;
    console.log(`  ✓ ${supporter.title} → ${documentId}`);
  } catch (err) {
    console.error(`  ✗ Failed ${supporter.title}:`, err.response?.data?.error || err.message);
    return false;
  }

  try {
    await api.put(`${ENDPOINT}/${documentId}`, { data: { image: imageId } });
  } catch (err) {
    console.warn(`    ⚠ Image attach failed:`, err.response?.data?.error?.message || err.message);
  }

  return true;
}

// ── main ────────────────────────────────────────────────────────────────────

async function migrate() {
  console.log('=== Migrating Supporters ===');

  const deletedCount = await deleteAllSupporters();

  console.log('\n=== Creating supporters ===');
  let created = 0;
  let failed = 0;

  for (const supporter of SUPPORTERS) {
    const ok = await createSupporter(supporter);
    if (ok) created++;
    else failed++;
  }

  console.log('\n=== Migration Complete ===');
  console.log(`  Deleted: ${deletedCount}`);
  console.log(`  Created: ${created} / ${SUPPORTERS.length}`);
  console.log(`  Failed:  ${failed}\n`);
}

migrate();
