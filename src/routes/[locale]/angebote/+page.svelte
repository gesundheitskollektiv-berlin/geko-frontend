<script>
  import ServicesBlock from '$lib/components/page-blocks/ServicesBlock.svelte';
  import NewsletterBlock from '$lib/components/page-blocks/NewsletterBlock.svelte';
  import FooterBlock from '$lib/components/page-blocks/FooterBlock.svelte';

  let { data } = $props();

  const locale = $derived(data.locale);
  const meta = $derived(data['geko-meta']?.data ?? {});
  const services = $derived(data['geko-services']?.data ?? []);

  const landingPage = $derived(data['geko-page-landing']?.data ?? {});
  const landingBlocks = $derived(landingPage?.content ?? []);
  const servicesBlock = $derived(
    landingBlocks.find((block) => block?.__component === 'geko-page-blocks.services')
  );
  const footerBlock = $derived(
    landingBlocks.find((block) => block?.__component === 'geko-page-blocks.footer')
  );
</script>

<ServicesBlock data={servicesBlock ?? {}} {services} {locale} />

<NewsletterBlock {locale} />

{#if footerBlock}
  <FooterBlock data={footerBlock} {meta} {locale} />
{/if}
