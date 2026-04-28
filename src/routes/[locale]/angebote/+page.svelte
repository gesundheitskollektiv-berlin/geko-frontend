<script>
  import SubpageContent from '$lib/components/SubpageContent.svelte';
  import ServicesBlock from '$lib/components/page-blocks/ServicesBlock.svelte';
  import NewsletterBlock from '$lib/components/page-blocks/NewsletterBlock.svelte';
  import FooterBlock from '$lib/components/page-blocks/FooterBlock.svelte';
  import SupportersBlock from '$lib/components/page-blocks/SupportersBlock.svelte';
  import Breadcrumb from '$lib/components/Breadcrumb.svelte';
  import { t } from '$lib/helpers/translation';

  let { data } = $props();

  const locale = $derived(data.locale);
  const meta = $derived(data['geko-meta']?.data ?? {});
  const services = $derived(data['geko-services']?.data ?? []);
  const angebotePage = $derived(data['geko-page-angebote']?.data ?? {});

  const landingBlocks = $derived(data['geko-page-landing']?.data?.content ?? []);
  const servicesBlock = $derived(
    landingBlocks.find((block) => block?.__component === 'geko-page-blocks.services')
  );
</script>

<SubpageContent page={angebotePage} showBody={false}>
  {#snippet breadcrumb()}
    <Breadcrumb
      items={[
        { label: t(locale).home, href: `/${locale}` },
        { label: t(locale).atTheCenter },
      ]}
    />
  {/snippet}
</SubpageContent>

<ServicesBlock data={servicesBlock ?? {}} {services} {locale} />

<NewsletterBlock {locale} />

<FooterBlock {meta} {locale} />

<SupportersBlock {locale} />
