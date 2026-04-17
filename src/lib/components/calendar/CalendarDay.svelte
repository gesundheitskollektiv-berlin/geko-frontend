<script>
  import { formatDate, isSameLocalCalendarDay } from '$lib/helpers/calendar';
  import { t } from '$lib/helpers/translation';
  import CalendarEvent from './CalendarEvent.svelte';
  import './calendar.scss';

  let { date, events = [], locale = 'de', expandedEventId = null, onEventClick, isToday = false } = $props();

  function relativeDayPrefix() {
    const now = new Date();
    if (isSameLocalCalendarDay(date, now)) {
      return t(locale).today;
    }
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    if (isSameLocalCalendarDay(date, tomorrow)) {
      return t(locale).tomorrow;
    }
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (isSameLocalCalendarDay(date, yesterday)) {
      return t(locale).yesterday;
    }
    return '';
  }

  const longDateLine = $derived(
    formatDate(date, locale, { weekday: 'long', day: '2-digit', month: '2-digit' })
  );

  const prefix = $derived(relativeDayPrefix());
</script>

<div class="calendar-day" class:has-events={events.length > 0} class:today={isToday}>
  <div class="day-header text-center">
    <h4 class="day-date mb-0">
      {#if prefix}
        <span class="day-date__prefix">{prefix}.</span>
      {/if}
      <span class="day-date__long">{longDateLine}</span>
    </h4>
  </div>

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
    <div class="no-events">{t(locale).noEvents}</div>
  {/if}
</div>

<style>
  .calendar-day {
    margin-bottom: 0;
  }

  :global(.calendar-day + .calendar-day) {
    margin-top: 0.35rem;
  }

  .day-header {
    background-color: var(--calendar-day-header-bg);
    padding: 0.85rem 1.25rem;
  }

  .day-date {
    font-family: var(--calendar-font-family);
    font-size: 1rem;
    font-weight: 700;
    color: var(--calendar-text-dark);
  }

  .day-date__prefix {
    margin-right: 0.25rem;
  }

  .day-events {
    padding: 0;
    border-left: 1px solid var(--calendar-border-gray);
    border-right: 1px solid var(--calendar-border-gray);
  }

  .no-events {
    font-family: var(--calendar-font-family);
    padding: 0.75rem 1rem;
    text-align: center;
    color: var(--bs-secondary-color, #6c757d);
    font-size: 0.9375rem;
    border-left: 1px solid var(--calendar-border-gray);
    border-right: 1px solid var(--calendar-border-gray);
    border-bottom: 1px solid var(--calendar-border-gray);
  }

  @media (min-width: 992px) {
    .day-date {
      font-size: 1.125rem;
    }
  }
</style>
