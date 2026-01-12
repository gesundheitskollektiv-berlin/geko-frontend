<script>
  import { slugify } from '$lib/helpers/landingBlocks';
  import { t } from '$lib/helpers/translation';
  import MaterialDescription from '$lib/components/MaterialDescription.svelte';

  let { data = {}, materials = [], locale = 'de' } = $props();

  const backgroundClass = $derived(data?.background_color ? `bg-geko-${data.background_color}` : 'bg-geko-white');
  const sectionId = $derived(data?.navbar_link_title ? slugify(data.navbar_link_title) : 'materials');
</script>

<section id={sectionId} class={backgroundClass}>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-9 col-sm-11 my-5">
        <h2>{data.title || t(locale).materials}</h2>

        {#if materials.length > 0}
          {#each materials as material (material.id)}
            <MaterialDescription {material} {locale} />
          {/each}
        {/if}
      </div>
    </div>
  </div>
</section>
