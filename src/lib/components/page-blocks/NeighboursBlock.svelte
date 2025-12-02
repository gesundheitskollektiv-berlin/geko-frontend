<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';

  export let data = {};

  $: backgroundClass = data?.background_color ? `bg-geko-${data.background_color}` : 'bg-geko-white';
</script>

<section id="neighbours" class={backgroundClass}>
	<div class="container">
        <h2>{data.title}</h2>

		{#if data?.content}
			<div class="rich-text">
				{@html resolveRichText(data.content)}
			</div>
		{:else}
			<p class="text-muted">Weitere Informationen folgen in Kürze.</p>
		{/if}
	</div>
</section>

