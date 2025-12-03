<script>
  import NewsItem from '$lib/components/NewsItem.svelte';
  import { t } from '$lib/helpers/translation';

  let { announcements = [], maxAnnouncements = 0, locale = 'de' } = $props();

  const sortedAnnouncements = $derived(
    [...announcements]
      .sort((a, b) => {
        const dateA = new Date(a.publish_date || a.event_date || 0);
        const dateB = new Date(b.publish_date || b.event_date || 0);
        return dateB - dateA;
      })
      .slice(0, maxAnnouncements || announcements.length)
  );
</script>

<div class="row g-4">
  {#if sortedAnnouncements?.length}
    {#each sortedAnnouncements as item (item.id)}
      <NewsItem {item} {locale} />
    {/each}
  {:else}
    <div class="col-12">
      <div class="alert alert-light border">{t(locale).noAnnouncements}</div>
    </div>
  {/if}
</div>

