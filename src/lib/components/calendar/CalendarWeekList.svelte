<script>
  import {
    getWeekStart,
    filterEventsByWeek,
    groupEventsByDay,
    getVisibleCalendarDates,
    berlinToday,
    addDays,
    dayKey,
    isSameDay,
  } from '$lib/helpers/calendar';
  import { t } from '$lib/helpers/translation';
  import CalendarHeader from './CalendarHeader.svelte';
  import CalendarDay from './CalendarDay.svelte';
  import './calendar.scss';

  let { events = [], locale = 'de', showNavigation = true } = $props();

  let currentWeekStart = $state(getWeekStart(berlinToday()));

  let expandedEventId = $state(null);

  const weekEvents = $derived(filterEventsByWeek(events, currentWeekStart));
  const groupedEvents = $derived(groupEventsByDay(weekEvents));

  const visibleDates = $derived(
    getVisibleCalendarDates(currentWeekStart, groupedEvents, {
      landingFromToday: !showNavigation,
    })
  );

  /** Mon–Sun for the purple week strip (always 7 cells). */
  const stripDates = $derived(
    Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i))
  );

  function goToPreviousWeek() {
    currentWeekStart = addDays(currentWeekStart, -7);
  }

  function goToNextWeek() {
    currentWeekStart = addDays(currentWeekStart, 7);
  }

  function handleEventClick(event) {
    expandedEventId = expandedEventId === event.uid ? null : event.uid;
  }

  function isToday(date) {
    return isSameDay(date, berlinToday());
  }
</script>

<div class="calendar-week-list">
  <CalendarHeader
    weekDates={stripDates}
    {locale}
    {showNavigation}
    onPrevious={goToPreviousWeek}
    onNext={goToNextWeek}
  />

  {#if visibleDates.length === 0}
    <div class="calendar-empty-state">
      <div class="rich-text mb-0 text-muted">{t(locale).noEventsThisWeek}</div>
    </div>
  {:else}
    <div class="calendar-events">
      {#each visibleDates as date (dayKey(date))}
        {@const dateKey = dayKey(date)}
        {@const dayEvents = groupedEvents[dateKey] || []}
        <CalendarDay
          {date}
          events={dayEvents}
          {locale}
          {expandedEventId}
          onEventClick={handleEventClick}
          isToday={isToday(date)}
        />
      {/each}
    </div>
  {/if}
</div>

<style>
  .calendar-week-list {
    width: 100%;
  }

  .calendar-events {
    overflow: hidden;
  }

  .calendar-empty-state {
    padding: 1.5rem 1.25rem;
    text-align: center;
    font-family: var(--calendar-font-family);
    border: 1px solid var(--calendar-border-gray);
    border-top: none;
    border-radius: 0 0 0.5rem 0.5rem;
  }
</style>
