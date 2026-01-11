<script>
  import { slugify } from '$lib/helpers/landingBlocks';
  import ServicesItems from '$lib/components/ServicesItems.svelte';

  export let data = {};
  export let services = [];
  export let locale = 'de';

  // Use geko_services relation from block data if available, otherwise fall back to collection services
  $: effectiveServices = data?.geko_services && data.geko_services.length > 0 
    ? data.geko_services 
    : services;

  $: backgroundClass = data?.background_color ? `bg-geko-${data.background_color}` : 'bg-geko-white';
  $: sectionId = data?.navbar_link_title ? slugify(data.navbar_link_title) : 'services';
</script>

<section id={sectionId} class={backgroundClass}>
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-lg-8 col-md-9 col-sm-11 my-5">
					<h2>{data.title}</h2>

					<div class="card shadow-none border-0">
						<div class={`card-body py-4 px-0 ${backgroundClass}`}>
							<ServicesItems services={effectiveServices} {locale} />
						</div>
					</div>
			</div>
		</div>
	</div>
</section>