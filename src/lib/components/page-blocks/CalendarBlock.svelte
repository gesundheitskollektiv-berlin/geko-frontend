<script>
  import { slugify } from '$lib/helpers/landingBlocks';
  import { t } from '$lib/helpers/translation';
  import { isValidHttpUrl } from '$lib/helpers/calendar';
  import CalendarDay from '$lib/components/calendar/CalendarDay.svelte';

  let { data = {}, events = [], locale = 'de' } = $props();

  const backgroundClass = 'bg-geko-white';
  const sectionId = $derived(data?.navbar_link_title ? slugify(data.navbar_link_title) : 'calendar');

  const today = new Date();

  const todayEvents = $derived(
    events
      .filter(event => {
        if (!event.start) return false;
        const d = new Date(event.start);
        return d.getDate() === today.getDate()
          && d.getMonth() === today.getMonth()
          && d.getFullYear() === today.getFullYear();
      })
      .sort((a, b) => new Date(a.start) - new Date(b.start))
  );

  let expandedEventId = $state(null);

  function handleEventClick(event) {
    const firstLine = (event.description || '').split('\n')[0].trim();
    if (isValidHttpUrl(firstLine)) {
      window.open(firstLine, '_blank');
      return;
    }
    expandedEventId = expandedEventId === event.uid ? null : event.uid;
  }
</script>

<section id={sectionId} class={backgroundClass}>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-9 col-sm-11 my-5">
        <h2 class="mb-4">{data.title || t(locale).calendar}</h2>

        {#if todayEvents.length > 0}
          <CalendarDay
            date={today}
            events={todayEvents}
            {locale}
            {expandedEventId}
            onEventClick={handleEventClick}
            isToday={true}
          />
        {:else}
          <p class="text-muted">{t(locale).noEvents}</p>
        {/if}

        <div class="text-center mt-4">
          <a class="btn-geko bg-geko-blue text-white" href="/{locale}/veranstaltungen">
            Alle Veranstaltungen ansehen
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
