<script>
  let { service = {}, locale = 'de' } = $props();

  const isExternal = $derived(service.external_link_only);
  const linkUrl = $derived(
    isExternal 
      ? service.project_url 
      : `/${locale}/services/${service.documentId || service.id}`
  );
</script>

<div class="col">
  {#if service?.project_url || !isExternal}
    <a
      href={linkUrl}
      class="text-decoration-none"
      target={isExternal ? '_blank' : '_self'}
      rel={isExternal ? 'noreferrer' : undefined}
    >
      <div class="card service-card mb-3">
        <div class="card-body d-flex align-items-center px-md-3 px-0">
          {#if service.icon_name}
            <i class="fas {service.icon_name} me-2"></i>
          {/if}
          <p class="sm-fs-ml md-fs-l l-fs-xl my-0">{service.title}</p>
        </div>
      </div>
    </a>
  {:else}
    <div class="card service-card mb-3">
      <div class="card-body d-flex align-items-center px-md-3 px-0">
        {#if service.icon_name}
          <i class="fas {service.icon_name} me-2"></i>
        {/if}
        <p class="sm-fs-ml md-fs-l l-fs-xl my-0">{service.title}</p>
      </div>
    </div>
  {/if}
</div>

