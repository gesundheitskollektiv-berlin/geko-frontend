<script>
  import ServiceItem from '$lib/components/ServiceItem.svelte';

  let { services = [], locale = 'de' } = $props();
</script>

<div class="services-items-cloud">
  {#if services?.length}
    {#each services as service (service.documentId ?? service.id)}
      <ServiceItem {service} {locale} />
    {/each}
  {:else}
    <p class="text-muted">Keine Dienste verfügbar.</p>
  {/if}
</div>

<style>
  .services-items-cloud {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    gap: 20px 24px;
  }
</style>
