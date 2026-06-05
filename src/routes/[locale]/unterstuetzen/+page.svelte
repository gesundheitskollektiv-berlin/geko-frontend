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
  import { t } from '$lib/helpers/translation';

  let { data } = $props();

  const supportPage = $derived(data['geko-page-support']?.data ?? {});
  const locale = $derived(data.locale);
  const meta = $derived(data['geko-meta']?.data ?? {});

  const pageMeta = $derived(
    buildPageMeta({
      title: `${supportPage.title || t(locale).support} - Geko`,
      description: plainTextFromRichText(supportPage.intro_text),
      pageUrl: $page.url,
      locale
    })
  );
</script>

<PageMeta {...pageMeta} />

<RtlScope {locale}>
  <SubpageContent page={supportPage}>
    {#snippet breadcrumb()}
      <Breadcrumb
        items={[
          { label: t(locale).home, href: `/${locale}` },
          { label: t(locale).support },
        ]}
      />
    {/snippet}
  </SubpageContent>
</RtlScope>

<NewsletterBlock {locale} />

<FooterBlock {meta} {locale} />

<SupportersBlock {locale} />
