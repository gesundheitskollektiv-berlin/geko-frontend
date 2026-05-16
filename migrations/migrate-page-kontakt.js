/**
 * Idempotent migration: seed `geko-page-kontakt` single-type locales from legacy
 * geko-verein/collections/_pages/kontakte.{locale}.md (embedded below).
 *
 * Skip rule: locale skipped when BOTH intro_text and body blocks arrays are non-empty.
 *
 * Requires STRAPI_MIGRATION_TOKEN and optional MIGRATION_BASE_URL (see lib/strapi-client.js).
 *
 * Run: node migrate-page-kontakt.js
 */
import { createStrapiClient } from './lib/strapi-client.js';
import { markdownToBlocks } from './lib/markdown-to-blocks.js';

const ENDPOINT = '/api/geko-page-kontakt';
/** Process `de` first so the single-type document exists before other locales. */
const LOCALES = ['de', 'en', 'fr', 'ro', 'tr', 'ar'];

/**
 * Source titles / bodies from `collections/_pages/kontakte.{locale}.md`.
 * introText is a short lead paragraph per locale (hand-written).
 */
const CONTENT = {
  de: {
    title: 'Alle Kontakte auf einen Blick',
    introText:
      'Hier finden Sie alle Kontakte unserer Geko-Praxen und Projekte auf einen Blick.',
    bodyMarkdown: `### Praxis für Allgemeinmedizin – Stadtteilpraxis

[+49 30 439720630](tel:+4930439720630)  
[info@stadtteilpraxis.de](mailto:info@stadtteilpraxis.de)

Sprechzeiten: [https://stadtteilpraxis.de](https://stadtteilpraxis.de/#block-2)

***

### Praxis für Kinder und Jugendmedizin – Berghafenpraxis

[+49 30 33953131](tel:+493033953131)  
[kindergesundheit@posteo.de](mailto:kindergesundheit@posteo.de)

Sprechzeiten: [https://berghafenpraxis.de](https://berghafenpraxis.de/#block-2)

***

### Beratung

[+49 30 62875406](tel:+493062875406)  
[beratung@geko-berlin.de](mailto:beratung@geko-berlin.de)

Offene Beratung: 13 - 15 Uhr im Geko
 
***

### Therapie für Kinder und Jugendliche

[+49 1573 522 44 07](tel:+49 1573 522 44 07)  
[therapie@geko-berlin.de](mailto:therapie@geko-berlin.de)

***

### Café-Praxis und Gruppenraum

[cafe@geko-berlin.de](mailto:cafe@geko-berlin.de)

***

### Nachbarschaftsprojekte

[+49 176 57715050](tel:+4917657715050)  
[dorit@geko-berlin.de](mailto:dorit@geko-berlin.de)

***

### Mobile Gesundheitsberatung

[+49 176 56907286](tel:+4917656907286)  
[s.lu@geko-berlin.de](mailto:s.lu@geko-berlin.de)

***

### Sport und Spiel im Kiez

[+49 157 73674050](tel:+4915773674050)  
[sport@geko-berlin.de](mailto:sport@geko-berlin.de)

***

### Verwaltung Verein
[+49 30 62 875 404](tel:+493062875404)    
[info@geko-berlin.de](mailto:info@geko-berlin.de)`,
  },
  en: {
    title: 'All contacts at a glance',
    introText:
      'Here you will find all contacts for our Geko practices and projects at a glance.',
    bodyMarkdown: `### General Practice – Stadtteilpraxis 
[+49 30 439720630](tel:+4930439720630)  
[info@stadtteilpraxis.de](mailto:info@stadtteilpraxis.de)

***

### Pediatric practice – Berghafenpraxis
[+49 30 33953131](tel:+493033953131)  
[kindergesundheit@posteo.de](mailto:kindergesundheit@posteo.de)

***

### Counseling
[+49 30 62875406](tel:+49 30 62875406)  
[beratung@geko-berlin.de](mailto:beratung@geko-berlin.de)

***

### Psychotherapy for children and young adults
[+49 1573 522 44 07](tel:+49 1573 522 44 07)  
[therapie@geko-berlin.de](mailto:therapie@geko-berlin.de)

***

### Café-Praxis and group room
[cafe@geko-berlin.de](mailto:cafe@geko-berlin.de)

***

### Community Projects
[+49 176-57715050](tel:+49 176-57715050)  
[dorit@geko-berlin.de](mailto:dorit@geko-berlin.de)

***

### Mobile health counseling
[+49 176 56907286](tel:+49 176 56907286)  
[s.lu@geko-berlin.de](mailto:s.lu@geko-berlin.de)

***

### Community sports and games
[+49 157 73674050](tel:+49 157 73674050)  
[sport@geko-berlin.de](mailto:sport@geko-berlin.de)`,
  },
  fr: {
    title: 'Tous les contacts en un coup d\'œil',
    introText:
      'Retrouvez ici tous les contacts des cabinets et projets Geko en un coup d\'œil.',
    bodyMarkdown: `### Cabinet de médecine générale – Stadtteilpraxis
[+49 30 439720630](tel:+4930439720630)  
[info@stadtteilpraxis.de](mailto:info@stadtteilpraxis.de)

***

### Cabinet de pédiatrie – Berghafenpraxis

[+49 30 33953131](tel:+493033953131)  
[kindergesundheit@posteo.de](mailto:kindergesundheit@posteo.de)

***

### Consultations

[+49 30 62875406](tel:+49 30 62875406)  
[beratung@geko-berlin.de](mailto:beratung@geko-berlin.de)

***

### Thérapie pour enfants et adolescents
[+49 1573 522 44 07](tel:+49 1573 522 44 07)  
[therapie@geko-berlin.de](mailto:therapie@geko-berlin.de)

***

### Café-Praxis et salle de groupe
[cafe@geko-berlin.de](mailto:cafe@geko-berlin.de)

***

### Café-Praxis et salle de groupe
[+49 176-57715050](tel:+49 176-57715050)  
[dorit@geko-berlin.de](mailto:dorit@geko-berlin.de)

***

### Consultation mobile de santé
[+49 176 56907286](tel:+49 176 56907286)  
[s.lu@geko-berlin.de](mailto:s.lu@geko-berlin.de)

***

### Activités sportives et ludiques dans le quartier
[+49 157 73674050](tel:+49 157 73674050)  
[sport@geko-berlin.de](mailto:sport@geko-berlin.de)`,
  },
  ro: {
    title: 'Toate contactele într-o privire',
    introText:
      'Găsiți aici toate contactele cabinetelor și proiectelor Geko.',
    bodyMarkdown: `### Cabinet de medicină generală – Stadtteilpraxis 
[+49 30 439720630](tel:+4930439720630)  
[info@stadtteilpraxis.de](mailto:info@stadtteilpraxis.de)

***

### Cabinet de pediatrie – Berghafenpraxis
[+49 30 33953131](tel:+493033953131)  
[kindergesundheit@posteo.de](mailto:kindergesundheit@posteo.de)

***

### Consiliere
[+49 30 62875406](tel:+49 30 62875406)  
[beratung@geko-berlin.de](mailto:beratung@geko-berlin.de)

***

### Terapie pentru copii și adolescenți
[+49 1573 522 44 07](tel:+49 1573 522 44 07)  
[therapie@geko-berlin.de](mailto:therapie@geko-berlin.de)

***

### Café-Praxis și sală de grup
[cafe@geko-berlin.de](mailto:cafe@geko-berlin.de)  

***

### Proiecte de cartier
[+49 176-57715050](tel:+49 176-57715050)  
[dorit@geko-berlin.de](mailto:dorit@geko-berlin.de)

***

### Consiliere mobilă pe teme de sănătate
[+49 176 56907286](tel:+49 176 56907286)  
[s.lu@geko-berlin.de](mailto:s.lu@geko-berlin.de)

***

### Sport și jocuri în cartier
[+49 157 73674050](tel:+49 157 73674050)  
[sport@geko-berlin.de](mailto:sport@geko-berlin.de)`,
  },
  tr: {
    title: 'Tüm İletişim Bilgileri',
    introText:
      'Geko muayenehaneleri ve projeleri için tüm iletişim bilgileri tek yerde.',
    bodyMarkdown: `**Genel Tıp Muayenehanesi – Bölge Muayenehanesi**

[+49 30 439720630](tel:+4930439720630)\
[info@stadtteilpraxis.de](mailto:info@stadtteilpraxis.de)

Çalışma saatleri: [https://stadtteilpraxis.de](https://stadtteilpraxis.de/#block-2)

- - -

### Çocuk ve Gençlik **Muayenehanesi** – Berghafen **Muayenehanesi**

[+49 30 33953131](tel:+493033953131)\
[kindergesundheit@posteo.de](mailto:kindergesundheit@posteo.de)

Çalışma saatleri: [https://berghafenpraxis.de](https://berghafenpraxis.de/#block-2)

- - -

### Danışma

[+49 30 62875406](tel:+493062875406)\
[beratung@geko-berlin.de](mailto:beratung@geko-berlin.de)

Açık Danışma: 13:00 - 15:00 Geko'da

- - -

### Çocuklar ve Ergenler için Terapi

\\[+49 1573 522 44 07](tel:+49 1573 522 44 07)\
[therapie@geko-berlin.de](mailto:therapie@geko-berlin.de)

- - -

### Kafe **Muayenehanesi** ve Grup Odası

[cafe@geko-berlin.de](mailto:cafe@geko-berlin.de)

- - -

### Mahalle projeleri

[+49 176 57715050](tel:+4917657715050)\
[dorit@geko-berlin.de](mailto:dorit@geko-berlin.de)

- - -

### Mobil Sağlık Tavsiyesi

[+49 176 56907286](tel:+4917656907286)\
[s.lu@geko-berlin.de](mailto:s.lu@geko-berlin.de)

- - -

### Mahallede Spor ve Oyunlar

[+49 157 73674050](tel:+4915773674050)\
[sport@geko-berlin.de](mailto:sport@geko-berlin.de)

- - -

### Dernek Yönetim   

[+49 30 62 875 404](tel:+493062875404)\
[info@geko-berlin.de](mailto:info@geko-berlin.de)`,
  },
  ar: {
    title: 'جميع جهات الاتصال في نظرة واحدة',
    introText:
      'هنا ستجد جميع جهات الاتصال لممارسات ومشاريع جيكو في مكان واحد.',
    bodyMarkdown: `### Stadtteilpraxis - العيادة للطب العام
<div class="direction:ltr">
  <a href="004930439720630">004930439720630</a>
</div>

[info@stadtteilpraxis.de](mailto:info@stadtteilpraxis.de)

### Berghafenpraxis - عيادة طب الأطفال
<div class="direction:ltr">
  <a href="00493033953131">00493033953131</a>
</div>

[kindergesundheit@posteo.de](mailto:kindergesundheit@posteo.de)

### الاستشارة
<div class="direction:ltr">
  <a href="00493062875406">00493062875406</a>
</div>

[beratung@geko-berlin.de](mailto:beratung@geko-berlin.de)

### العلاج النفسي للأطفال والمراهقين_ات
<div class="direction:ltr">
  <a href="004915735224407">004915735224407</a>
</div>

[therapie@geko-berlin.de](mailto:therapie@geko-berlin.de)

### مقهى "العيادة"
[cafe@geko-berlin.de](mailto:cafe@geko-berlin.de)

### مشاريع الجوار
<div class="direction:ltr">
  <a href="004917657715050">004917657715050</a>
</div>

[dorit@geko-berlin.de](mailto:dorit@geko-berlin.de)

### الاستشارة الصحية المتنقلة
<div class="direction:ltr">
  <a href="004917656907286">004917656907286</a>
</div>

[s.lu@geko-berlin.de](mailto:s.lu@geko-berlin.de)

### الرياضة واﻷلعاب في الحي
<div class="direction:ltr">
  <a href="004915773674050">004915773674050</a>
</div>

[sport@geko-berlin.de](mailto:sport@geko-berlin.de)`,
  },
};

