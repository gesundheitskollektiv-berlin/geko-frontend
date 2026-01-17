<script>
  import NewsItems from '$lib/components/NewsItems.svelte';
  import FooterBlock from '$lib/components/page-blocks/FooterBlock.svelte';
  import SupportersBlock from '$lib/components/page-blocks/SupportersBlock.svelte';
  import { t } from '$lib/helpers/translation';

  let { data } = $props();

  const announcements = $derived(data['geko-announcements']?.data ?? []);
  const locale = $derived(data.locale);
  const meta = $derived(data['geko-meta']?.data ?? {});
  
  // Track visible items count for load more functionality
  let visibleCount = $state(10);
  
  // Get footer and supporters blocks from landing page blocks
  const landingPage = $derived(data['geko-page-landing']?.data ?? {});
  const landingBlocks = $derived(landingPage?.content ?? []);
  const footerBlock = $derived(
    landingBlocks.find(block => block?.__component === 'geko-page-blocks.footer')
  );
  const supportersBlock = $derived(
    landingBlocks.find(block => block?.__component === 'geko-page-blocks.supporters')
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

        <div class="mb-5">
          <NewsItems {announcements} maxAnnouncements={visibleCount} {locale} />
        </div>
        
        {#if announcements.length > visibleCount}
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

<!-- Footer -->
{#if footerBlock}
  <FooterBlock data={footerBlock} {meta} {locale} />
{/if}

<!-- Supporters section -->
{#if supportersBlock}
  <SupportersBlock data={supportersBlock} {locale} />
{/if}
