<script>
	import { resolveRichText } from '$lib/helpers/richTextResolver';
	import StrapiImage from '$lib/components/StrapiImage.svelte';

	export let data = {};
	export let services = [];
	export let anchor = '';
	export let backgroundClass = 'bg-white';
</script>

<section class={`landing-block ${backgroundClass}`} id={anchor || undefined}>
	<div class="container">
		<div class="row mb-4">
			<div class="col-12">
				{#if data?.title}
					<h2 class="fw-bold mb-2">{data.title}</h2>
				{/if}
				{#if data?.content}
					<p class="text-muted mb-0">
						{@html resolveRichText(data.content)}
					</p>
				{/if}
			</div>
		</div>

		<div class="row g-4">
			{#if services?.length}
				{#each services as service (service.id)}
					<div class="col-md-6 col-lg-4">
						<div class="card h-100 shadow-sm border-0">
							{#if service?.image}
								<StrapiImage asset={service.image} className="card-img-top supporter-logo" />
							{/if}
							<div class="card-body d-flex flex-column">
								<p class="text-uppercase small text-muted mb-2">
									{service?.inhouse ? 'Im GEKO' : 'Partnerangebot'}
								</p>
								<h3 class="h5">{service?.title}</h3>

								{#if service?.description}
									<div class="rich-text small text-muted flex-grow-1">
										{@html resolveRichText(service.description)}
									</div>
								{/if}

								{#if service?.project_url}
									<a
										class="btn btn-outline-dark mt-3"
										href={service.project_url}
										target="_blank"
										rel="noreferrer"
									>
										Mehr erfahren
									</a>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			{:else}
				<div class="col-12">
					<div class="alert alert-light border fw-semibold">Keine Angebote verfügbar.</div>
				</div>
			{/if}
		</div>
	</div>
</section>

