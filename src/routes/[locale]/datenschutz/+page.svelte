<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import FooterBlock from '$lib/components/page-blocks/FooterBlock.svelte';
  import SupportersBlock from '$lib/components/page-blocks/SupportersBlock.svelte';

  let { data } = $props();

  const datenschutzPage = $derived(data['geko-page-datenschutzerklaerung']?.data ?? {});
  const locale = $derived(data.locale);
  const meta = $derived(data['geko-meta']?.data ?? {});
  
  // Get footer and supporters blocks from landing page blocks
  const landingPage = $derived(data['geko-page-landing']?.data ?? {});
  const landingBlocks = $derived(landingPage?.content ?? []);
  const footerBlock = $derived(
    landingBlocks.find(block => block?.__component === 'geko-page-blocks.footer')
  );
</script>

<section class="bg-geko-white">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-9 col-sm-11 my-5">
        <h1 class="mb-4">{datenschutzPage.title || 'Datenschutzerklärung'}</h1>

        {#if datenschutzPage.content}
          <div class="rich-text">
            {@html resolveRichText(datenschutzPage.content)}
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
<SupportersBlock {locale} />
