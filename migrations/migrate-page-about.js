/**
 * Idempotent migration: seed `geko-page-about` locales en, fr, ro, tr, ar.
 *
 * body mirrors the canonical DE Strapi block structure; intro_text = first two body blocks.
 * header_image reuses DE media relation by numeric id (no upload).
 *
 * Run: node migrate-page-about.js
 */
import { createStrapiClient } from './lib/strapi-client.js';

const ENDPOINT = '/api/geko-page-about';
const LOCALES = ['en', 'fr', 'ro', 'tr', 'ar'];
/** DE gruppenfoto header on Strapi CMS */
const HEADER_IMAGE_DOCUMENT_ID = 'jd3vuaioqskf758uixjkf59m';

const TITLES = {
  en: 'Who are we?',
  fr: 'Qui sommes-nous?',
  ro: 'Cine suntem?',
  tr: 'Biz kimiz?',
  ar: 'من نحن؟',
};

const p = (children) => ({ type: 'paragraph', children });
const h3 = (children) => ({ type: 'heading', level: 3, children });
const t = (text, opts = {}) => ({ type: 'text', text, ...opts });
const empty = () => p([t('')]);

const BODY_BLOCKS = {
  en: [
    p([
      t('The '),
      t('Geko Community Health Center', { bold: true }),
      t(' is operated by the association '),
      t('Gesundheitskollektiv Berlin e.V.', { bold: true }),
      t(
        ' in cooperation with a general medical practice, a pediatric practice, a child and adolescent psychotherapist, and two adult therapists.',
      ),
    ]),
    p([
      t('Our vision', { bold: true }),
      t(
        ' is the widespread development of community-oriented neighborhood health centers and the reduction of social inequalities.',
      ),
    ]),
    empty(),
    h3([t('The association')]),
    p([
      t('The '),
      t('Gesundheitskollektiv Berlin e.V. ', { bold: true }),
      t(
        'has existed since 2016. We are an association of different health professions. Together, we advocate for good health care for everyone - regardless of origin, age, gender, or education.',
      ),
    ]),
    p([
      t(
        'More than 25 people with professional backgrounds in social work, nursing, medicine, health sciences, education, psychotherapy, and law are active in Gesundheitskollektiv Berlin. We believe that access to excellent medical care for all people and the promotion of health by improving living and working conditions should be core responsibilities of the health system. Exclusion through racism, language, economic interests, or financial barriers has no place here. In the spirit of the WHO, we demand ',
      ),
      t('health for all!', { bold: true }),
    ]),
    empty(),
    h3([t('Note on job postings')]),
    p([
      t(
        'Would you like to work at the Community Health Center? We are very pleased about your interest. Unfortunately, we do not have an HR department that can handle unsolicited applications. Therefore, we unfortunately cannot answer or store unsolicited applications. We ask you to apply only for posted positions. Current job postings can always be found under ',
      ),
      t('News', { bold: true }),
      t('.'),
    ]),
  ],
  fr: [
    p([
      t('Le '),
      t('centre de santé de quartier Geko', { bold: true }),
      t(" est géré par l'association "),
      t('Gesundheitskollektiv Berlin e.V.', { bold: true }),
      t(
        " en coopération avec un cabinet de médecine générale, un cabinet de pédiatrie, une psychothérapeute pour enfants et adolescents ainsi que deux thérapeutes pour adultes.",
      ),
    ]),
    p([
      t('Notre vision', { bold: true }),
      t(
        " est le développement généralisé de centres de santé de quartier orientés vers l'intérêt général et la réduction des inégalités sociales.",
      ),
    ]),
    empty(),
    h3([t("L'association")]),
    p([
      t('Le '),
      t('Gesundheitskollektiv Berlin e.V. ', { bold: true }),
      t(
        "existe depuis 2016. Nous sommes un regroupement de différentes professions de santé. Ensemble, nous nous engageons pour de bons soins de santé pour toutes les personnes, indépendamment de l'origine, de l'âge, du genre ou du niveau d'éducation.",
      ),
    ]),
    p([
      t(
        "Au Gesundheitskollektiv Berlin, plus de 25 personnes ayant des parcours professionnels dans le travail social, les soins infirmiers, la médecine, les sciences de la santé, la pédagogie, la psychothérapie et le droit sont actives. Nous pensons que l'accès à d'excellents soins médicaux pour toutes les personnes et la promotion de la santé par l'amélioration des conditions de vie et de travail devraient être des missions centrales du système de santé. L'exclusion par le racisme, la langue, les intérêts économiques ou les barrières financières n'a pas sa place ici. Dans l'esprit de l'OMS, nous revendiquons la ",
      ),
      t('santé pour toutes et tous!', { bold: true }),
    ]),
    empty(),
    h3([t("Note sur les offres d'emploi")]),
    p([
      t(
        "Vous souhaitez travailler au centre de santé de quartier? Nous nous réjouissons vivement de votre intérêt. Malheureusement, nous n'avons pas de service du personnel pouvant traiter les candidatures spontanées. Nous ne pouvons donc malheureusement ni répondre aux candidatures spontanées ni les conserver. Nous vous prions de postuler uniquement aux offres publiées. Vous trouverez toujours les offres d'emploi actuelles sous ",
      ),
      t('Actualités', { bold: true }),
      t('.'),
    ]),
  ],
  ro: [
    p([
      t('Centrul de sănătate de cartier Geko', { bold: true }),
      t(' este administrat de asociația '),
      t('Gesundheitskollektiv Berlin e.V.', { bold: true }),
      t(
        ' în cooperare cu un cabinet de medicină generală, un cabinet de pediatrie, o psihoterapeută pentru copii și adolescenți și doi terapeuți pentru adulți.',
      ),
    ]),
    p([
      t('Viziunea noastră', { bold: true }),
      t(
        ' este dezvoltarea pe scară largă a centrelor de sănătate de cartier orientate spre binele comun și reducerea inegalităților sociale.',
      ),
    ]),
    empty(),
    h3([t('Asociația')]),
    p([
      t('Asociația '),
      t('Gesundheitskollektiv Berlin e.V. ', { bold: true }),
      t(
        'există din 2016. Suntem o reuniune a diferitelor profesii din domeniul sănătății. Împreună ne implicăm pentru o bună îngrijire medicală pentru toți oamenii - indiferent de origine, vârstă, gen sau educație.',
      ),
    ]),
    p([
      t(
        'În Gesundheitskollektiv Berlin sunt active peste 25 de persoane cu experiență profesională în asistență socială, îngrijire, medicină, științe ale sănătății, pedagogie, psihoterapie și drept. Considerăm că accesul la îngrijire medicală excelentă pentru toți oamenii și promovarea sănătății prin îmbunătățirea condițiilor de viață și de muncă ar trebui să fie sarcini centrale ale sistemului de sănătate. Excluderea prin rasism, limbă, interese economice sau bariere financiare nu își are locul aici. În spiritul OMS, cerem ',
      ),
      t('sănătate pentru toți!', { bold: true }),
    ]),
    empty(),
    h3([t('Notă privind anunțurile de angajare')]),
    p([
      t(
        'Doriți să lucrați la Centrul de sănătate de cartier? Ne bucurăm foarte mult de interesul dumneavoastră. Din păcate, nu avem un departament de resurse umane care să se ocupe de candidaturi spontane. De aceea, din păcate, nu putem răspunde la candidaturi spontane și nici nu le putem salva. Vă rugăm să aplicați numai la anunțurile publicate. Anunțurile de angajare actuale se găsesc întotdeauna la ',
      ),
      t('Actualități', { bold: true }),
      t('.'),
    ]),
  ],
  tr: [
    p([
      t('Geko Mahalle Sağlık Merkezi', { bold: true }),
      t(' dernek '),
      t('Gesundheitskollektiv Berlin e.V.', { bold: true }),
      t(
        ' tarafından; bir genel tıp muayenehanesi, bir çocuk hekimliği muayenehanesi, bir çocuk ve ergen psikoterapisti ve iki yetişkin terapisti ile işbirliği içinde işletilmektedir.',
      ),
    ]),
    p([
      t('Vizyonumuz', { bold: true }),
      t(
        ' kamu yararına odaklanan mahalle sağlık merkezlerinin ülke çapında yaygınlaştırılması ve toplumsal eşitsizliklerin azaltılmasıdır.',
      ),
    ]),
    empty(),
    h3([t('Dernek')]),
    p([
      t(''),
      t('Gesundheitskollektiv Berlin e.V. ', { bold: true }),
      t(
        '2016 yılından beri vardır. Farklı sağlık mesleklerinden oluşan bir topluluğuz. Birlikte, köken, yaş, cinsiyet veya eğitimden bağımsız olarak herkes için iyi sağlık hizmetleri için çalışıyoruz.',
      ),
    ]),
    p([
      t(
        "Gesundheitskollektiv Berlin'de sosyal hizmet, bakım, tıp, sağlık bilimleri, pedagoji, psikoterapi ve hukuk alanlarında mesleki geçmişe sahip 25'ten fazla kişi aktiftir. Herkes için mükemmel sağlık hizmetlerine erişimin ve yaşam ile çalışma koşullarının iyileştirilmesi yoluyla sağlığın desteklenmesinin sağlık sisteminin merkezi görevleri olması gerektiğini düşünüyoruz. Irkçılık, dil, ekonomik çıkarlar veya mali engeller nedeniyle dışlanmanın burada yeri yoktur. DSÖ'nün ruhuyla ",
      ),
      t('herkes için sağlık!', { bold: true }),
      t(' talep ediyoruz.'),
    ]),
    empty(),
    h3([t('İş ilanları hakkında bilgilendirme')]),
    p([
      t(
        'Mahalle Sağlık Merkezi’nde çalışmak ister misiniz? İlginiz için çok memnunuz. Ne yazık ki, kendiliğinden yapılan başvurularla ilgilenebilecek bir personel departmanımız yok. Bu nedenle kendiliğinden yapılan başvurulara ne yazık ki yanıt veremiyor veya onları saklayamıyoruz. Lütfen yalnızca ilan edilmiş pozisyonlara başvurun. Güncel iş ilanlarını her zaman ',
      ),
      t('Güncel', { bold: true }),
      t(' bölümünde bulabilirsiniz.'),
    ]),
  ],
  ar: [
    p([
      t('يدير '),
      t('مركز Geko الصحي المجتمعي', { bold: true }),
      t(' جمعية '),
      t('Gesundheitskollektiv Berlin e.V.', { bold: true }),
      t(
        ' بالتعاون مع عيادة للطب العام وعيادة لطب الأطفال ومعالجة نفسية للأطفال واليافعين ومعالجين اثنين للبالغين.',
      ),
    ]),
    p([
      t('رؤيتنا', { bold: true }),
      t(
        ' هي إنشاء مراكز صحية مجتمعية موجهة للصالح العام على نطاق واسع والحد من أوجه عدم المساواة الاجتماعية.',
      ),
    ]),
    empty(),
    h3([t('الجمعية')]),
    p([
      t('توجد جمعية '),
      t('Gesundheitskollektiv Berlin e.V. ', { bold: true }),
      t(
        'منذ عام 2016. نحن تجمع يضم مهنا صحية مختلفة. نعمل معا من أجل رعاية صحية جيدة لجميع الناس، بغض النظر عن الأصل أو العمر أو الجنس أو التعليم.',
      ),
    ]),
    p([
      t(
        'ينشط في Gesundheitskollektiv Berlin أكثر من 25 شخصا من خلفيات مهنية في العمل الاجتماعي والتمريض والطب وعلوم الصحة والتربية والعلاج النفسي والقانون. نرى أن الوصول إلى رعاية طبية ممتازة لجميع الناس وتعزيز الصحة من خلال تحسين ظروف الحياة والعمل يجب أن يكونا من المهام الأساسية للنظام الصحي. لا مكان هنا للإقصاء بسبب العنصرية أو اللغة أو المصالح الاقتصادية أو الحواجز المالية. وبروح منظمة الصحة العالمية نطالب بـ ',
      ),
      t('الصحة للجميع!', { bold: true }),
    ]),
    empty(),
    h3([t('ملاحظة بشأن إعلانات الوظائف')]),
    p([
      t(
        'هل ترغبون في العمل في مركز الصحة المجتمعي؟ يسعدنا اهتمامكم كثيرا. للأسف ليس لدينا قسم شؤون موظفين يمكنه التعامل مع الطلبات غير المطلوبة. لذلك لا يمكننا للأسف الرد على هذه الطلبات أو حفظها. نرجو منكم التقدم فقط للوظائف المعلنة. تجدون إعلانات الوظائف الحالية دائما ضمن ',
      ),
      t('الأخبار', { bold: true }),
      t('.'),
    ]),
  ],
};

const api = createStrapiClient();

function localeIsComplete(row) {
  const introOk = Array.isArray(row?.intro_text) && row.intro_text.length > 0;
  const bodyOk = Array.isArray(row?.body) && row.body.length > 0;
  return introOk && bodyOk;
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
  console.log('=== Migrate geko-page-about ===\n');

  const stats = Object.fromEntries(
    LOCALES.map((l) => [l, { status: 'pending', documentId: null }]),
  );

  const headerImageId = await resolveHeaderImageId();
  console.log(`  → header_image numeric id: ${headerImageId}`);

  let primaryDocumentId = null;

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

      const bodyBlocks = BODY_BLOCKS[locale];
      const introBlocks = bodyBlocks.slice(0, 2);

      const payload = {
        title: TITLES[locale],
        intro_text: introBlocks,
        body: bodyBlocks,
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
