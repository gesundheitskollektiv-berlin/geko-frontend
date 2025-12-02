<script>
	import { resolveRichText } from '$lib/helpers/richTextResolver';

	export let data = {};
	export let anchor = '';
	export let backgroundClass = 'bg-white';
</script>

<section id={anchor || undefined}>
	<div class={`py-5 ${backgroundClass}`}>
		<div class="container" id="about-us">
			<div class="row">
				<div class="col-12">
					{#if data?.title}
						<h2 class="pt-3 pt-md-5 pt-lg-9 pb-3">{data.title}</h2>
					{/if}
				</div>
			</div>

			{#if data?.content}
				<div class="rich-text">
					{@html resolveRichText(data.content)}
				</div>
			{/if}

			<!-- Newsletter section - TODO: implement newsletter component -->
			<div class="my-5 mt-7"></div>

			<!-- Job offers section - TODO: implement job offers component -->
			<div class="my-5"></div>
			<h3 id="job-offers" class="h3">Stellenausschreibungen</h3>

			<!-- Materials section - TODO: implement materials component -->
			<div class="my-5 mt-7"></div>
			<h3 class="h3">Material</h3>
		</div>
	</div>
</section>

