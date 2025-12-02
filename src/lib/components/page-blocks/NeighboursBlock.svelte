<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';

  export let data = {};
  export let anchor = '';

  $: backgroundClass = data?.background_color ? `bg-geko-${data.background_color}` : 'bg-geko-white';
</script>

<section class={`landing-block ${backgroundClass}`} id={anchor || undefined}>
	<div class="container">
		{#if data?.title}
			<h2 class="fw-bold mb-4">{data.title}</h2>
		{/if}

		{#if data?.content}
			<div class="rich-text">
				{@html resolveRichText(data.content)}
			</div>
		{:else}
			<p class="text-muted">Weitere Informationen folgen in Kürze.</p>
		{/if}
	</div>
</section>

