<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import StrapiImage from '$lib/components/StrapiImage.svelte';
  import SupportersBlock from '$lib/components/page-blocks/SupportersBlock.svelte';
  import FooterBlock from '$lib/components/page-blocks/FooterBlock.svelte';

  let { data } = $props();

  const service = $derived(data.service || {});
  const locale = $derived(data.locale || 'de');
  const landingBlocks = $derived(data['geko-page-landing']?.data?.content ?? []);
  const meta = $derived(data['geko-meta']?.data ?? {});

  const supportersBlock = $derived(
    landingBlocks.find(block => block?.__component === 'geko-page-blocks.supporters')
  );
  const footerBlock = $derived(
    landingBlocks.find(block => block?.__component === 'geko-page-blocks.footer')
  );
</script>

<svelte:head>
  <title>{service.title || 'Service'} - Geko</title>
</svelte:head>

<div class="service-page">
  <!-- Back button section -->
  <section style="background-color: #fff;">
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-10 col-md-10">
          <a href="/{locale}" class="btn btn-outline-dark">
            <i class="fas fa-arrow-left me-2"></i>
            Zurück zur Startseite
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Hero Section with Title and Image -->
  <section class="hero-section">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-10 col-md-10">
          <h2 class="pt-3 mb-4">
            {#if service.icon_name}
              <i class="fas {service.icon_name} me-3"></i>
            {/if}
            {service.title}
          </h2>

          {#if service.image}
            <div class="image-container mb-4">
              <StrapiImage
                asset={service.image}
                alt={service.image.alternativeText || service.title}
                class="img-fluid rounded"
              />
            </div>
          {/if}
        </div>
      </div>
    </div>
  </section>

  <!-- Description -->
  {#if service.description}
    <section style="background-color: #fff15b;">
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-10 col-md-10">
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
    <section style="background-color: #fff;">
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-10 col-md-10">
            <h3 class="h4 mb-3">Sprachen</h3>
            <p>{service.languages}</p>
          </div>
        </div>
      </div>
    </section>
  {/if}

  <!-- Offer -->
  {#if service.offer}
    <section style="background-color: #58a9ff;">
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-10 col-md-10">
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
    <section style="background-color: #fff;">
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-10 col-md-10">
            <h3 class="h4 mb-3">Wann</h3>
            <p>{service.when}</p>
          </div>
        </div>
      </div>
    </section>
  {/if}

  <!-- Who -->
  {#if service.who}
    <section style="background-color: #fff;">
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-10 col-md-10">
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
    <section style="background-color: #fff;">
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-10 col-md-10">
            <h3 class="h4 mb-3">Wo</h3>
            <p>
              <i class="fas fa-map-marker-alt me-2"></i>
              {service.where_address}
            </p>
          </div>
        </div>
      </div>
    </section>
  {/if}

  <!-- Footer -->
  {#if footerBlock}
    <FooterBlock data={footerBlock} {meta} {locale} />
  {/if}

  <!-- Supporters -->
  {#if supportersBlock}
    <SupportersBlock data={supportersBlock} {locale} />
  {/if}
</div>

<style>
  .service-page {
    position: relative;
    background: linear-gradient(to bottom, #58a9ff 12%, white 12%);
  }

  .hero-section {
    background-color: transparent;
  }

  .service-content {
    line-height: 1.8;
  }

  .service-content :global(img) {
    max-width: 100%;
    height: auto;
    margin: 1.5rem 0;
  }

  .image-container {
    background-color: white;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .image-container :global(img) {
    border-radius: 0.25rem;
  }
</style>




