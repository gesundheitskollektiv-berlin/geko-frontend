<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import { slugify } from '$lib/helpers/landingBlocks';

  export let data = {};

  $: backgroundClass = data?.background_color ? `bg-geko-${data.background_color}` : 'bg-geko-white';
  $: sectionId = data?.navbar_link_title ? slugify(data.navbar_link_title) : 'neighbours';
</script>

<section id={sectionId} class={backgroundClass}>
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-lg-7 col-md-10">
					<h2>{data.title}</h2>

					{#if data?.content}
						<div class="rich-text">
							{@html resolveRichText(data.content)}
						</div>
					{:else}
						<p class="text-muted">Weitere Informationen folgen in Kürze.</p>
					{/if}
			</div>
		</div>
	</div>
</section>

