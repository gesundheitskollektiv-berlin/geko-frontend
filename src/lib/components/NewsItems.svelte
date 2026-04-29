<script>
  import NewsItem from '$lib/components/NewsItem.svelte';
  import { t } from '$lib/helpers/translation';

  const INITIAL_VISIBLE = 20;
  const PAGE_STEP = 10;

  let {
    announcements = [],
    maxAnnouncements = 0,
    locale = 'de',
    /** Aktuelles: chronological list + internal "load more". Landing: uses maxAnnouncements + highlight pin. */
    enablePagination = false,
  } = $props();

  let visibleCount = $state(INITIAL_VISIBLE);

  const sortByDate = (a, b) => {
    const dateA = new Date(a.publish_date || a.event_date || 0);
    const dateB = new Date(b.publish_date || b.event_date || 0);
    return dateB - dateA;
  };

  const selectedAnnouncements = $derived.by(() => {
    const sorted = [...announcements].sort(sortByDate);

    if (enablePagination) {
      return sorted.slice(0, visibleCount);
    }

    const highlights = sorted.filter((a) => a.highlight).slice(0, 3);
    const highlightIds = new Set(highlights.map((a) => a.id));
    const rest = sorted.filter((a) => !highlightIds.has(a.id));
    const max = maxAnnouncements > 0 ? maxAnnouncements : announcements.length;
    return [...highlights, ...rest].slice(0, max).sort(sortByDate);
  });

  function loadMore() {
    visibleCount += PAGE_STEP;
  }
</script>

<div class="row g-4">
  {#if selectedAnnouncements?.length}
    {#each selectedAnnouncements as item, i (item.documentId ?? item.id ?? item.slug ?? `idx-${i}`)}
      <NewsItem {item} {locale} />
    {/each}
  {:else}
    <div class="col-12">
      <div class="alert alert-light border">{t(locale).noAnnouncements}</div>
    </div>
  {/if}
</div>

{#if enablePagination && announcements.length > visibleCount}
  <div class="text-center mt-4">
    <button type="button" class="btn-geko bg-geko-yellow text-black" onclick={loadMore}>
      {t(locale).loadMore}
    </button>
  </div>
{/if}
