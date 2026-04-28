<script>
  import { formatDate, formatDateShort } from '$lib/helpers/formatDate';
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import { t } from '$lib/helpers/translation';
  import StrapiImage from '$lib/components/StrapiImage.svelte';
  import NewsletterBlock from '$lib/components/page-blocks/NewsletterBlock.svelte';
  import FooterBlock from '$lib/components/page-blocks/FooterBlock.svelte';
  import Breadcrumb from '$lib/components/Breadcrumb.svelte';

  let { data } = $props();

  const announcement = $derived(data.announcement || {});
  const locale = $derived(data.locale || 'de');
  const meta = $derived(data['geko-meta']?.data ?? {});

  const tag = $derived(announcement?.geko_announcement_tag);
  const hasImage = $derived(Boolean(announcement?.image));
  const displayDate = $derived(announcement?.publish_date || announcement?.publishedAt);

  const breadcrumbItems = $derived(
    displayDate
      ? [
          { label: t(locale).home, href: `/${locale}` },
          { label: t(locale).announcements, href: `/${locale}/aktuelles` },
          { label: formatDateShort(displayDate, 'de') },
        ]
      : [
          { label: t(locale).home, href: `/${locale}` },
          { label: t(locale).announcements, href: `/${locale}/aktuelles` },
        ]
  );
</script>

<svelte:head>
  <title>{announcement.title || 'Announcement'} - Geko</title>
</svelte:head>

<section class="announcement-page bg-geko-white">
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-11 col-sm-11">
        <Breadcrumb items={breadcrumbItems} />

        {#if hasImage}
          <div class="row g-4 align-items-start mb-5">
            <div class="col-md-7">
              <div class="d-flex align-items-baseline gap-2 text-muted meta-row mb-3">
                {#if displayDate}
                  <time>{formatDateShort(displayDate, 'de')}</time>
                {/if}
                {#if displayDate && tag?.name}
                  <span aria-hidden="true">|</span>
                {/if}
                {#if tag?.name}
                  <span>{tag.name}</span>
                {/if}
              </div>
              <h1 class="mb-0">{announcement.title}</h1>
            </div>
            <div class="col-md-5">
              <StrapiImage
                asset={announcement.image}
                alt={announcement.image.alternativeText || announcement.title}
                class="img-fluid featured-image geko-image-rounded"
              />
            </div>
          </div>
        {:else}
          <div class="mb-5">
            <div class="d-flex align-items-baseline gap-2 text-muted meta-row mb-3">
              {#if displayDate}
                <time>{formatDateShort(displayDate, 'de')}</time>
              {/if}
              {#if displayDate && tag?.name}
                <span aria-hidden="true">|</span>
              {/if}
              {#if tag?.name}
                <span>{tag.name}</span>
              {/if}
            </div>
            <h1 class="mb-0">{announcement.title}</h1>
          </div>
        {/if}

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
  .meta-row {
    font-size: 1.375rem;
  }

  :global(.featured-image) {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
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
