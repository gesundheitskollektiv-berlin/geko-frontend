<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import { slugify } from '$lib/helpers/landingBlocks';

  export let data = {};

  $: backgroundClass = 'bg-geko-grey';
  $: sectionId = data?.navbar_link_title ? slugify(data.navbar_link_title) : 'welcome';
</script>

<section id={sectionId} class={backgroundClass}>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-9 col-sm-11 my-5">
          <h1>{data.title}</h1>

          <div class="row">
            {#if data?.content}
              <div class="col-lg-8">
                {@html resolveRichText(data.content)}
              </div>
            {/if}
            <div class="col-lg-4 d-none d-lg-block">
              <img
                src="/assets/img/Icons/Sprechblasen-neu.svg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
</section>
