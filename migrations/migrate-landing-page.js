/**
 * Idempotent migration: seed `geko-page-landing` dynamic zone per locale from legacy
 * geko-verein/collections/_blocks (content embedded below).
 *
 * Requires STRAPI_MIGRATION_TOKEN and optional MIGRATION_BASE_URL (see lib/strapi-client.js).
 *
 * Run: node migrate-landing-page.js
 */
import { createStrapiClient } from './lib/strapi-client.js';
import { markdownToBlocks } from './lib/markdown-to-blocks.js';

const ENDPOINT = '/api/geko-page-landing';
const CTA_ENDPOINT = '/api/geko-ctas';
const CTA_NAME = 'Fördermitgliedschaft';
/** Process `de` first so the single-type document exists before other locales. */
const LOCALES = ['de', 'en', 'fr', 'ro', 'tr', 'ar'];

/**
 * Source: geko-verein/collections/_blocks/*.md (welcome, was-finde-ich-hier, aktuelles, calendar, about).
 * About bodies still contain Liquid/HTML markers — strip at runtime before markdownToBlocks.
 */
const CONTENT = {
  de: {
    welcomeTitle: 'Geko - Euer Stadtteil-Gesundheits-Zentrum in Neukölln',
    welcomeBody:
      'Hier findet ihr verschiedene Angebote rund um Gesundheit - und darüber hinaus. Allgemeinmedizinische und kindermedizinische Praxen, Beratung, Selbsthilfe, Austausch und ein Café, alles unter einem Dach. \\\nLeicht zugänglich, mehrsprachig und kostenlos.',
    servicesTitle: 'Was finde ich hier?',
    newsTitle: 'Aktuelles',
    calendarTitle: 'Veranstaltungskalender',
    aboutTitle: 'Wer sind wir?',
    aboutBody: `Das Gesundheitskollektiv Berlin e.V. gibt es seit 2016. Wir sind ein Zusammenschluss verschiedener Gesundheitsberufe. Gemeinsam setzen wir uns für eine gute Gesundheitsversorgung für alle Menschen ein - unabhängig von Herkunft, Alter, Geschlecht oder Bildung.

Unsere Vision ist der flächendeckende Aufbau gemeinwohlorientierter Stadtteilgesundheitszentren und der Abbau gesellschaftlicher Ungleichheiten.

{% include responsive_images/image.html path="./assets/img/gruppenfoto_geko_eröffnung2022-lres.jpg" class="img-fluid rounded w-100" %}

<button class="btn-geko bg-white px-3">
  <a href="/ueber_uns">mehr über uns</a>
</button>`,
  },
  en: {
    welcomeTitle: 'Geko - Your Community Health Care Center in Neukölln',
    welcomeBody:
      'We offer you a broad and holistic range of health care and community services. At Geko you will find a general medical practice and a pediatric practice, counseling, self-help programs, social activities and a café – all under one roof.\n\nEasily accessible, multilingual and free of cost.',
    servicesTitle: 'What will I find at Geko?',
    newsTitle: 'News',
    calendarTitle: 'Event calendar',
    aboutTitle: 'About us',
    aboutBody: `The Gesundheitskollektiv Berlin e.V. was founded in 2016. Our team combines expertise from different health care professions. Together we strive to provide good health care to everyone – regardless of their origin, age, gender or education.

Our vision is to help build a comprehensive network of non-profit community health care centers and to help reduce social inequalities.

{% include responsive_images/image.html path="./assets/img/gruppenfoto_geko_eröffnung2022-lres.jpg" class="img-fluid rounded w-100" %}

<button class="btn-geko bg-white px-3">
  <a href="/en/ueber_uns">more about us</a>
</button>`,
  },
  fr: {
    welcomeTitle: 'Geko – votre centre de santé de quartier à Neukölln',
    welcomeBody:
      "Vous y trouverez divers offres autour de la santé – et bien plus encore.\n\nDes cabinets de médecine générale et de pédiatrie, des consultations, de l'entraide et de l'échange, ainsi qu'un café – le tout réunit sous le même toit.\n\nFacile d'accès, en plusieurs langues et gratuit.",
    servicesTitle: "Qu'est-ce que je peux trouver ici?",
    newsTitle: 'Actualité',
    calendarTitle: 'Event calendar',
    aboutTitle: 'Qui sommes nous?',
    aboutBody: `Le Gesundheitskollektiv Berlin e.V. existe depuis 2016. Notre association rassemble différentes professions de santé. Ensemble, nous nous engageons pour des soins de santé de qualité pour toutes les personnes, indépendamment de leur origine, de leur âge, de leur sexe ou de leur niveau d'éducation.

Nous portons la vision d'une mise en place généralisée de centres de santé de quartier orientés vers l'intérêt général et la réduction des inégalités sociales.

{% include responsive_images/image.html path="./assets/img/gruppenfoto_geko_eröffnung2022-lres.jpg" class="img-fluid rounded w-100" %}

<button class="btn-geko bg-white px-3">
  <a href="/fr/sur_nous">Pour en savoir plus</a>
</button>`,
  },
  ro: {
    welcomeTitle: 'Geko - Centrul vostru local de sănătate din Neukölln',
    welcomeBody:
      'Aici găsiți diverse oferte de sănătate - și nu numai.\\\nCabinete de medicină generală și pediatrie, consiliere, sprijin, auto-ajutor, schimb de opinii și o cafenea, toate sub același acoperiș.\\\nFoarte accesibil, multilingv și gratuit.',
    servicesTitle: 'Ce găsesc aici?',
    newsTitle: 'Informații actuale',
    calendarTitle: 'Calendar de evenimente',
    aboutTitle: 'Cine suntem?',
    aboutBody: `Das Gesundheitskollektiv Berlin e.V. a fost înființat în 2016. Aducem împreună diverse profesii din domeniul sănătății. Împreună dorim să oferim servicii de sănătate pentru toți oamenii - indiferent de origine, vârstă, sex sau nivelul educației.

Viziunea noastră reprezintă extinderea de centre de sănătate de cartier orientate către binele comun și eliminarea diferențelor sociale.

{% include responsive_images/image.html path="./assets/img/gruppenfoto_geko_eröffnung2022-lres.jpg" class="img-fluid rounded w-100" %}

<button class="btn-geko bg-white px-3">
  <a href="/ro/ueber_uns">mai multe despre noi</a>
</button>`,
  },
  tr: {
    welcomeTitle: "Geko - Neukölln'deki Bölge Sağlık Merkeziniz",
    welcomeBody:
      'Burada sağlık ve ötesiyle ilgili çeşitli teklifler bulacaksınız. Genel tıbbi ve pediatrik muayenehaneler, tavsiyeler, kendi kendine yardım, değişim ve kafe, hepsi tek bir çatı altında. \\\nKolayca erişilebilir, çok dilli ve ücretsiz.',
    servicesTitle: 'Burada ne bulabilirim?',
    newsTitle: 'Haberler',
    calendarTitle: 'Etkinlik Takvimi',
    aboutTitle: 'Hakkımızda',
    aboutBody: `Gesundheitskollektiv Berlin e.V. 2016 yılında kuruldu. Ekibimiz, farklı sağlık mesleklerinden uzmanlıkları bir araya getiriyor. Birlikte, köken, yaş, cinsiyet veya eğitim durumu ne olursa olsun herkese iyi sağlık hizmeti sunmak için çalışıyoruz.

Vizyonumuz, kapsamlı bir kâr amacı gütmeyen toplum sağlığı merkezleri ağı oluşturmaya yardımcı olmak ve sosyal eşitsizlikleri azaltmaktır.

{% include responsive_images/image.html path="./assets/img/gruppenfoto_geko_eröffnung2022-lres.jpg" class="img-fluid rounded w-100" %}

<button class="btn-geko bg-white px-3">
  <a href="/tr/ueber_uns">hakkımızda daha fazla</a>
</button>`,
  },
  ar: {
    welcomeTitle: 'Geko – مركزكم_كن الصحي المحلي في نويكولن',
    welcomeBody:
      'توجد هنا العديد من العروض المتعلقة بالصحة – وما بعدها – مثل العيادات للطب العام وطب الأطفال والاستشارة والمساعدة الذاتية والتبادل والمقهى، وكل ذلك تحت سقف واحد.\n\nسهل الوصول إليه ومتعدد اللغات المتكلمة وكل العروض مجانية.',
    servicesTitle: 'ماذا سأجد هنا؟',
    newsTitle: 'حاليًا',
    calendarTitle: 'تقويم الفعاليات',
    aboutTitle: 'من نحن؟',
    aboutBody: `"أنشئت جمعية "جماعة للصحة برلين (Gesundheitskollektiv Berlin eV) في عام 2016. نحن جمعية للمهن الصحية المختلفة. معًا نلتزم بتقديم رعاية صحية جيدة لجميع الأشخاص - بغض النظر عن الأصل أو العمر أو الجنس أو مستوى التعليم.

تتمثل رؤيتنا في تطوير مراكز صحية في كل مكان في الوطن الموجهة نحو الصالح العام والحد من التفاوتات الاجتماعية.

{% include responsive_images/image.html path="./assets/img/gruppenfoto_geko_eröffnung2022-lres.jpg" class="img-fluid rounded w-100" %}

<button class="btn-geko bg-white px-3">
  <a href="/ar/ueber_uns">مزيد من المعلومات عنّا</a>
</button>`,
  },
};

