<script>
  let { service = {}, locale = 'de' } = $props();

  const isExternal = $derived(service.external_link_only);
  const linkUrl = $derived(`/${locale}/services/${service.slug || service.documentId || service.id}`);
</script>

<div class="col">
  {#if !isExternal}
    <a
      href={linkUrl}
      class="text-decoration-none"
    >
      <div class="card service-card mb-3 clickable">
        <div class="card-body d-flex align-items-center px-md-3 px-0">
          {#if service.icon_name}
            <i class="fas {service.icon_name} service-icon me-3"></i>
          {/if}
          <p class="service-title my-0">{service.title}</p>
        </div>
      </div>
    </a>
  {:else}
    <div class="card service-card mb-3 non-clickable">
      <div class="card-body d-flex align-items-center px-md-3 px-0">
        {#if service.icon_name}
          <i class="fas {service.icon_name} service-icon me-3"></i>
        {/if}
        <p class="service-title my-0">{service.title}</p>
      </div>
    </div>
  {/if}
</div>

<style>
  .card {
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out;
  }

  .card.clickable:hover {
    transform: translateY(-4px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
    background-color: #ececec;
  }

  .card.non-clickable {
    cursor: default;
    opacity: 0.7;
  }

  .service-icon {
    font-size: 1.5rem;
  }

  .service-title {
    font-size: 1.5rem;
  }
</style>

