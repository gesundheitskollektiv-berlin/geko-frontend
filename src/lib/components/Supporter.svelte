<script>
	import StrapiImage from '$lib/components/StrapiImage.svelte';

	let { supporter = {} } = $props();

	// Determine column class based on width field
	const columnClass = $derived(
		supporter.width === 'full' ? 'col-12 col-md-12' : 'col-12 col-md-6'
	);
</script>

<div class={`${columnClass} mb-4`}>
	{#if supporter?.project_url}
		<a
			href={supporter.project_url}
			target="_blank"
			rel="noreferrer"
			class="supporter-link d-block text-center"
		>
			{#if supporter?.image}
				<StrapiImage
					asset={supporter.image}
					class="img-fluid no-border-radius supporter-logo"
					alt={supporter.image.alternativeText || supporter.title || 'Supporter Logo'}
				/>
			{:else}
				<p class="mb-0">{supporter.title}</p>
			{/if}
		</a>
	{:else}
		<div class="supporter-link d-block text-center">
			{#if supporter?.image}
				<StrapiImage
					asset={supporter.image}
					class="img-fluid no-border-radius supporter-logo"
					alt={supporter.image.alternativeText || supporter.title || 'Supporter Logo'}
				/>
			{:else}
				<p class="mb-0">{supporter.title}</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	.supporter-logo {
		max-width: 100%;
		height: auto;
		object-fit: contain;
	}

	.supporter-link {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.supporter-link:hover :global(img) {
		filter: grayscale(50%);
		transition: filter 0.15s ease-in-out;
	}

	@media (max-width: 768px) {
		.supporter-logo {
			max-height: 80px !important;
		}
	}
</style>

