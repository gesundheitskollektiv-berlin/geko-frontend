<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';

  export let data = {};
  export let anchor = '';
  export let backgroundClass = 'bg-white';
</script>

<section id={anchor || undefined}>
  <div class={`py-5 ${backgroundClass}`}>
    <div class="container" id="welcome">
      {#if data?.title}
        <h1 class="h1">{data.title}</h1>
      {/if}

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
</section>
