import { createStrapiClient } from './lib/strapi-client.js';

const ENDPOINT = '/api/geko-ctas';
const LOCALES = ['de', 'en', 'fr', 'ro', 'tr', 'ar'];
const BASE_LOCALE = 'de';

const CTAS = [
  {
    cta_name: 'Fördermitgliedschaft',
    background_color: 'blue',
    link: '/unterstuetzen',
    call_text: {
      de: 'Bewege etwas - mit einer Fördermitgliedschaft!',
      en: 'Make a difference with a supporting membership!',
      fr: 'Changez les choses avec une adhésion de soutien !',
      ro: 'Fă o diferență cu o calitate de membru susținător!',
      tr: 'Destekçi üyelikle bir fark yarat!',
      ar: 'أحدث فرقاً من خلال عضوية داعمة!',
    },
    link_text: {
      de: 'Werde Fördermitglied',
      en: 'Become a supporter',
      fr: 'Devenir membre de soutien',
      ro: 'Devino susținător',
      tr: 'Destekçi üye ol',
      ar: 'كن عضواً داعماً',
    },
  },
  {
    cta_name: 'Anderer CTA',
    background_color: 'purple',
    link: 'https://heise.de',
    call_text: {
      de: 'Mache etwas anderes hier!',
      en: 'Do something else here!',
      fr: 'Faites autre chose ici !',
      ro: 'Fă altceva aici!',
      tr: 'Burada başka bir şey yap!',
      ar: 'افعل شيئاً آخر هنا!',
    },
    link_text: {
      de: 'Jetzt machen',
      en: 'Do it now',
      fr: 'Faites-le maintenant',
      ro: 'Fă acum',
      tr: 'Şimdi yap',
      ar: 'افعلها الآن',
    },
  },
];

const api = createStrapiClient();

// ── delete-all ──────────────────────────────────────────────────────────────

async function deleteAllCtas() {
  console.log('\n=== Cleaning up existing CTAs ===');

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

        (data.data || []).forEach((c) => {
          if (c.documentId) documentIds.add(c.documentId);
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
  console.log(`  Found ${ids.length} unique CTAs to delete`);

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

  console.log(`  ✓ Deleted ${deleted} CTAs`);
  return deleted;
}

// ── create ──────────────────────────────────────────────────────────────────

async function createCta(cta) {
  const basePayload = {
    cta_name: cta.cta_name,
    background_color: cta.background_color,
    link: cta.link,
    call_text: cta.call_text[BASE_LOCALE],
    link_text: cta.link_text[BASE_LOCALE],
  };

  let documentId;
  try {
    const response = await api.post(
      ENDPOINT,
      { data: basePayload },
      { params: { locale: BASE_LOCALE } },
    );
    documentId = response.data.data.documentId;
    console.log(`  ✓ ${cta.cta_name} (${BASE_LOCALE}) → ${documentId}`);
  } catch (err) {
    console.error(`  ✗ Failed ${cta.cta_name} (${BASE_LOCALE}):`, err.response?.data?.error || err.message);
    return { created: false, localized: {} };
  }

  const localized = { [BASE_LOCALE]: true };

  for (const locale of LOCALES) {
    if (locale === BASE_LOCALE) continue;

    const localizedPayload = {
      call_text: cta.call_text[locale],
      link_text: cta.link_text[locale],
    };

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
  console.log('=== Seeding CTAs ===');

  const deletedCount = await deleteAllCtas();

  console.log('\n=== Creating CTAs ===');
  let created = 0;
  let failed = 0;
  const localeStats = Object.fromEntries(LOCALES.map((l) => [l, { ok: 0, fail: 0 }]));

  for (const cta of CTAS) {
    console.log(`\nProcessing ${cta.cta_name}`);
    const result = await createCta(cta);
    if (result.created) created++;
    else failed++;

    for (const locale of LOCALES) {
      if (result.localized[locale] === true) localeStats[locale].ok++;
      else if (result.localized[locale] === false) localeStats[locale].fail++;
    }
  }

  console.log('\n=== Seed Complete ===');
  console.log(`  Deleted: ${deletedCount}`);
  console.log(`  Created: ${created} / ${CTAS.length}`);
  console.log(`  Failed:  ${failed}`);
  console.log('  Localized entries:');
  for (const locale of LOCALES) {
    const { ok, fail } = localeStats[locale];
    console.log(`    ${locale}: ${ok} ok${fail ? `, ${fail} failed` : ''}`);
  }
  console.log('');
}

migrate();
