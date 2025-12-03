<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import { slugify } from '$lib/helpers/landingBlocks';

  export let data = {};

  $: backgroundClass = data?.background_color ? `bg-geko-${data.background_color}` : 'bg-geko-white';
  $: sectionId = data?.navbar_link_title ? slugify(data.navbar_link_title) : 'welcome';
</script>

<section id={sectionId} class={backgroundClass}>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-10 my-5">
          <h1>{data.title}</h1>

          <div class="d-flex">
            {#if data?.content}
              <div class="d-inline-block" style="flex: 1">
                {@html resolveRichText(data.content)}
              </div>
            {/if}
            <img
              class="d-none d-lg-inline-block"
              style="flex: 1; transform: scale(0.75);"
              src="/assets/img/Icons/Sprechblasen-neu.svg"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
</section>
