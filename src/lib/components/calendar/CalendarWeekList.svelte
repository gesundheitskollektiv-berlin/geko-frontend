<script>
  import {
    getWeekStart,
    filterEventsByWeek,
    groupEventsByDay,
    getVisibleCalendarDates,
    isValidHttpUrl,
    toLocalDateKey,
  } from '$lib/helpers/calendar';
  import { t } from '$lib/helpers/translation';
  import CalendarHeader from './CalendarHeader.svelte';
  import CalendarDay from './CalendarDay.svelte';
  import './calendar.scss';

  let { events = [], locale = 'de', showNavigation = true } = $props();

  let currentWeekStart = $state(getWeekStart(new Date()));

  let expandedEventId = $state(null);

  const weekEvents = $derived(filterEventsByWeek(events, currentWeekStart));
  const groupedEvents = $derived(groupEventsByDay(weekEvents));

  const visibleDates = $derived(
    getVisibleCalendarDates(currentWeekStart, groupedEvents, {
      landingFromToday: !showNavigation,
    })
  );

  /** Mon–Sun for the purple week strip (always 7 cells). */
  const stripDates = $derived.by(() => {
    const dates = [];
    const start = new Date(currentWeekStart);
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  });

  const isCurrentWeek = $derived.by(() => {
    const todayWeekStart = getWeekStart(new Date());
    return currentWeekStart.getTime() === todayWeekStart.getTime();
  });

  function goToPreviousWeek() {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    currentWeekStart = newDate;
  }

  function goToToday() {
    currentWeekStart = getWeekStart(new Date());
  }

  function goToNextWeek() {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    currentWeekStart = newDate;
  }

  function handleEventClick(event) {
    const description = event.description || '';
    const firstLine = description.split('\n')[0].trim();

    if (isValidHttpUrl(firstLine)) {
      window.open(firstLine, '_blank');
      return;
    }

    if (expandedEventId === event.uid) {
      expandedEventId = null;
    } else {
      expandedEventId = event.uid;
    }
  }

  function isToday(date) {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }
</script>

<div class="calendar-week-list">
  <CalendarHeader
    weekDates={stripDates}
    {locale}
    {showNavigation}
    isCurrentWeek={isCurrentWeek}
    onPrevious={goToPreviousWeek}
    onNext={goToNextWeek}
    onToday={goToToday}
  />

  {#if visibleDates.length === 0}
    <div class="calendar-empty-state">
      <div class="h6 fw-normal mb-0 text-muted">{t(locale).noEventsThisWeek}</div>
    </div>
  {:else}
    <div class="calendar-events">
      {#each visibleDates as date (toLocalDateKey(date))}
        {@const dateKey = toLocalDateKey(date)}
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
