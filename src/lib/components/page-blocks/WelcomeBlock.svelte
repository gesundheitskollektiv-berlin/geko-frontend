<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import { slugify } from '$lib/helpers/landingBlocks';

  export let data = {};

  $: backgroundClass = 'bg-geko-white';
  $: sectionId = data?.navbar_link_title ? slugify(data.navbar_link_title) : 'welcome';
</script>

<section id={sectionId} class={backgroundClass}>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-11 col-sm-11 my-5">
          <h1>{data.title}</h1>

          <div class="row">
            <div class="col-lg-4 d-none d-lg-block"></div>
            {#if data?.content}
              <div class="col-lg-8">
                {@html resolveRichText(data.content)}
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
</section>
