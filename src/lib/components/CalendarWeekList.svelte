<script>
  import { getWeekStart, getWeekEnd, filterEventsByWeek, groupEventsByDay, formatDate, formatTime, getWeekRangeText } from '$lib/helpers/calendar';
  import { t } from '$lib/helpers/translation';

  let { events = [], locale = 'de', onEventClick } = $props();

  // State for current week
  let currentWeekStart = $state(getWeekStart(new Date()));

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
    if (onEventClick) {
      onEventClick(event);
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
  <!-- Header with navigation -->
  <div class="calendar-header mb-4">
    <div class="d-flex justify-content-between align-items-center">
      <div class="calendar-nav-buttons">
        <button 
          type="button"
          class="btn btn-sm btn-outline-secondary me-2" 
          onclick={goToPreviousWeek}
          aria-label={t(locale).previous}
        >
          ‹ {t(locale).previous}
        </button>
        <button 
          type="button"
          class="btn btn-sm btn-primary me-2" 
          onclick={goToToday}
        >
          {t(locale).today}
        </button>
        <button 
          type="button"
          class="btn btn-sm btn-outline-secondary" 
          onclick={goToNextWeek}
          aria-label={t(locale).next}
        >
          {t(locale).next} ›
        </button>
      </div>
      <h3 class="calendar-title mb-0">{weekRange}</h3>
    </div>
  </div>

  <!-- Event list -->
  <div class="calendar-events">
    {#each getWeekDates() as date}
      {@const dateKey = date.toISOString().split('T')[0]}
      {@const dayEvents = groupedEvents[dateKey] || []}
      
      <div class="calendar-day" class:has-events={dayEvents.length > 0}>
        <!-- Date header -->
        <div class="day-header">
          <h4 class="day-date">
            {formatDate(date, locale, { weekday: 'long', month: 'long', day: 'numeric' })}
          </h4>
        </div>

        <!-- Events for this day -->
        {#if dayEvents.length > 0}
          <div class="day-events">
            {#each dayEvents as event (event.uid)}
              <div 
                class="event-item" 
                style="border-left: 4px solid {event.color};"
                onclick={() => handleEventClick(event)}
                role="button"
                tabindex="0"
                onkeydown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleEventClick(event);
                  }
                }}
              >
                <div class="event-time">
                  {formatTime(event.start, locale)}
                  {#if event.end && new Date(event.end).getTime() - new Date(event.start).getTime() > 60000}
                    - {formatTime(event.end, locale)}
                  {/if}
                </div>
                <div class="event-title">{event.title}</div>
                {#if event.location}
                  <div class="event-location text-muted">
                    📍 {event.location}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        {:else}
          <div class="no-events text-muted fst-italic">
            {t(locale).noEvents || 'No events'}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .calendar-week-list {
    width: 100%;
  }

  .calendar-header {
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 0.375rem;
  }

  .calendar-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #495057;
  }

  .calendar-events {
    border: 1px solid #dee2e6;
    border-radius: 0.375rem;
    overflow: hidden;
  }

  .calendar-day {
    border-bottom: 1px solid #dee2e6;
  }

  .calendar-day:last-child {
    border-bottom: none;
  }

  .day-header {
    background-color: #f8f9fa;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e9ecef;
  }

  .day-date {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    color: #495057;
  }

  .calendar-day.has-events .day-header {
    background-color: #e7f1ff;
  }

  .day-events {
    padding: 0;
  }

  .event-item {
    padding: 0.75rem 1rem;
    background-color: white;
    border-bottom: 1px solid #f1f3f5;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
  }

  .event-item:last-child {
    border-bottom: none;
  }

  .event-item:hover {
    background-color: #f8f9fa;
  }

  .event-item:focus {
    outline: 2px solid #0d6efd;
    outline-offset: -2px;
  }

  .event-time {
    font-size: 0.875rem;
    font-weight: 600;
    color: #6c757d;
    margin-bottom: 0.25rem;
  }

  .event-title {
    font-size: 1rem;
    font-weight: 500;
    color: #212529;
    margin-bottom: 0.25rem;
  }

  .event-location {
    font-size: 0.875rem;
  }

  .no-events {
    padding: 1rem;
    text-align: center;
  }

  @media (max-width: 768px) {
    .calendar-header {
      padding: 0.75rem;
    }

    .calendar-nav-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    .calendar-nav-buttons .btn {
      font-size: 0.875rem;
      padding: 0.25rem 0.5rem;
    }

    .calendar-title {
      font-size: 1rem;
    }

    .day-date {
      font-size: 0.875rem;
    }
  }
</style>

