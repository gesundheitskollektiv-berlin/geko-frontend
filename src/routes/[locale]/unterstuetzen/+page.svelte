<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import FooterBlock from '$lib/components/page-blocks/FooterBlock.svelte';
  import SupportersBlock from '$lib/components/page-blocks/SupportersBlock.svelte';

  let { data } = $props();

  const supportPage = $derived(data['geko-page-support']?.data ?? {});
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
        <h2 class="pt-3 pt-md-5 pt-lg-9 pb-3">{supportPage.title}</h2>

        {#if supportPage.text}
          <div class="rich-text support-content">
            {@html resolveRichText(supportPage.text)}
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

<style>
	.support-content :global(a) {
		text-decoration: underline;
		color: #000; /* geko-black */
		font-size: 1.25rem; /* fs-20 */
		font-weight: 700; /* fw-bold */
	}

	.support-content :global(a:hover) {
		opacity: 0.85;
	}
</style>
