<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import { slugify } from '$lib/helpers/landingBlocks';
  import StrapiImage from '$lib/components/StrapiImage.svelte';
  import { t } from '$lib/helpers/translation';

  export let data = {};
  export let locale = 'de';

  $: backgroundClass = 'bg-geko-white';
  $: sectionId = data?.navbar_link_title ? slugify(data.navbar_link_title) : 'about';
</script>

<section id={sectionId} class="{backgroundClass} py-7 pb-9">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-11 col-sm-11">
        <div class="text-center">
          <h2 class="geko-headline-canvas mb-5">{data.title}</h2>
        </div>
        <div class="row align-items-start">
          <div class="col-md-7">
            {@html resolveRichText(data.content)}
            <div class="mt-4">
              <a class="btn-geko bg-geko-yellow text-black" href="/{locale}/ueber_uns">
                {t(locale).aboutUs} ->
              </a>
            </div>
          </div>
          {#if data?.team_image}
            <div class="col-md-5">
              <StrapiImage
                asset={data.team_image}
                alt={data.team_image.alternativeText || 'Team'}
                class="img-fluid geko-image-rounded"
              />
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  :global(.geko-image-rounded) {
    border-radius: 0.5rem;
  }
</style>
