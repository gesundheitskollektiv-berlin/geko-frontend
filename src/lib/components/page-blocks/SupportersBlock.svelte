<script>
  import StrapiImage from '$lib/components/StrapiImage.svelte';

  export let data = {};
  export let anchor = '';

  const supporters = data?.supporters ?? [];
  $: backgroundClass = data?.background_color ? `bg-geko-${data.background_color}` : 'bg-geko-white';
</script>

<section>
  <div class={`${backgroundClass} footer`}>
		<div class="container" id="supporters">
			<div class="row align-items-center">
				<div class="col-md-12">
					<h4 class="h4 mb-7">Gefördert von:</h4>

					{#if supporters.length}
						<!-- Supporters will be displayed in rows as per original design -->
						<!-- TODO: Implement proper row-based layout matching original -->
						<div class="row mb-7">
							{#each supporters as supporter}
								<div class="col-xs-6 col-md-4">
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
													className="img-fluid no-border-radius supporter-logo"
													alt={supporter.title || 'Supporter Logo'}
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
													className="img-fluid no-border-radius supporter-logo"
													alt={supporter.title || 'Supporter Logo'}
												/>
											{:else}
												<p class="mb-0">{supporter.title}</p>
											{/if}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.supporter-logo {
		max-width: 100%;
		height: auto;
		object-fit: contain;
	}

	.supporter-link {
		display: block;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.supporter-link:hover img {
		filter: grayscale(50%);
		transition: filter 0.15s ease-in-out;
	}

	@media (max-width: 768px) {
		.supporter-logo {
			max-height: 80px !important;
		}
	}
</style>

