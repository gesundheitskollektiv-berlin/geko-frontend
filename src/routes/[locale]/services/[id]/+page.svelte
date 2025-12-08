<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import StrapiImage from '$lib/components/StrapiImage.svelte';

  let { data } = $props();

  const service = $derived(data.service || {});
  const locale = $derived(data.locale || 'de');
</script>

<svelte:head>
  <title>{service.title || 'Service'} - Geko</title>
</svelte:head>

<section class="service-page bg-geko-white">
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-10">
        <!-- Service Title with Icon -->
        <h2 class="pt-3 mb-4">
          {#if service.icon_name}
            <i class="fas {service.icon_name} me-3"></i>
          {/if}
          {service.title}
        </h2>

        <!-- Service Image -->
        {#if service.image}
          <div class="mb-4">
            <StrapiImage
              asset={service.image}
              alt={service.image.alternativeText || service.title}
              class="img-fluid rounded"
            />
          </div>
        {/if}

        <!-- Description -->
        {#if service.description}
          <div class="service-section mb-4">
            <h3 class="h4 mb-3">Beschreibung</h3>
            <div class="service-content">
              {@html resolveRichText(service.description)}
            </div>
          </div>
        {/if}

        <!-- Languages -->
        {#if service.languages}
          <div class="service-section mb-4">
            <h3 class="h4 mb-3">Sprachen</h3>
            <p>{service.languages}</p>
          </div>
        {/if}

        <!-- Offer -->
        {#if service.offer}
          <div class="service-section mb-4">
            <h3 class="h4 mb-3">Angebot</h3>
            <div class="service-content">
              {@html resolveRichText(service.offer)}
            </div>
          </div>
        {/if}

        <!-- When -->
        {#if service.when}
          <div class="service-section mb-4">
            <h3 class="h4 mb-3">Wann</h3>
            <p>{service.when}</p>
          </div>
        {/if}

        <!-- Who -->
        {#if service.who}
          <div class="service-section mb-4">
            <h3 class="h4 mb-3">Für wen</h3>
            <div class="service-content">
              {@html resolveRichText(service.who)}
            </div>
          </div>
        {/if}

        <!-- Where/Address -->
        {#if service.where_address}
          <div class="service-section mb-4">
            <h3 class="h4 mb-3">Wo</h3>
            <p>
              <i class="fas fa-map-marker-alt me-2"></i>
              {service.where_address}
            </p>
          </div>
        {/if}

        <!-- Back button -->
        <div class="mt-5">
          <a href="/{locale}" class="btn btn-outline-dark">
            <i class="fas fa-arrow-left me-2"></i>
            Zurück zur Startseite
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .service-content {
    line-height: 1.8;
  }

  .service-content :global(img) {
    max-width: 100%;
    height: auto;
    margin: 1.5rem 0;
  }

  .service-section {
    padding: 1.5rem 0;
  }
</style>



