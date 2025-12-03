<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import { slugify } from '$lib/helpers/landingBlocks';
  import StrapiImage from '$lib/components/StrapiImage.svelte';

  export let data = {};

  $: backgroundClass = data?.background_color ? `bg-geko-${data.background_color}` : 'bg-geko-white';
  $: sectionId = data?.navbar_link_title ? slugify(data.navbar_link_title) : 'about';
</script>

<section id={sectionId} class={backgroundClass}>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-10 my-5">
          <h2>{data.title}</h2>

          {@html resolveRichText(data.content)}

          {#if data?.team_image}
            <StrapiImage
              asset={data.team_image}
              alt={data.team_image.alternativeText || 'Team'}
              class="img-fluid my-4"
            />
          {/if}

          <!-- Newsletter section - TODO: implement newsletter component -->
          <div class="my-5 mt-7"></div>

          <!-- Job offers section - TODO: implement job offers component -->
          <div class="my-5"></div>
          <h3 id="job-offers" class="h3">Stellenausschreibungen</h3>

          <!-- Materials section - TODO: implement materials component -->
          <h3 class="h3">Material</h3>
          <div class="">
            <p>fooo</p>
          </div>
        </div>
      </div>
    </div>
</section>
