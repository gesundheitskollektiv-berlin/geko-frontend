<script>
  import { formatDate } from '$lib/helpers/calendar';
  import { t } from '$lib/helpers/translation';
  import CalendarEvent from './CalendarEvent.svelte';
  import './calendar.scss';

  let { date, events = [], locale = 'de', expandedEventId = null, onEventClick } = $props();
</script>

<div class="calendar-day mt-5" class:has-events={events.length > 0}>
  <!-- Date header -->
  <div class="day-header mb-3">
    <h4 class="day-date">
      {formatDate(date, locale, { weekday: 'long', month: 'long', day: 'numeric' })}
    </h4>
  </div>

  <!-- Events for this day -->
  {#if events.length > 0}
    <div class="day-events">
      {#each events as event (event.uid)}
        <CalendarEvent 
          {event} 
          {locale} 
          isExpanded={expandedEventId === event.uid}
          onClick={() => onEventClick(event)}
        />
      {/each}
    </div>
  {:else}
    <div class="no-events my-0 py-0">
      {t(locale).noEvents || 'No events'}
    </div>
  {/if}
</div>

<style>
  .calendar-day {
    margin-bottom: 1.5rem;
  }

  .day-header {
    background-color: var(--calendar-white);
    padding: 1.25rem 1rem 0.75rem 1rem;
    box-shadow: var(--calendar-shadow-standard);
    border-radius: 0.5rem 0.5rem 0 0;
  }

  .day-date {
    font-family: var(--calendar-font-family);
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
    color: var(--calendar-text-dark);
  }

  .day-events {
    padding: 0;
  }

  .no-events {
    font-family: var(--calendar-font-family);
    padding: 1rem;
    text-align: center;
  }

  /* Responsive typography - match site standards */
  @media (min-width: 992px) {
    .day-date {
      font-size: 1.3125rem; /* 21px on desktop, matching h4 */
    }
  }
</style>

