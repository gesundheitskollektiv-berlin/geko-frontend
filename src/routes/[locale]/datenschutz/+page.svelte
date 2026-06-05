<script>
  import { page } from '$app/stores';
  import { buildPageMeta } from '$lib/helpers/pageMeta';
  import PageMeta from '$lib/components/PageMeta.svelte';
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import RtlScope from '$lib/components/RtlScope.svelte';
  import Breadcrumb from '$lib/components/Breadcrumb.svelte';
  import FooterBlock from '$lib/components/page-blocks/FooterBlock.svelte';
  import SupportersBlock from '$lib/components/page-blocks/SupportersBlock.svelte';
  import { t } from '$lib/helpers/translation';

  let { data } = $props();

  const datenschutzPage = $derived(data['geko-page-datenschutzerklaerung']?.data ?? {});
  const locale = $derived(data.locale);
  const meta = $derived(data['geko-meta']?.data ?? {});

  const pageMeta = $derived(
    buildPageMeta({
      title: `${datenschutzPage.title || t(locale).privacyPolicy} - Geko`,
      pageUrl: $page.url,
      locale
    })
  );
</script>

<PageMeta {...pageMeta} />

<RtlScope {locale}>
<section class="bg-geko-white py-5">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-11 col-sm-11">
        <Breadcrumb
          items={[
            { label: t(locale).home, href: `/${locale}` },
            { label: t(locale).privacyPolicy },
          ]}
        />
        <h1 class="mb-3 mb-lg-5">{datenschutzPage.title || 'Datenschutzerklärung'}</h1>

        {#if datenschutzPage.content}
          <div class="rich-text">
            {@html resolveRichText(datenschutzPage.content)}
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>
</RtlScope>

<!-- Footer -->
<FooterBlock {meta} {locale} />

<!-- Supporters section -->
<SupportersBlock {locale} />
