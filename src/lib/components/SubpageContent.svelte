<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import StrapiImage from '$lib/components/StrapiImage.svelte';

  let { page, showBody = true, breadcrumb } = $props();

  const hasHeaderImage = $derived(!!page?.header_image);
</script>

<section class="hero-section bg-geko-white">
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-11 col-sm-11">
        {#if breadcrumb}
          {@render breadcrumb()}
        {/if}
        {#if hasHeaderImage}
          <div class="row">
            <div class="col-md-6">
              <h2 class="mb-3">{page.title}</h2>
              {#if page.intro_text}
                <div class="rich-text support-content service-content--teaser">
                  {@html resolveRichText(page.intro_text)}
                </div>
              {/if}
            </div>
            <div class="col-md-6 d-flex align-items-center">
              <StrapiImage
                asset={page.header_image}
                alt={page.header_image?.alternativeText || page.title}
                class="img-fluid geko-image-rounded"
              />
            </div>
          </div>
        {:else}
          <h2 class="mb-3">{page.title}</h2>
          {#if page.intro_text}
            <div class="rich-text support-content service-content--teaser">
              {@html resolveRichText(page.intro_text)}
            </div>
          {/if}
        {/if}
      </div>
    </div>
  </div>
</section>

{#if showBody && page?.body}
  <section class="bg-geko-white">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-10 col-md-11 col-sm-11">
          <div class="rich-text body-content">
            {@html resolveRichText(page.body)}
          </div>
        </div>
      </div>
    </div>
  </section>
{/if}

<style>
  .hero-section {
    position: relative;
    z-index: 1;
    box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.1);
  }

  .support-content :global(a) {
    text-decoration: underline;
    color: #000;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .support-content :global(a:hover) {
    opacity: 0.85;
  }

  .service-content--teaser {
    line-height: 2rem;
  }

  .body-content :global(a) {
    display: inline-flex;
    align-items: center;
    padding: 12px 20px;
    background-color: var(--bs-geko-yellow);
    color: #000;
    border: 2px solid #000;
    border-radius: 28px;
    font-family: "CerebriSansPro", system-ui, sans-serif;
    font-weight: 700;
    font-size: 1.25rem;
    text-decoration: none;
    margin: 0.5rem 0.25rem 0.5rem 0;
    transition: all 0.2s ease-in-out;
  }

  .body-content :global(a:hover) {
    color: #000;
    box-shadow: -5px 5px 15px 0px rgba(0, 0, 0, 0.25);
    text-decoration: none;
  }

  :global(.geko-image-rounded) {
    border-radius: 0.5rem;
  }
</style>
