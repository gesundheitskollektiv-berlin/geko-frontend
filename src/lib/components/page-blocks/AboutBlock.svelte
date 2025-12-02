<script>
	import { resolveRichText } from '$lib/helpers/richTextResolver';

	export let data = {};
	export let anchor = '';
	export let backgroundClass = 'bg-white';
</script>

<section class={`landing-block ${backgroundClass}`} id={anchor || undefined}>
	<div class="container">
		{#if data?.title}
			<div class="row mb-4">
				<div class="col-12">
					<h2 class="fw-bold">{data.title}</h2>
				</div>
			</div>
		{/if}

		{#if data?.content}
			<div class="row">
				<div class="col-lg-10">
					<div class="rich-text">
						{@html resolveRichText(data.content)}
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>

