<script>
  import SubpageContent from '$lib/components/SubpageContent.svelte';
  import NewsletterBlock from '$lib/components/page-blocks/NewsletterBlock.svelte';
  import FooterBlock from '$lib/components/page-blocks/FooterBlock.svelte';
  import SupportersBlock from '$lib/components/page-blocks/SupportersBlock.svelte';

  let { data } = $props();

  const supportPage = $derived(data['geko-page-support']?.data ?? {});
  const locale = $derived(data.locale);
  const meta = $derived(data['geko-meta']?.data ?? {});

  const landingBlocks = $derived(data['geko-page-landing']?.data?.content ?? []);
  const supportersBlock = $derived(
    landingBlocks.find((block) => block?.__component === 'geko-page-blocks.supporters')
  );
</script>

<SubpageContent page={supportPage} />

<NewsletterBlock {locale} />

<FooterBlock {meta} {locale} />

{#if supportersBlock}
  <SupportersBlock data={supportersBlock} {locale} />
{/if}