const api = createStrapiClient();

function stripAboutMarkdown(markdown) {
  if (!markdown) return '';
  return markdown
    .replace(/\{%\s*include[\s\S]*?%\}/g, '')
    .replace(/<button\b[\s\S]*?<\/button>/gi, '')
    .trim();
}

/** @returns {boolean} */
function localeHasContent(row) {
  const c = row?.content;
  return Array.isArray(c) && c.length > 0;
}

async function fetchCtaDocumentId() {
  const { data } = await api.get(CTA_ENDPOINT, {
    params: {
      'filters[cta_name][$eq]': CTA_NAME,
      'pagination[pageSize]': 1,
      locale: 'de',
    },
  });

  const row = data?.data?.[0];
  const documentId = row?.documentId;
  if (!documentId) {
    throw new Error(
      `No geko-cta found with cta_name="${CTA_NAME}". Run migrate-ctas.js first.`,
    );
  }
  return documentId;
}

async function fetchLandingRow(locale) {
  try {
    const { data } = await api.get(ENDPOINT, { params: { locale } });
    return data?.data ?? null;
  } catch (err) {
    if (err.response?.status === 404) return null;
    throw err;
  }
}

function buildDynamicZone(locale, ctaDocumentId) {
  const L = CONTENT[locale];
  if (!L) throw new Error(`No embedded CONTENT for locale "${locale}"`);

  const welcomeBlocks = markdownToBlocks(L.welcomeBody);
  const aboutBlocks = markdownToBlocks(stripAboutMarkdown(L.aboutBody));

  return [
    {
      __component: 'geko-page-blocks.welcome',
      title: L.welcomeTitle,
      ...(welcomeBlocks?.length ? { content: welcomeBlocks } : {}),
    },
    {
      __component: 'geko-page-blocks.services',
      title: L.servicesTitle,
    },
    {
      __component: 'geko-page-blocks.news',
      title: L.newsTitle,
    },
    {
      __component: 'geko-page-blocks.calendar',
      title: L.calendarTitle,
    },
    {
      __component: 'geko-page-blocks.about',
      title: L.aboutTitle,
      ...(aboutBlocks?.length ? { content: aboutBlocks } : {}),
    },
    {
      __component: 'geko-page-blocks.cta',
      geko_cta: ctaDocumentId,
    },
  ];
}

