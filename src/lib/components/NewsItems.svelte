<script>
  import NewsItem from '$lib/components/NewsItem.svelte';
  import { t } from '$lib/helpers/translation';

  let { announcements = [], maxAnnouncements = 0, locale = 'de' } = $props();

  const sortByDate = (a, b) => {
    const dateA = new Date(a.publish_date || a.event_date || 0);
    const dateB = new Date(b.publish_date || b.event_date || 0);
    return dateB - dateA;
  };

  const selectedAnnouncements = $derived.by(() => {
    const max = maxAnnouncements || announcements.length;
    const sorted = [...announcements].sort(sortByDate);

    const highlights = sorted.filter(a => a.highlight).slice(0, 3);
    const highlightIds = new Set(highlights.map(a => a.id));

    const rest = sorted.filter(a => !highlightIds.has(a.id));
    const combined = [...highlights, ...rest].slice(0, max);

    return combined.sort(sortByDate);
  });
</script>

<div class="row g-4">
  {#if selectedAnnouncements?.length}
    {#each selectedAnnouncements as item (item.id)}
      <NewsItem {item} {locale} />
    {/each}
  {:else}
    <div class="col-12">
      <div class="alert alert-light border">{t(locale).noAnnouncements}</div>
    </div>
  {/if}
</div>

