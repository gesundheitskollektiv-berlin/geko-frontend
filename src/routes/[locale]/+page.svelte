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

{#if !landingBlocks.length}
	<section class="landing-block">
		<div class="container py-5">
			<p class="lead mb-0">Es sind noch keine Inhaltsblöcke im CMS hinterlegt.</p>
		</div>
	</section>
{:else}
	{#each landingBlocks as block (block.key)}
		{#if block.type === 'geko-page-blocks.welcome'}
			<WelcomeBlock
				data={block.data}
				anchor={block.anchor}
				backgroundClass={block.backgroundClass}
			/>
		{:else if block.type === 'geko-page-blocks.about'}
			<AboutBlock
				data={block.data}
				anchor={block.anchor}
				backgroundClass={block.backgroundClass}
			/>
		{:else if block.type === 'geko-page-blocks.calendar'}
			<CalendarBlock
				data={block.data}
				events={eventItems}
				anchor={block.anchor}
				backgroundClass={block.backgroundClass}
			/>
		{:else if block.type === 'geko-page-blocks.news'}
			<NewsBlock
				data={block.data}
				announcements={newsItems}
				anchor={block.anchor}
				backgroundClass={block.backgroundClass}
			/>
		{:else if block.type === 'geko-page-blocks.contact'}
			<ContactBlock
				data={block.data}
				meta={meta}
				anchor={block.anchor}
				backgroundClass={block.backgroundClass}
			/>
		{:else if block.type === 'geko-page-blocks.services'}
			<ServicesBlock
				data={block.data}
				services={services}
				anchor={block.anchor}
				backgroundClass={block.backgroundClass}
			/>
		{:else if block.type === 'geko-page-blocks.neighbours'}
			<NeighboursBlock
				data={block.data}
				anchor={block.anchor}
				backgroundClass={block.backgroundClass}
			/>
		{:else if block.type === 'geko-page-blocks.supporters'}
			<SupportersBlock
				data={block.data}
				anchor={block.anchor}
				backgroundClass={block.backgroundClass}
			/>
		{:else if block.type === 'geko-page-blocks.footer'}
			<FooterBlock
				data={block.data}
				meta={meta}
				anchor={block.anchor}
				backgroundClass={block.backgroundClass}
			/>
		{:else}
			<section class={`landing-block ${block.backgroundClass}`} id={block.anchor || undefined}>
				<div class="container">
					<p class="text-muted mb-0">Blocktyp {block.type} ist noch nicht implementiert.</p>
				</div>
			</section>
		{/if}
	{/each}
{/if}
