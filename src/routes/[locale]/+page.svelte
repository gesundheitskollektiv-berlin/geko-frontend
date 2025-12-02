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
  import { mapLandingBlocks } from '$lib/helpers/landingBlocks';

  export let data;

  $: landingPage = data['geko-page-landing']?.data ?? {};
  $: landingBlocks = mapLandingBlocks(landingPage?.content ?? []);
  $: meta = data['geko-meta']?.data ?? {};
  $: announcements = data['geko-announcements']?.data ?? [];
  $: newsItems = announcements.filter((item) => !item.is_event);
  $: eventItems = announcements.filter((item) => item.is_event);
  $: services = data['geko-services']?.data ?? [];
</script>

{#each landingBlocks as block (block.key)}
  {#if block.type === 'geko-page-blocks.welcome'}
    <WelcomeBlock data={block.data} />
  {:else if block.type === 'geko-page-blocks.about'}
    <AboutBlock data={block.data} />
  {:else if block.type === 'geko-page-blocks.calendar'}
    <CalendarBlock data={block.data} events={eventItems} />
  {:else if block.type === 'geko-page-blocks.news'}
    <NewsBlock data={block.data} announcements={newsItems} />
  {:else if block.type === 'geko-page-blocks.contact'}
    <ContactBlock data={block.data} {meta} />
  {:else if block.type === 'geko-page-blocks.services'}
    <ServicesBlock data={block.data} {services} />
  {:else if block.type === 'geko-page-blocks.neighbours'}
    <NeighboursBlock data={block.data} />
  {:else if block.type === 'geko-page-blocks.supporters'}
    <SupportersBlock data={block.data} />
  {:else if block.type === 'geko-page-blocks.footer'}
    <FooterBlock data={block.data} {meta} />
  {:else}
    {@const backgroundClass = block.data?.background_color ? `bg-geko-${block.data.background_color}` : 'bg-geko-white'}
    <section class={backgroundClass}>
      <div class="container">
        <p class="text-muted mb-0">Blocktyp {block.type} ist noch nicht implementiert.</p>
      </div>
    </section>
  {/if}
{/each}
