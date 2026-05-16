<script>
  import RtlScope from '$lib/components/RtlScope.svelte';
  import NewsItems from '$lib/components/NewsItems.svelte';
  import AnnouncementFilterBar from '$lib/components/AnnouncementFilterBar.svelte';
  import NewsletterBlock from '$lib/components/page-blocks/NewsletterBlock.svelte';
  import FooterBlock from '$lib/components/page-blocks/FooterBlock.svelte';
  import SupportersBlock from '$lib/components/page-blocks/SupportersBlock.svelte';
  import Breadcrumb from '$lib/components/Breadcrumb.svelte';
  import { t } from '$lib/helpers/translation';

  let { data } = $props();

  const announcements = $derived(data['geko-announcements']?.data ?? []);
  const locale = $derived(data.locale);
  const meta = $derived(data['geko-meta']?.data ?? {});
  const newsLengthThresh = $derived(data.newsLengthThresh ?? 150);

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
</script>

<section class="bg-geko-white py-5">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-11 col-sm-11">
        <RtlScope {locale}>
          <Breadcrumb
            items={[
              { label: t(locale).home, href: `/${locale}` },
              { label: t(locale).announcements },
            ]}
          />
          <h1 class="mb-3 mb-lg-5">{t(locale).allAnnouncements}</h1>
        </RtlScope>

        <AnnouncementFilterBar {tags} {locale} bind:selectedTagId />

        <div class="my-5">
          {#key selectedTagId}
            <NewsItems announcements={filteredAnnouncements} {locale} {newsLengthThresh} enablePagination />
          {/key}
        </div>
      </div>
    </div>
  </div>
</section>

<NewsletterBlock {locale} />

<FooterBlock {meta} {locale} />

<SupportersBlock {locale} />
