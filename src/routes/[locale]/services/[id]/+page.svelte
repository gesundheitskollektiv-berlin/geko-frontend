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

  // Define section visibility and colors
  const visibleSections = $derived(
    [
      { key: 'languages', visible: !!service.languages },
      { key: 'when', visible: !!service.when },
      { key: 'who', visible: !!service.who },
      { key: 'where_address', visible: !!service.where_address }
    ].filter(s => s.visible)
  );

  // All sections get white background
  const sectionColors = $derived.by(() => {
    const colors = {};
    visibleSections.forEach((section) => {
      colors[section.key] = 'bg-geko-white';
    });
    
    return colors;
  });
</script>

<svelte:head>
  <title>{service.title || 'Service'} - Geko</title>
</svelte:head>

<div class="service-page">
  <!-- Hero Section with Title and Image -->
  <section class="hero-section">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8 col-md-9 col-sm-11">
          <h1 class="mb-4">
            {#if service.icon_name}
              <i class="fas {service.icon_name} me-3"></i>
            {/if}
            {service.title}
          </h1>

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
    <section class="bg-geko-yellow">
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-8 col-md-9 col-sm-11">
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
    <section class={sectionColors.languages}>
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-8 col-md-9 col-sm-11">
            <h3 class="h4 mb-3">Sprachen</h3>
            <p>{service.languages}</p>
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
          <div class="col-lg-8 col-md-9 col-sm-11">
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
    <section class={sectionColors.when}>
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-8 col-md-9 col-sm-11">
            <h3 class="h4 mb-3">Wann</h3>
            <p>{service.when}</p>
          </div>
        </div>
      </div>
    </section>
  {/if}

  <!-- Who -->
  {#if service.who}
    <section class={sectionColors.who}>
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-8 col-md-9 col-sm-11">
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
    <section class={sectionColors.where_address}>
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-8 col-md-9 col-sm-11">
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




