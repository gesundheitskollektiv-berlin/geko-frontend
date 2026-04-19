<script>
  import NewsItems from '$lib/components/NewsItems.svelte';
  import AnnouncementFilterBar from '$lib/components/AnnouncementFilterBar.svelte';
  import NewsletterBlock from '$lib/components/page-blocks/NewsletterBlock.svelte';
  import FooterBlock from '$lib/components/page-blocks/FooterBlock.svelte';
  import SupportersBlock from '$lib/components/page-blocks/SupportersBlock.svelte';
  import { t } from '$lib/helpers/translation';

  let { data } = $props();

  const announcements = $derived(data['geko-announcements']?.data ?? []);
  const locale = $derived(data.locale);
  const meta = $derived(data['geko-meta']?.data ?? {});

  let visibleCount = $state(10);
  let selectedTagId = $state(null);

  const tags = $derived.by(() => {
    const map = new Map();
    for (const a of announcements) {
      const tag = a.geko_announcement_tag;
      if (tag?.id && !map.has(tag.id)) map.set(tag.id, tag);
    }
    return [...map.values()];
  });

  const filteredAnnouncements = $derived(
    selectedTagId === null
      ? announcements
      : announcements.filter((a) => a.geko_announcement_tag?.id === selectedTagId)
  );

  function loadMore() {
    visibleCount += 10;
  }
</script>

<section class="bg-geko-white">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-9 col-sm-11 my-5">
        <h1 class="mb-4">{t(locale).allAnnouncements}</h1>

        <AnnouncementFilterBar {tags} {locale} bind:selectedTagId />

        <div class="mb-5">
          <NewsItems announcements={filteredAnnouncements} maxAnnouncements={visibleCount} {locale} />
        </div>

        {#if filteredAnnouncements.length > visibleCount}
          <div class="row">
            <div class="col-12 text-center">
              <a href="#" class="text-decoration-underline text-geko-black fs-20 fw-bold" onclick={(e) => { e.preventDefault(); loadMore(); }} style="cursor: pointer;">
                Load More
              </a>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>

<NewsletterBlock {locale} />

<FooterBlock {meta} {locale} />

<SupportersBlock {locale} />
