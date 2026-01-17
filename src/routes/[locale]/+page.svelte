<script>
  import WelcomeBlock from '$lib/components/page-blocks/WelcomeBlock.svelte';
  import AboutBlock from '$lib/components/page-blocks/AboutBlock.svelte';
  import JobsBlock from '$lib/components/page-blocks/JobsBlock.svelte';
  import CalendarBlock from '$lib/components/page-blocks/CalendarBlock.svelte';
  import NewsBlock from '$lib/components/page-blocks/NewsBlock.svelte';
  import ContactBlock from '$lib/components/page-blocks/ContactBlock.svelte';
  import ServicesBlock from '$lib/components/page-blocks/ServicesBlock.svelte';
  import NeighboursBlock from '$lib/components/page-blocks/NeighboursBlock.svelte';
  import SupportersBlock from '$lib/components/page-blocks/SupportersBlock.svelte';
  import CTABlock from '$lib/components/page-blocks/CTABlock.svelte';
  import FooterBlock from '$lib/components/page-blocks/FooterBlock.svelte';
  import StrapiImage from '$lib/components/StrapiImage.svelte';
  
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

  // Count CTA blocks for alternating layouts
  const ctaBlocks = $derived(
    landingBlocks.filter(block => block?.__component === 'geko-page-blocks.cta')
  );
  
  // Create a map of block IDs to their CTA index
  const ctaIndexMap = $derived.by(() => {
    const map = new Map();
    let ctaIndex = 0;
    landingBlocks.forEach(block => {
      if (block?.__component === 'geko-page-blocks.cta') {
        const key = `${block?.__component ?? 'unknown'}-${block?.id ?? ctaIndex}`;
        map.set(key, ctaIndex++);
      }
    });
    return map;
  });
</script>

{#if meta?.page_banner}
  <div class="w-100">
    <StrapiImage
      asset={meta.page_banner}
      alt={meta.page_banner.alternativeText || 'Geko Eingang'}
      class="w-100"
      style="display: block;"
    />
  </div>
{/if}

{#each landingBlocks as block, idx (`${block?.__component ?? 'unknown'}-${block?.id ?? idx}`)}
  {#if block?.__component === 'geko-page-blocks.welcome'}
    <WelcomeBlock data={block} />
  {:else if block?.__component === 'geko-page-blocks.about'}
    <AboutBlock data={block} {locale} />
  {:else if block?.__component === 'geko-page-blocks.jobs'}
    <JobsBlock data={block} {jobs} {locale} />
  {:else if block?.__component === 'geko-page-blocks.calendar'}
    <CalendarBlock data={block} events={calendarEvents} {locale} />
  {:else if block?.__component === 'geko-page-blocks.news'}
    <NewsBlock data={block} announcements={announcements} {locale} />
  {:else if block?.__component === 'geko-page-blocks.contact'}
    <ContactBlock data={block} {meta} />
  {:else if block?.__component === 'geko-page-blocks.services'}
    <ServicesBlock data={block} {services} {locale} />
  <!-- {:else if block?.__component === 'geko-page-blocks.neighbours'}
    <NeighboursBlock data={block} /> -->
  {:else if block?.__component === 'geko-page-blocks.supporters'}
    <SupportersBlock data={block} {locale} />
  {:else if block?.__component === 'geko-page-blocks.cta'}
    {@const blockKey = `${block?.__component ?? 'unknown'}-${block?.id ?? idx}`}
    {@const currentCtaIndex = ctaIndexMap.get(blockKey) ?? 0}
    <CTABlock data={block} {locale} index={currentCtaIndex} />
  {:else if block?.__component === 'geko-page-blocks.footer'}
    <FooterBlock data={block} {meta} locale={data.locale} />
  <!-- {:else}
    {@const backgroundClass = block?.background_color ? `bg-geko-${block.background_color}` : 'bg-geko-white'}
    <section class={backgroundClass}>
      <div class="container">
        <p class="text-muted mb-0">Blocktyp {block?.__component} ist noch nicht implementiert.</p>
      </div>
    </section> -->
  {/if}
{/each}
