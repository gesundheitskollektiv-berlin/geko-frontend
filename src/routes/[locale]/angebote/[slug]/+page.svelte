<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import StrapiImage from '$lib/components/StrapiImage.svelte';
  import NewsletterBlock from '$lib/components/page-blocks/NewsletterBlock.svelte';
  import FooterBlock from '$lib/components/page-blocks/FooterBlock.svelte';
  import Breadcrumb from '$lib/components/Breadcrumb.svelte';
  import { t } from '$lib/helpers/translation';

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
          <Breadcrumb
            items={[
              { label: t(locale).home, href: `/${locale}` },
              { label: t(locale).atTheCenter, href: `/${locale}/angebote` },
              { label: service.title },
            ]}
          />
          <!-- Row: icon + headline side-by-side, full width -->
          <div class="d-flex align-items-center gap-3 mb-4">
            {#if service.icon}
              <StrapiImage asset={service.icon} alt="" class="service-hero-icon flex-shrink-0" />
            {/if}
            <h1 class="mb-0">{service.title}</h1>
          </div>

          <!-- Row: teaser + image (or teaser full-width when no image) -->
          {#if service.image}
            <div class="row">
              {#if service.teaser_text}
                <div class="col-md-5">
                  <div class="service-content">
                    {@html resolveRichText(service.teaser_text)}
                  </div>
                </div>
              {/if}
              <div class="col-md-7 d-flex align-items-center">
                <StrapiImage
                  asset={service.image}
                  alt={service.image.alternativeText || service.title}
                  class="img-fluid geko-image-rounded"
                />
              </div>
            </div>
          {:else if service.teaser_text}
            <div class="service-content">
              {@html resolveRichText(service.teaser_text)}
            </div>
          {/if}
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
            <h3 class="h4 mb-3">{t(locale).description}</h3>
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
            <h3 class="h4 mb-3">{t(locale).serviceLanguagesHeading}</h3>
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
            <h3 class="h4 mb-3">{t(locale).serviceOfferHeading}</h3>
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
            <h3 class="h4 mb-3">{t(locale).when}</h3>
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
            <h3 class="h4 mb-3">{t(locale).serviceAudienceHeading}</h3>
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
            <h3 class="h4 mb-3">{t(locale).where}</h3>
            <p class="mb-4">
              <i class="fas fa-map-marker-alt me-2"></i>
              {service.where_address}
            </p>
            
            <!-- Google Maps Embed -->
            <div class="ratio ratio-16x9">
              <iframe
                src={`https://maps.google.com/maps?width=100%25&height=600&hl=${locale}&q=${encodeURIComponent(service.where_address)}&t=&z=14&ie=UTF8&iwloc=B&output=embed`}
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

<NewsletterBlock {locale} />

<FooterBlock {meta} {locale} />

<style>
  :global(img.service-hero-icon) {
    display: inline-block;
    width: 65px;
    height: 65px;
    object-fit: contain;
    vertical-align: middle;
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




