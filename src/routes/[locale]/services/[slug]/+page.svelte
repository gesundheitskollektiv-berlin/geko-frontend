<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import StrapiImage from '$lib/components/StrapiImage.svelte';
  import NewsletterBlock from '$lib/components/page-blocks/NewsletterBlock.svelte';
  import FooterBlock from '$lib/components/page-blocks/FooterBlock.svelte';

  let { data } = $props();

  const service = $derived(data.service || {});
  const locale = $derived(data.locale || 'de');
  const meta = $derived(data['geko-meta']?.data ?? {});
</script>

<svelte:head>
  <title>{service.title || 'Service'} - Geko</title>
</svelte:head>

<div>
  <!-- Hero Section with Title, Teaser and Image -->
  <section class="hero-section bg-geko-grey">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-10 col-md-11 col-sm-11">
          <div class="row">
            <div class="col-md-5">
              <h1 class="mb-4">
                {#if service.icon_name}
                  <i class="fas {service.icon_name} service-hero-icon me-3"></i>
                {/if}
                {service.title}
              </h1>
              {#if service.teaser_text}
                <div class="service-content">
                  {@html resolveRichText(service.teaser_text)}
                </div>
              {/if}
            </div>
            {#if service.image}
              <div class="col-md-7 d-flex align-items-center">
                <StrapiImage
                  asset={service.image}
                  alt={service.image.alternativeText || service.title}
                  class="img-fluid geko-image-rounded"
                />
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Description -->
  {#if service.description}
    <section class="bg-geko-white">
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-10 col-md-11 col-sm-11">
            <h3 class="h4 mb-3">Beschreibung</h3>
            <div class="service-content">
              {@html resolveRichText(service.description)}
            </div>
          </div>
        </div>
      </div>
    </section>
  {/if}

  <!-- Languages -->
  {#if service.languages}
    <section class="bg-geko-white">
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-10 col-md-11 col-sm-11">
            <h3 class="h4 mb-3">Sprachen</h3>
            <div class="service-content">
              {@html resolveRichText(service.languages)}
            </div>
          </div>
        </div>
      </div>
    </section>
  {/if}

  <!-- Offer -->
  {#if service.offer}
    <section class="bg-geko-white">
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-10 col-md-11 col-sm-11">
            <h3 class="h4 mb-3">Angebot</h3>
            <div class="service-content">
              {@html resolveRichText(service.offer)}
            </div>
          </div>
        </div>
      </div>
    </section>
  {/if}

  <!-- When -->
  {#if service.when}
    <section class="bg-geko-white">
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-10 col-md-11 col-sm-11">
            <h3 class="h4 mb-3">Wann</h3>
            <div class="service-content">
              {@html resolveRichText(service.when)}
            </div>
          </div>
        </div>
      </div>
    </section>
  {/if}

  <!-- Who -->
  {#if service.who}
    <section class="bg-geko-white">
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-10 col-md-11 col-sm-11">
            <h3 class="h4 mb-3">Für wen</h3>
            <div class="service-content">
              {@html resolveRichText(service.who)}
            </div>
          </div>
        </div>
      </div>
    </section>
  {/if}

  <!-- Where/Address -->
  {#if service.where_address}
    <section class="bg-geko-white">
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-10 col-md-11 col-sm-11">
            <h3 class="h4 mb-3">Wo</h3>
            <p class="mb-4">
              <i class="fas fa-map-marker-alt me-2"></i>
              {service.where_address}
            </p>
            
            <!-- Google Maps Embed -->
            <div class="ratio ratio-16x9">
              <iframe
                src={`https://maps.google.com/maps?width=100%25&height=600&hl=de&q=${encodeURIComponent(service.where_address)}&t=&z=14&ie=UTF8&iwloc=B&output=embed`}
                allowfullscreen
                loading="lazy"
                title="Google Maps - {service.where_address}"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  {/if}

</div>

<NewsletterBlock />

<FooterBlock {meta} {locale} />

<style>
  .service-hero-icon {
    font-size: 2.5rem;
  }

  .service-content {
    line-height: 1.8;
  }

  .service-content :global(img) {
    max-width: 100%;
    height: auto;
    margin: 1.5rem 0;
  }

  :global(.geko-image-rounded) {
    border-radius: 0.5rem;
  }
</style>




