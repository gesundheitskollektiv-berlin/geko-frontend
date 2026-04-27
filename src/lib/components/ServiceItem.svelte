<script>
  let { service = {}, locale = 'de' } = $props();

  const isExternal = $derived(service.external_link_only);
  const linkUrl = $derived(
    isExternal && service.project_url
      ? service.project_url
      : `/${locale}/angebote/${service.slug || service.documentId || service.id}`
  );
</script>

{#snippet pillContent()}
  {#if service.icon_name}
    <i class="fa-solid {service.icon_name} service-icon"></i>
  {/if}
  <span class="service-title service-pill-title">{service.title}</span>
  {#if isExternal}
    <i class="fa-solid fa-arrow-up-right-from-square service-external-icon" aria-hidden="true"></i>
  {/if}
{/snippet}

<div class="service-item-wrapper">
  {#if linkUrl}
    <a
      href={linkUrl}
      class="service-pill service-pill--clickable text-decoration-none text-black"
      target={isExternal ? '_blank' : '_self'}
      rel={isExternal ? 'noreferrer noopener' : undefined}
    >
      {@render pillContent()}
    </a>
  {:else}
    <div class="service-pill service-pill--static text-black">
      {@render pillContent()}
    </div>
  {/if}
</div>

<style>
  .service-item-wrapper {
    flex: 0 1 auto;
  }

  .service-pill {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 20px;
    gap: 16px;
    width: fit-content;
    min-height: 60px;
    background: var(--bs-white, #fff);
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.1);
    border-radius: 40px;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  }

  .service-pill--clickable:hover {
    transform: translateY(-2px);
    box-shadow: 4px 6px 12px rgba(0, 0, 0, 0.12);
  }

  .service-pill--static {
    cursor: default;
    opacity: 0.85;
  }

  .service-icon {
    flex-shrink: 0;
    font-size: 1.5rem;
    line-height: 1;
  }

  .service-title {
    flex: 1 1 auto;
    text-align: left;
  }

  .service-external-icon {
    flex-shrink: 0;
    margin-left: auto;
    font-size: 1.125rem;
    line-height: 1;
    opacity: 0.85;
  }
</style>
