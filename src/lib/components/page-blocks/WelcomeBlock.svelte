<script>
	import { resolveRichText } from '$lib/helpers/richTextResolver';

	export let data = {};
	export let anchor = '';
	export let backgroundClass = 'bg-white';
</script>

<section class={`landing-block ${backgroundClass}`} id={anchor || undefined}>
	<div class="container">
		<div class="row align-items-center gy-5">
			<div class="col-lg-7">
				{#if data?.title}
					<p class="text-uppercase fw-semibold text-secondary mb-2">{data.title}</p>
				{/if}

				{#if data?.content}
					<div class="rich-text fs-5">
						{@html resolveRichText(data.content)}
					</div>
				{/if}
			</div>
			<div class="col-lg-5 text-center">
				<div class="p-4 rounded-4 bg-white shadow-sm">
					<p class="mb-0 fw-semibold text-uppercase small">Gesundheitskollektiv Berlin e.V.</p>
					<p class="mb-0 text-muted">Gemeinsam Gesundheit gestalten</p>
				</div>
			</div>
		</div>
	</div>
</section>

