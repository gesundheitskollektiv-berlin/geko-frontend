<script>
  import WelcomeBlock from '$lib/components/page-blocks/WelcomeBlock.svelte';
  import AboutBlock from '$lib/components/page-blocks/AboutBlock.svelte';
  import CalendarBlock from '$lib/components/page-blocks/CalendarBlock.svelte';
  import NewsBlock from '$lib/components/page-blocks/NewsBlock.svelte';
  import ContactBlock from '$lib/components/page-blocks/ContactBlock.svelte';
  import ServicesBlock from '$lib/components/page-blocks/ServicesBlock.svelte';
  import NeighboursBlock from '$lib/components/page-blocks/NeighboursBlock.svelte';
  import SupportersBlock from '$lib/components/page-blocks/SupportersBlock.svelte';
  import FooterBlock from '$lib/components/page-blocks/FooterBlock.svelte';
  export let data;

  $: landingPage = data['geko-page-landing']?.data ?? {};
  $: landingBlocks = landingPage?.content ?? [];
  $: meta = data['geko-meta']?.data ?? {};
  $: announcements = data['geko-announcements']?.data ?? [];
  $: newsItems = announcements.filter((item) => !item.is_event);
  $: eventItems = announcements.filter((item) => item.is_event);
  $: services = data['geko-services']?.data ?? [];
</script>

{#each landingBlocks as block, idx (`${block?.__component ?? 'unknown'}-${block?.id ?? idx}`)}
  {#if block?.__component === 'geko-page-blocks.welcome'}
    <WelcomeBlock data={block} />
  {:else if block?.__component === 'geko-page-blocks.about'}
    <AboutBlock data={block} />
  {:else if block?.__component === 'geko-page-blocks.calendar'}
    <CalendarBlock data={block} events={eventItems} />
  {:else if block?.__component === 'geko-page-blocks.news'}
    <NewsBlock data={block} announcements={newsItems} />
  {:else if block?.__component === 'geko-page-blocks.contact'}
    <ContactBlock data={block} {meta} />
  {:else if block?.__component === 'geko-page-blocks.services'}
    <ServicesBlock data={block} {services} />
  {:else if block?.__component === 'geko-page-blocks.neighbours'}
    <NeighboursBlock data={block} />
  {:else if block?.__component === 'geko-page-blocks.supporters'}
    <SupportersBlock data={block} />
  {:else if block?.__component === 'geko-page-blocks.footer'}
    <FooterBlock data={block} {meta} />
  {:else}
    {@const backgroundClass = block?.background_color ? `bg-geko-${block.background_color}` : 'bg-geko-white'}
    <section class={backgroundClass}>
      <div class="container">
        <p class="text-muted mb-0">Blocktyp {block?.__component} ist noch nicht implementiert.</p>
      </div>
    </section>
  {/if}
{/each}
