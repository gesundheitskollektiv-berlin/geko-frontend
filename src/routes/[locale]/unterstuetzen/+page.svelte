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
		display: inline-block;
		border-radius: 25px;
		padding: 0.25rem 1.5rem;
		font-family: "CerebriSansPro", system-ui, sans-serif;
		font-weight: 700;
		font-size: 1.25rem;
		transition: all 0.2s ease-in-out;
		border: none;
		text-align: center;
		text-decoration: none;
		cursor: pointer;
		background-color: #58a9ff;
		color: white;
	}

	.support-content :global(a:hover) {
		opacity: 0.85;
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}
</style>
