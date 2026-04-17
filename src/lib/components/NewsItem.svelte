<script>
  import { formatDate } from '$lib/helpers/formatDate';
  import StrapiImage from '$lib/components/StrapiImage.svelte';

  let { item = {}, locale = 'de' } = $props();

  const tag = $derived(item?.geko_announcement_tag);
  const hasTagOrDate = $derived(
    Boolean(tag?.name || item?.publish_date || item?.publishedAt)
  );
</script>

<div class="col-md-6 col-lg-4">
  <a href="/{locale}/announcements/{item.slug}" class="text-decoration-none text-dark">
    <div class="card h-100 border news-card" class:highlight={item.highlight}>
      {#if item?.image}
        <StrapiImage
          asset={item.image}
          alt={item.image.alternativeText || item.title}
          class="card-img-top news-card-image"
        />
      {/if}
      <div class="card-body d-flex flex-column bg-geko-light-grey flex-grow-1">
        {#if hasTagOrDate}
          <div class="d-flex justify-content-between align-items-baseline gap-2 small text-muted mb-4">
            <span class="text-start text-truncate">
              {#if tag?.name}
                {tag.name}
              {:else}
                <span class="invisible" aria-hidden="true">&nbsp;</span>
              {/if}
            </span>
            {#if item.publish_date || item.publishedAt}
              <time class="text-end flex-shrink-0">
                {formatDate(item.publish_date || item.publishedAt, locale)}
              </time>
            {/if}
          </div>
        {/if}
        <h3 class="h5 mb-2 fw-bold">{item?.title}</h3>
        {#if item.teaser_text}
          <p class="mb-0 flex-grow-1">{item.teaser_text}</p>
        {:else}
          <div class="flex-grow-1"></div>
        {/if}
        <div class="mt-auto pt-3 d-flex justify-content-center">
          <span class="btn-geko bg-geko-white text-black">Mehr Lesen →</span>
        </div>
      </div>
    </div>
  </a>
</div>

<style>
  .news-card {
    border-radius: 1.75rem;
    overflow: hidden;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  }

  .news-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }

  .news-card.highlight {
    border-top: 3px solid var(--bs-geko-blue);
  }

  :global(.news-card-image) {
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }
</style>
