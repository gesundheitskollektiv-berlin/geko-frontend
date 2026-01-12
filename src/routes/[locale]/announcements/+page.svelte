<script>
  import NewsItems from '$lib/components/NewsItems.svelte';
  import FooterBlock from '$lib/components/page-blocks/FooterBlock.svelte';
  import SupportersBlock from '$lib/components/page-blocks/SupportersBlock.svelte';
  import { t } from '$lib/helpers/translation';

  let { data } = $props();

  const announcements = $derived(data['geko-announcements']?.data ?? []);
  const locale = $derived(data.locale);
  const meta = $derived(data['geko-meta']?.data ?? {});
  
  // Get footer and supporters blocks from landing page blocks
  const landingPage = $derived(data['geko-page-landing']?.data ?? {});
  const landingBlocks = $derived(landingPage?.content ?? []);
  const footerBlock = $derived(
    landingBlocks.find(block => block?.__component === 'geko-page-blocks.footer')
  );
  const supportersBlock = $derived(
    landingBlocks.find(block => block?.__component === 'geko-page-blocks.supporters')
  );
</script>

<section class="bg-geko-yellow">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-9 col-sm-11 my-5">
        <h2 class="pt-3 pt-md-5 pt-lg-9 pb-3">{t(locale).allAnnouncements}</h2>

        <div class="mb-5">
          <NewsItems {announcements} maxAnnouncements={0} {locale} />
        </div>
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
