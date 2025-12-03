<script>
  import ServiceItem from '$lib/components/ServiceItem.svelte';

  let { services = [], locale = 'de' } = $props();
</script>

<div class="row row-cols-1">
  {#if services?.length}
    {#each services as service (service.id)}
      <ServiceItem {service} {locale} />
    {/each}
  {:else}
    <div class="col">
      <p class="text-muted">Keine Dienste verfügbar.</p>
    </div>
  {/if}
</div>

