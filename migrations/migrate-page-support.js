/**
 * Idempotent migration: seed `geko-page-support` locales en, fr, ro, tr, ar.
 * Source: geko-verein/collections/_blocks/liebe-nachbar-innen-... (buttons stripped).
 * intro_text = same lorem as DE; header_image omitted (non-localized, shared).
 *
 * Run: node migrate-page-support.js
 */
import { createStrapiClient } from './lib/strapi-client.js';
import { markdownToBlocks } from './lib/markdown-to-blocks.js';

const ENDPOINT = '/api/geko-page-support';
const LOCALES = ['en', 'fr', 'ro', 'tr', 'ar'];

const LOREM_INTRO = `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`;

function stripSupportMarkdown(md) {
  return String(md ?? '')
    .replace(/<button\b[\s\S]*?<\/button>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Body markdown after stripping `<button>` / `<br>` from legacy blocks */
const BODY_MARKDOWN_RAW = {
  en: `Join our cause by becoming a sponsoring member.

Single donations are also welcome!

**Donation account**

Gesundheitskollektiv e.V.

DE92 3702 0500 0001 6111 01

BIC: BFSWDE33BER

Reference line: "Spende"

Our non-profit organisation sustains itself through public funds. But these subsidies do not cover all of the important aspects of our work, which is why we still depend on donations and membership fees. Your contribution helps us stay politically independent.`,
  fr: `En devenant membre de soutien, vous pouvez faire bouger les choses.

Un don ponctuel nous aide également !

**Nos coordonnées bancaires**

Gesundheitskollektiv e.V.

DE92 3702 0500 0001 6111 01

BIC: BFSWDE33BER

motif du virement: « Spende » (don)

Notre association à but non lucratif et d'intérêt général est financée par des subventions. Des domaines essentiels de notre travail ne peuvent pas être couverts par ces moyens. C'est pourquoi vos dons et cotisations sont si importantes. Vous nous aidez à rester politiquement indépendant⋅es.`,
  ro: `Cu un abonament de donații puteți ajuta foarte mult.

Chiar și o donație unică ne ajută foarte mult!

**Cont pentru donații**

Gesundheitskollektiv e.V.

DE92 3702 0500 0001 6111 01

BIC: BFSWDE33BER

Scopul plății: "Spende"

Asociația noastră nonprofit este finanțată cu ajutorul fondurilor. Acestea nu acoperă însă unele părți importante ale activității noastre. De aceea sunt importante donațiile și contribuțiile de membru. Ne ajutăm să ne menținem independența politică.`,
  tr: `Destekleyici üyelikle çok şey başarabilirsiniz.

Tek seferlik bir bağış bile  yardımcı olur!

**Bağış Hesabı**

Gesundheitskollektiv e.V.

DE92 3702 0500 0001 6111 01

BIC: BFSWDE33BER

Amaç: "Bağış"

Kâr amacı gütmeyen derneğimiz hibelerle finanse edilmektedir. Bu hibeler olmadan çalışmamızın önemli bir kısmını yürütemeyiz. Bağışlar ve üyelik aidatları bu nedenle önemlidir. Siyasi olarak bağımsız kalmamıza yardımcı oluyorsunuz.`,
  ar: `مع عضوية داعمة يمكنكم_كن تحقيق الكثير.

حتى التبرع لمرة واحدة يساعدنا!

**حساب التبرع**

Gesundheitskollektiv eV

DE92 3702 0500 0001 6111 01

BIC: BFSWDE33BER

الغرض: "Spende" ("التبرع")

يتم تمويل جمعيتنا غير الربحية من خلال المنح الذي لا يكفي لتغطية كل المجالات المهمة من عملنا. لذلك التبرعات والرسوم العضوية مهمة. تساعدنا على البقاء مستقلين سياسيًا.`,
};

const TITLES = {
  en: 'Dear neighbors: support your local health care center in Neukölln!',
  fr: 'Chères voisines, chers voisins, soutenez votre centre de santé à Neukölln!',
  ro: 'Dragi vecini și vecine, sprijiniți Centrul de sănătate din Neukölln!',
  tr: "Sevgili komşularımız, Neukölln'deki sağlık merkezinize destek olun!",
  ar: 'أهالينا الأعزاء بالحي، إدعم مركزكم_كن الصحي المحلي في نويكولن!',
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
  const introOk = Array.isArray(row?.intro_text) && row.intro_text.length > 0;
  const bodyOk = Array.isArray(row?.body) && row.body.length > 0;
  return introOk && bodyOk;
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
  console.log('=== Migrate geko-page-support ===\n');

  const stats = Object.fromEntries(
    LOCALES.map((l) => [l, { status: 'pending', documentId: null }]),
  );

  let primaryDocumentId = null;
  const introBlocks = blocksFromMarkdown(LOREM_INTRO);

  for (const locale of LOCALES) {
    try {
      const row = await fetchRow(locale);
      if (localeIsComplete(row)) {
        console.log(`⏭ Skip (${locale}): intro_text and body already present`);
        stats[locale].status = 'skipped';
        stats[locale].documentId = row?.documentId ?? null;
        if (!primaryDocumentId && row?.documentId) primaryDocumentId = row.documentId;
        continue;
      }

      const bodyMd = stripSupportMarkdown(BODY_MARKDOWN_RAW[locale]);

      const payload = {
        title: TITLES[locale],
        intro_text: introBlocks,
        body: blocksFromMarkdown(bodyMd),
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
