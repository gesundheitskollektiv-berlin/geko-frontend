<script>
  import { page } from '$app/stores';
  import { buildPageMeta, plainTextFromRichText } from '$lib/helpers/pageMeta';
  import PageMeta from '$lib/components/PageMeta.svelte';
  import RtlScope from '$lib/components/RtlScope.svelte';
  import SubpageContent from '$lib/components/SubpageContent.svelte';
  import NewsletterBlock from '$lib/components/page-blocks/NewsletterBlock.svelte';
  import FooterBlock from '$lib/components/page-blocks/FooterBlock.svelte';
  import SupportersBlock from '$lib/components/page-blocks/SupportersBlock.svelte';
  import Breadcrumb from '$lib/components/Breadcrumb.svelte';
  import MaterialsSection from '$lib/components/materials/MaterialsSection.svelte';
  import { t } from '$lib/helpers/translation';

  let { data } = $props();

  const aboutPage = $derived(data['geko-page-about']?.data ?? {});
  const materials = $derived(data['geko-materials']?.data ?? []);
  const locale = $derived(data.locale);
  const meta = $derived(data['geko-meta']?.data ?? {});

  const pageMeta = $derived(
    buildPageMeta({
      title: `${aboutPage.title || t(locale).aboutUs} - Geko`,
      description: plainTextFromRichText(aboutPage.intro_text),
      imageAsset: aboutPage.header_image,
      pageUrl: $page.url,
      locale
    })
  );
</script>

<PageMeta {...pageMeta} />

<RtlScope {locale}>
  <SubpageContent page={aboutPage}>
    {#snippet breadcrumb()}
      <Breadcrumb
        items={[
          { label: t(locale).home, href: `/${locale}` },
          { label: t(locale).aboutUs },
        ]}
      />
    {/snippet}
  </SubpageContent>

  <!-- <section class="bg-geko-white py-5">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-11 col-sm-11">
        <h1 class="mb-3 mb-lg-5">{t(locale).jobOffers}</h1>
        <p class="mb-0">
          {t(locale).jobOffersIntro}
          <a href="/{locale}/aktuelles">{t(locale).announcements}</a>.
        </p>
      </div>
    </div>
  </div>
</section> -->

  <MaterialsSection {materials} {locale} />
</RtlScope>

<NewsletterBlock {locale} />

<FooterBlock {meta} {locale} />

<SupportersBlock {locale} />
