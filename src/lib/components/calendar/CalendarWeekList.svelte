<script>
  import { getWeekStart, getWeekEnd, filterEventsByWeek, groupEventsByDay, getWeekRangeText, isValidHttpUrl } from '$lib/helpers/calendar';
  import CalendarLegend from './CalendarLegend.svelte';
  import CalendarHeader from './CalendarHeader.svelte';
  import CalendarDay from './CalendarDay.svelte';
  import './calendar.scss';

  let { events = [], locale = 'de' } = $props();

  // State for current week
  let currentWeekStart = $state(getWeekStart(new Date()));
  
  // State for expanded event accordion
  let expandedEventId = $state(null);

  // Derived week events
  const weekEvents = $derived(filterEventsByWeek(events, currentWeekStart));
  const groupedEvents = $derived(groupEventsByDay(weekEvents));
  const weekRange = $derived(getWeekRangeText(currentWeekStart, locale));

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
    // Check if description is just a URL
    const description = event.description || '';
    const firstLine = description.split('\n')[0].trim();

    if (isValidHttpUrl(firstLine)) {
      // Open external URL in new tab
      window.open(firstLine, '_blank');
      return;
    }

    // Toggle accordion
    if (expandedEventId === event.uid) {
      expandedEventId = null; // Close if already open
    } else {
      expandedEventId = event.uid; // Open this one
    }
  }

  // Get all dates for the current week (even if no events)
  function getWeekDates() {
    const dates = [];
    const start = new Date(currentWeekStart);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  }
</script>

<div class="calendar-week-list">
  <!-- Legend -->
  <CalendarLegend {locale} />

  <!-- Header with navigation -->
  <CalendarHeader 
    {weekRange} 
    {locale} 
    onPrevious={goToPreviousWeek}
    onNext={goToNextWeek}
    onToday={goToToday}
  />

  <!-- Event list -->
  <div class="calendar-events">
    {#each getWeekDates() as date}
      {@const dateKey = date.toISOString().split('T')[0]}
      {@const dayEvents = groupedEvents[dateKey] || []}
      
      <CalendarDay 
        {date} 
        events={dayEvents}
        {locale} 
        {expandedEventId}
        onEventClick={handleEventClick}
      />
    {/each}
  </div>
</div>

<style>
  .calendar-week-list {
    width: 100%;
  }

  .calendar-events {
    overflow: hidden;
  }
</style>

