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
  <div class="banner-wrapper w-100">
    <StrapiImage
      asset={meta.page_banner}
      alt={meta.page_banner.alternativeText || 'Geko Eingang'}
      class="w-100 landing-banner"
      style="display: block;"
    />
    <span class="banner-overlay-title geko-headline-canvas" aria-hidden="true">Geko</span>
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
  .banner-wrapper {
    position: relative;
    overflow: visible;
  }

  .banner-wrapper + :global(section) {
    padding-top: clamp(4rem, 8vw, 7rem);
  }

  .banner-overlay-title {
    position: absolute;
    bottom: -0.35em;
    left: calc(clamp(1rem, 4vw, 3rem) + 6rem);
    z-index: 2;
    margin: 0;
    padding: 0.05em 0.15em;
    font-size: clamp(3rem, 11vw, 8rem);
    line-height: 1;
    font-weight: 800;
    color: #000;
    pointer-events: none;
    user-select: none;
  }

  :global(.landing-banner) {
    aspect-ratio: 16 / 9;
    min-height: 260px;
    max-height: 460px;
    object-fit: cover;
    object-position: center;
  }

  @media (max-width: 767.98px) {
    :global(.landing-banner) {
      aspect-ratio: 4 / 3;
    }

    .banner-overlay-title {
      left: 0.9em;
      font-size: clamp(4.5rem, 20vw, 7rem);
      bottom: -0.25em;
    }
  }
</style>
