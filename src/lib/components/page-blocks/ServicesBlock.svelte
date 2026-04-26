<script>
  import { slugify } from '$lib/helpers/landingBlocks';
  import ServicesItems from '$lib/components/ServicesItems.svelte';

  export let data = {};
  export let services = [];
  export let locale = 'de';

  // Use geko_services relation from block data if available, otherwise fall back to collection services
  $: effectiveServices =
    data?.geko_services && data.geko_services.length > 0 ? data.geko_services : services;

  $: sectionId = data?.navbar_link_title ? slugify(data.navbar_link_title) : 'services';
</script>

<section id={sectionId} class="services-section py-5">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-11 col-sm-11">
        <h2 class="text-center mb-3 mb-lg-5">{data.title}</h2>

        <div class="pt-4">
          <ServicesItems services={effectiveServices} {locale} />
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .services-section {
    background: linear-gradient(
      to bottom,
      var(--bs-geko-yellow) 0%,
      var(--bs-geko-yellow) 78%,
      #ffffff 100%
    );
  }
</style>
