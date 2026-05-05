<script>
  import StrapiImage from '$lib/components/StrapiImage.svelte';

  let { service = {}, locale = 'de' } = $props();

  const isExternal = $derived(service.external_link_only);
  const linkUrl = $derived(
    isExternal && service.project_url
      ? service.project_url
      : `/${locale}/angebote/${service.slug || service.documentId || service.id}`
  );
</script>

{#snippet pillContent()}
  {#if service.icon}
    <StrapiImage asset={service.icon} alt="" class="service-icon" />
  {/if}
  <span class="service-title">{service.title}</span>
  {#if isExternal}
    <i class="fa-solid fa-arrow-up-right-from-square service-external-icon" aria-hidden="true"></i>
  {/if}
{/snippet}

<div class="service-item-wrapper">
  {#if linkUrl}
    <a
      href={linkUrl}
      class="btn-geko bg-white text-black service-pill service-pill--clickable text-decoration-none"
      target={isExternal ? '_blank' : '_self'}
      rel={isExternal ? 'noreferrer noopener' : undefined}
    >
      {@render pillContent()}
    </a>
  {:else}
    <div class="btn-geko bg-white text-black service-pill service-pill--static">
      {@render pillContent()}
    </div>
  {/if}
</div>

<style>
  /* min-width:0 lets flex items shrink below content intrinsic width (avoids horizontal overflow). */
  .service-item-wrapper {
    flex: 0 1 auto;
    min-width: 0;
    max-width: 100%;
  }

  .service-pill.btn-geko {
    box-sizing: border-box;
    justify-content: flex-start;
    width: fit-content;
    max-width: 100%;
    text-align: left;
  }

  .service-pill--static {
    cursor: default;
  }

  :global(img.service-icon) {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  .service-title {
    flex: 1 1 auto;
    min-width: 0;
    text-align: left;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .service-external-icon {
    flex-shrink: 0;
    margin-left: auto;
    font-size: 1.125rem;
    line-height: 1;
  }
</style>