const api = createStrapiClient();

/**
 * Strapi blocks fields must be non-empty arrays for PUT validation.
 */
function blocksFromMarkdown(markdown, fallback = '') {
  const cleaned = String(markdown ?? '').trim();
  const blocks = markdownToBlocks(cleaned);
  if (blocks && blocks.length > 0) return blocks;
  const text = fallback || cleaned || ' ';
  return [{ type: 'paragraph', children: [{ type: 'text', text }] }];
}

/** Locale considered seeded only when both required blocks fields are present. */
function localeIsComplete(row) {
  const introOk = Array.isArray(row?.intro_text) && row.intro_text.length > 0;
  const bodyOk = Array.isArray(row?.body) && row.body.length > 0;
  return introOk && bodyOk;
}

async function fetchKontaktRow(locale) {
  try {
    const { data } = await api.get(ENDPOINT, { params: { locale } });
    return data?.data ?? null;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw err;
  }
}

function buildPayload(locale) {
  const L = CONTENT[locale];
  if (!L) throw new Error(`No embedded CONTENT for locale "${locale}"`);
  return {
    title: L.title,
    intro_text: blocksFromMarkdown(L.introText),
    body: blocksFromMarkdown(L.bodyMarkdown),
  };
}

async function putKontakt(locale, payload, primaryDocumentId) {
  const { data } = await api.put(ENDPOINT, { data: payload }, { params: { locale } });
  const id = data?.data?.documentId ?? primaryDocumentId;
  console.log(`  ✓ ${locale} → documentId ${id}`);
  return data?.data?.documentId ?? id;
}

async function migrate() {
  console.log('=== Migrate geko-page-kontakt ===\n');

  const stats = Object.fromEntries(
    LOCALES.map((l) => [l, { status: 'pending', documentId: null }]),
  );

  let primaryDocumentId = null;

  for (const locale of LOCALES) {
    try {
      const row = await fetchKontaktRow(locale);
      if (localeIsComplete(row)) {
        console.log(`⏭ Skip (${locale}): intro_text and body already present`);
        stats[locale].status = 'skipped';
        stats[locale].documentId = row?.documentId ?? null;
        if (!primaryDocumentId && row?.documentId) primaryDocumentId = row.documentId;
        continue;
      }

      const payload = buildPayload(locale);
      const docId = await putKontakt(locale, payload, primaryDocumentId);
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
    console.log(
      `  ${locale}: ${s.status}${s.documentId ? ` (${s.documentId})` : ''}`,
    );
  }
  console.log(`\n  Created: ${created}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Failed:  ${failed}\n`);

  if (failed > 0) process.exit(1);
}

migrate();
