<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';

  export let data = {};

  $: backgroundClass = data?.background_color ? `bg-geko-${data.background_color}` : 'bg-geko-white';
</script>

<section id="about" class={backgroundClass}>
  <div class="container">
      <div class="row">
        <div class="col-12">
          <h2>{data.title}</h2>
        </div>
      </div>

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
      <div class="my-5 mt-7"></div>
      <h3 class="h3">Material</h3>
    </div>
</section>
