<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import { slugify } from '$lib/helpers/landingBlocks';
  import StrapiImage from '$lib/components/StrapiImage.svelte';

  export let data = {};
  export let locale = 'de';

  $: backgroundClass = 'bg-geko-grey';
  $: sectionId = data?.navbar_link_title ? slugify(data.navbar_link_title) : 'about';
</script>

<section id={sectionId} class={backgroundClass}>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-9 col-md-10 col-sm-11 my-5">
        <div class="row">
          <div class="col-md-5">
            <h2>{data.title}</h2>
            {@html resolveRichText(data.content)}
            <div class="mt-4">
              <a class="text-decoration-underline text-geko-black fs-20 fw-bold" href="/{locale}/ueber_uns">
                Mehr über uns
              </a>
            </div>
          </div>
          {#if data?.team_image}
            <div class="col-md-7 d-flex align-items-center">
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
