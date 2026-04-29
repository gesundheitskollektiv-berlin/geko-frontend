<script>
  import WelcomeBlock from '$lib/components/page-blocks/WelcomeBlock.svelte';
  import AboutBlock from '$lib/components/page-blocks/AboutBlock.svelte';
  import JobsBlock from '$lib/components/page-blocks/JobsBlock.svelte';
  import CalendarBlock from '$lib/components/page-blocks/CalendarBlock.svelte';
  import NewsBlock from '$lib/components/page-blocks/NewsBlock.svelte';
  import ContactBlock from '$lib/components/page-blocks/ContactBlock.svelte';
  import ServicesBlock from '$lib/components/page-blocks/ServicesBlock.svelte';
  import SupportersBlock from '$lib/components/page-blocks/SupportersBlock.svelte';
  import CTABlock from '$lib/components/page-blocks/CTABlock.svelte';
  import FooterBlock from '$lib/components/page-blocks/FooterBlock.svelte';
  import NewsletterBlock from '$lib/components/page-blocks/NewsletterBlock.svelte';
  import StrapiImage from '$lib/components/StrapiImage.svelte';
  import WelcomeMarquee from '$lib/components/WelcomeMarquee.svelte';
  
  let { data } = $props();

  const landingPage = $derived(data['geko-page-landing']?.data ?? {});
  const landingBlocks = $derived(landingPage?.content ?? []);
  const meta = $derived(data['geko-meta']?.data ?? {});
  const announcements = $derived(data['geko-announcements']?.data ?? []);
  const newsItems = $derived(announcements.filter((item) => !item.is_event));
  const eventItems = $derived(announcements.filter((item) => item.is_event));
  const services = $derived(data['geko-services']?.data ?? []);
  const jobs = $derived(data['geko-jobs']?.data ?? []);
  const calendarEvents = $derived(data.calendarEvents ?? []);
  const locale = $derived(data.locale);

  const blockMap = {
    'geko-page-blocks.welcome':    { component: WelcomeBlock,    getProps: (block) => ({ data: block }) },
    'geko-page-blocks.about':      { component: AboutBlock,      getProps: (block) => ({ data: block, locale }) },
    'geko-page-blocks.jobs':       { component: JobsBlock,       getProps: (block) => ({ data: block, jobs, locale }) },
    'geko-page-blocks.calendar':   { component: CalendarBlock,   getProps: (block) => ({ data: block, events: calendarEvents, locale }) },
    'geko-page-blocks.news':       { component: NewsBlock,       getProps: (block) => ({ data: block, announcements, locale }) },
    'geko-page-blocks.contact':    { component: ContactBlock,    getProps: (block) => ({ data: block, meta }) },
    'geko-page-blocks.services':   { component: ServicesBlock,   getProps: (block) => ({ data: block, services, locale }) },
    'geko-page-blocks.cta':        { component: CTABlock,        getProps: (block) => ({ data: block, locale }) },
  };
</script>

<WelcomeMarquee />

{#if meta?.page_banner}
  <div class="w-100">
    <StrapiImage
      asset={meta.page_banner}
      alt={meta.page_banner.alternativeText || 'Geko Eingang'}
      class="w-100 landing-banner"
      style="display: block;"
    />
  </div>
{/if}

{#each landingBlocks as block, idx (`${block?.__component ?? 'unknown'}-${block?.id ?? idx}`)}
  {@const entry = blockMap[block?.__component]}
  {#if entry}
    <svelte:component this={entry.component} {...entry.getProps(block, idx)} />
  {/if}
{/each}

<NewsletterBlock {locale} />

<FooterBlock {meta} {locale} />

<SupportersBlock {locale} />

<style>
  @media (max-width: 767.98px) {
    :global(.landing-banner) {
      aspect-ratio: 4 / 3;
      object-fit: cover;
      object-position: center;
    }
  }
</style>
