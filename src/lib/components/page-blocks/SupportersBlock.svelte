<script>
	import StrapiImage from '$lib/components/StrapiImage.svelte';

	export let data = {};
	export let anchor = '';
	export let backgroundClass = 'bg-white';

	const supporters = data?.supporters ?? [];
</script>

<section class={`landing-block ${backgroundClass}`} id={anchor || undefined}>
	<div class="container">
		<div class="row mb-4">
			<div class="col-12">
				<h2 class="fw-bold">Unterstützt von</h2>
				<p class="text-muted mb-0">
					Wir danken allen Förderern und Partner:innen, die unsere Arbeit möglich machen.
				</p>
			</div>
		</div>

		<div class="row g-4 align-items-center">
			{#if supporters.length}
				{#each supporters as supporter, index}
					<div class="col-6 col-md-3 text-center" id={`supporter-${index}`}>
						{#if supporter?.image}
							<a
								href={supporter?.project_url ?? '#'}
								target="_blank"
								rel="noreferrer"
								class="d-inline-flex justify-content-center align-items-center w-100"
							>
								<StrapiImage asset={supporter.image} className="supporter-logo" />
							</a>
						{:else if supporter?.title}
							<p class="fw-semibold">{supporter.title}</p>
						{/if}
					</div>
				{/each}
			{:else}
				<div class="col-12">
					<div class="alert alert-light border fw-semibold">Noch keine Unterstützer:innen eingetragen.</div>
				</div>
			{/if}
		</div>
	</div>
</section>

