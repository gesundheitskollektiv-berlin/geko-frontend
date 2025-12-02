<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import { slugify } from '$lib/helpers/landingBlocks';

  export let data = {};

  $: backgroundClass = data?.background_color ? `bg-geko-${data.background_color}` : 'bg-geko-white';
  $: sectionId = data?.navbar_link_title ? slugify(data.navbar_link_title) : 'about';
</script>

<section id={sectionId} class={backgroundClass}>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-7 col-md-10">
          <h2>{data.title}</h2>

          {#if data?.content}
            <div class="rich-text">
              {@html resolveRichText(data.content)}
            </div>
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
