<script>
  import { formatDate } from '$lib/helpers/formatDate';
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import StrapiImage from '$lib/components/StrapiImage.svelte';
  import NewsletterBlock from '$lib/components/page-blocks/NewsletterBlock.svelte';
  import FooterBlock from '$lib/components/page-blocks/FooterBlock.svelte';

  let { data } = $props();

  const announcement = $derived(data.announcement || {});
  const locale = $derived(data.locale || 'de');
  const meta = $derived(data['geko-meta']?.data ?? {});
</script>

<svelte:head>
  <title>{announcement.title || 'Announcement'} - Geko</title>
</svelte:head>

<section class="announcement-page bg-geko-white">
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-10">
        <!-- Publish Date -->
        {#if announcement.publish_date}
          <h4 class="fst-italic text-muted mb-3">
            {formatDate(announcement.publish_date, locale)}
          </h4>
        {/if}

        <!-- Title -->
        <h2 class="pt-3 mb-4">{announcement.title}</h2>

        <!-- Featured Image -->
        {#if announcement.image}
          <div class="mb-4">
            <StrapiImage
              asset={announcement.image}
              alt={announcement.image.alternativeText || announcement.title}
              class="img-fluid featured-image geko-image-rounded"
            />
          </div>
        {/if}

        <!-- Event Details (if it's an event) -->
        {#if announcement.is_event}
          <div class="event-details mb-4 p-4 bg-light rounded">
            {#if announcement.event_date}
              <div class="mb-2">
                <i class="fas fa-calendar me-2"></i>
                <strong>Datum:</strong> {formatDate(announcement.event_date, locale)}
              </div>
            {/if}
            
            {#if announcement.when_text}
              <div class="mb-2">
                <i class="fas fa-clock me-2"></i>
                <strong>Wann:</strong> {announcement.when_text}
              </div>
            {/if}
            
            {#if announcement.where_address}
              <div class="mb-2">
                <i class="fas fa-map-marker-alt me-2"></i>
                <strong>Wo:</strong> {announcement.where_address}
              </div>
            {/if}
            
            {#if announcement.event_host}
              <div>
                <i class="fas fa-user me-2"></i>
                <strong>Veranstalter:</strong> {announcement.event_host}
              </div>
            {/if}
          </div>
        {/if}

        <!-- Content -->
        {#if announcement.content}
          <div class="announcement-description">
            {@html resolveRichText(announcement.content)}
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>

<NewsletterBlock {locale} />

<FooterBlock {meta} {locale} />

<style>
  .featured-image {
    max-width: 100%;
    height: auto;
  }

  .announcement-description {
    line-height: 1.8;
  }

  .announcement-description :global(img) {
    max-width: 100%;
    height: auto;
    margin: 1.5rem 0;
  }

  .event-details {
    border-left: 4px solid #0d6efd;
  }

  :global(.geko-image-rounded) {
    border-radius: 0.5rem;
  }
</style>




