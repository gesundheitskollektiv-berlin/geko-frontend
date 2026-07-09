<script>
  import { formatDate } from '$lib/helpers/formatDate';
  import { t } from '$lib/helpers/translation';
  import StrapiImage from '$lib/components/StrapiImage.svelte';

  let { item = {}, locale = 'de', newsLengthThresh = 150 } = $props();

  /** Arrow points in the reading direction: ← for RTL (Arabic), → otherwise. */
  const forwardArrow = $derived(locale === 'ar' ? '←' : '→');

  const tag = $derived(item?.geko_announcement_tag);
  const eventDate = $derived(item?.is_event ? item?.event_date : null);
  const hasTagOrDate = $derived(Boolean(tag?.name || eventDate));

  /** Word-boundary cut, strip trailing punctuation, then … */
  function truncateAtWord(text, max) {
    if (text == null || text === '') return '';
    const s = typeof text === 'string' ? text : String(text);
    if (s.length <= max) return s;
    const slice = s.slice(0, max);
    const lastSpace = slice.lastIndexOf(' ');
    const cut = lastSpace > 0 ? slice.slice(0, lastSpace) : slice;
    return cut.replace(/[\s.,;:!?\-]+$/, '') + '\u2026';
  }

  const displayTeaser = $derived(truncateAtWord(item?.teaser_text, newsLengthThresh));
</script>

<div class="col-12 col-md-6 col-lg-4">
  <a href="/{locale}/aktuelles/{item.slug}" class="text-decoration-none text-dark">
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
            {#if eventDate}
              <time class="text-end flex-shrink-0">
                {formatDate(eventDate, locale)}
              </time>
            {/if}
          </div>
        {/if}
        <h3 class="h5 mb-2 fw-bold">{item?.title}</h3>
        {#if displayTeaser}
          <p class="rich-text mb-0 flex-grow-1">{displayTeaser}</p>
        {:else}
          <div class="flex-grow-1"></div>
        {/if}
        <div class="mt-auto pt-3 d-flex justify-content-center">
          <span class="btn-geko bg-geko-white text-black">
            {#if locale === 'ar'}
              {forwardArrow} {t(locale).readMore}
            {:else}
              {t(locale).readMore} {forwardArrow}
            {/if}
          </span>
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