async function putLanding(locale, content, documentIdLabel) {
  const { data } = await api.put(
    ENDPOINT,
    { data: { content } },
    { params: { locale } },
  );
  const id = data?.data?.documentId ?? documentIdLabel;
  console.log(`  ✓ ${locale} → documentId ${id}`);
  return data?.data?.documentId ?? id;
}

async function migrate() {
  console.log('=== Migrate geko-page-landing ===\n');

  let ctaDocumentId;
  try {
    ctaDocumentId = await fetchCtaDocumentId();
    console.log(`CTA "${CTA_NAME}" → ${ctaDocumentId}\n`);
  } catch (err) {
    console.error(
      '✗ CTA lookup failed:',
      err.response?.data?.error || err.message,
    );
    process.exit(1);
  }

  const stats = Object.fromEntries(
    LOCALES.map((l) => [l, { status: 'pending', documentId: null }]),
  );

  let primaryDocumentId = null;

  for (const locale of LOCALES) {
    try {
      const row = await fetchLandingRow(locale);
      if (localeHasContent(row)) {
        console.log(`⏭ Skip (${locale}): content already present`);
        stats[locale].status = 'skipped';
        stats[locale].documentId = row?.documentId ?? null;
        if (!primaryDocumentId && row?.documentId) primaryDocumentId = row.documentId;
        continue;
      }

      const zone = buildDynamicZone(locale, ctaDocumentId);
      const docId = await putLanding(locale, zone, primaryDocumentId);
      stats[locale].status = 'created';
      stats[locale].documentId = docId;
      if (!primaryDocumentId && docId) primaryDocumentId = docId;
    } catch (err) {
      stats[locale].status = 'failed';
      console.error(
        `  ✗ ${locale}:`,
        err.response?.data?.error || err.message,
      );
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
