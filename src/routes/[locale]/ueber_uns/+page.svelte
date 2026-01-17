<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import StrapiImage from '$lib/components/StrapiImage.svelte';
  import MaterialsBlock from '$lib/components/page-blocks/MaterialsBlock.svelte';
  import FooterBlock from '$lib/components/page-blocks/FooterBlock.svelte';
  import SupportersBlock from '$lib/components/page-blocks/SupportersBlock.svelte';
  import Newsletter from '$lib/components/Newsletter.svelte';

  let { data } = $props();

  const aboutPage = $derived(data['geko-page-about']?.data ?? {});
  const materials = $derived(data['geko-materials']?.data ?? []);
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

<section class="bg-geko-white">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-9 col-sm-11 my-5">
        <h1 class="mb-4">{aboutPage.title}</h1>

        {#if aboutPage?.team_image}
          <StrapiImage
            asset={aboutPage.team_image}
            alt={aboutPage.team_image.alternativeText || 'Team'}
            class="img-fluid rounded w-100 my-4"
          />
        {/if}

        {#if aboutPage.content}
          <div class="rich-text">
            {@html resolveRichText(aboutPage.content)}
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>

<!-- Materials section -->
{#if materials.length > 0}
  <MaterialsBlock data={{ title: '', background_color: 'yellow' }} {materials} {locale} />
{/if}

<!-- Newsletter section -->
<section id="newsletter" class="bg-geko-blue py-5">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-9 col-sm-11">
        <Newsletter />
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
