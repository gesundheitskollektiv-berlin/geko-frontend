<script>
  import ServiceItem from '$lib/components/ServiceItem.svelte';

  // Tweakable: titles with this many characters or more get their own row.
  // Reference char counts for current services:
  //   Therapie 8, Beratung 8, Café Praxis 11, Sport und Spiel im Kiez 23,
  //   Nachbarschafts-Projekte 23, Kindermedizinische Praxis 25,
  //   Mobile Gesundheitsberatung 25, Allgemeinmedizinische Praxis 28,
  //   Gesundheitsprogramm NAVIGATION 30.
  const LONG_TITLE_THRESHOLD = 30;

  let { services = [], locale = 'de' } = $props();

  function isLong(service) {
    return (service?.title?.length ?? 0) >= LONG_TITLE_THRESHOLD;
  }

  function buildRows(items) {
    const used = new Array(items.length).fill(false);
    const rows = [];
    for (let i = 0; i < items.length; i++) {
      if (used[i]) continue;
      if (isLong(items[i])) {
        rows.push([items[i]]);
        used[i] = true;
        continue;
      }
      let partnerIdx = -1;
      for (let j = i + 1; j < items.length; j++) {
        if (used[j] || isLong(items[j])) continue;
        partnerIdx = j;
        break;
      }
      if (partnerIdx === -1) {
        rows.push([items[i]]);
      } else {
        rows.push([items[i], items[partnerIdx]]);
        used[partnerIdx] = true;
      }
      used[i] = true;
    }
    return rows;
  }

  let rows = $derived(buildRows(services ?? []));
</script>

{#if services?.length}
  <div class="services-cloud">
    {#each rows as row, rowIdx (rowIdx)}
      <div class="services-row">
        {#each row as service (service.documentId ?? service.id)}
          <ServiceItem {service} {locale} />
        {/each}
      </div>
    {/each}
  </div>
{:else}
  <p class="text-muted">Keine Dienste verfügbar.</p>
{/if}

<style>
  .services-cloud {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
  }
  .services-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: stretch;
    gap: 20px 24px;
  }

  @media (max-width: 767.98px) {
    .services-row {
      flex-direction: column;
      gap: 20px;
    }
  }
</style>
