<script>
  import { browser } from '$app/environment';
  import { marked } from 'marked';
  import DOMPurify from 'dompurify';
  import { getWeekStart, getWeekEnd, filterEventsByWeek, groupEventsByDay, formatDate, formatTime, getWeekRangeText, formatDateRange, isValidHttpUrl } from '$lib/helpers/calendar';
  import { t } from '$lib/helpers/translation';

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

  // Parsed description for expanded event
  const parsedDescription = $derived(() => {
    if (!browser || !expandedEventId) return '';
    
    const event = events.find(e => e.uid === expandedEventId);
    if (!event?.description) return '';
    
    try {
      const rawHtml = marked.parse(event.description);
      return DOMPurify.sanitize(rawHtml);
    } catch (error) {
      console.error('Error parsing description:', error);
      return '';
    }
  });

  // Get expanded event
  const expandedEvent = $derived(() => {
    if (!expandedEventId) return null;
    return events.find(e => e.uid === expandedEventId);
  });

  // Google Maps embed URL for expanded event
  const mapUrl = $derived(() => {
    const event = expandedEvent();
    if (!event?.location) return null;
    const encodedLocation = encodeURIComponent(event.location);
    return `https://www.google.com/maps?q=${encodedLocation}&output=embed`;
  });

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
  <div class="calendar-legend mb-4">
    <div class="d-flex justify-content-center gap-4 flex-wrap">
      <div class="legend-item d-flex align-items-center">
        <div class="legend-color bg-geko-blue"></div>
        <span>{t(locale).legendBlueItem}</span>
      </div>
      <div class="legend-item d-flex align-items-center">
        <div class="legend-color bg-geko-yellow"></div>
        <span>{t(locale).legendYellowItem}</span>
      </div>
    </div>
  </div>

  <!-- Header with navigation -->
  <div class="calendar-header mb-4">
    <div class="d-flex justify-content-center align-items-center gap-3">
      <button 
        type="button"
        class="btn btn-link nav-button p-0" 
        onclick={goToPreviousWeek}
        aria-label={t(locale).previous}
      >
        <i class="fas fa-chevron-left"></i>
        <span class="ms-2">{t(locale).previous}</span>
      </button>
      <h3 class="calendar-title mb-0">{weekRange}</h3>
      <button 
        type="button"
        class="btn btn-link nav-button p-0" 
        onclick={goToNextWeek}
        aria-label={t(locale).next}
      >
        <span class="me-2">{t(locale).next}</span>
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>

  <!-- Event list -->
  <div class="calendar-events">
    {#each getWeekDates() as date}
      {@const dateKey = date.toISOString().split('T')[0]}
      {@const dayEvents = groupedEvents[dateKey] || []}
      
      <div class="calendar-day mt-5" class:has-events={dayEvents.length > 0}>
        <!-- Date header -->
        <div class="day-header mb-3">
          <h4 class="day-date">
            {formatDate(date, locale, { weekday: 'long', month: 'long', day: 'numeric' })}
          </h4>
        </div>

        <!-- Events for this day -->
        {#if dayEvents.length > 0}
          <div class="day-events">
              {#each dayEvents as event (event.uid)}
                  <div class="event-wrapper">
                    <div 
                      class="event-item" 
                      class:mb-1={expandedEventId !== event.uid}
                      class:expanded={expandedEventId === event.uid}
                      style="border-left: 8px solid {event.color};"
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

                    <!-- Accordion content -->
                    {#if expandedEventId === event.uid}
                      <div class="event-details-accordion mb-1">
                        <!-- Description -->
                        {#if event.description}
                          <div class="event-detail">
                            <div class="event-description">
                              {@html parsedDescription()}
                            </div>
                          </div>
                        {/if}

                        <!-- Location -->
                        {#if event.location}
                          <div class="event-detail mt-3">
                            <i class="fas fa-house me-2"></i>
                            <span>{event.location}</span>
                          </div>

                          <!-- Google Maps iframe -->
                          {#if mapUrl()}
                            <div class="map-container mt-3">
                              <iframe
                                src={mapUrl()}
                                width="100%"
                                height="300"
                                style="border:0;"
                                allowfullscreen=""
                                loading="lazy"
                                referrerpolicy="no-referrer-when-downgrade"
                                title="Event location map"
                              ></iframe>
                            </div>
                          {/if}
                        {/if}
                      </div>
                    {/if}
                  </div>
                {/each}
          </div>
        {:else}
          <div class="no-events my-0 py-0">
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
    font-family: 'CerebriSansPro', system-ui, sans-serif;
    padding: 1rem;
    background-color: #f8f9fa;
  }

  .calendar-title {
    font-family: 'CerebriSansPro', system-ui, sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #212529;
  }

  .nav-button {
    font-family: 'CerebriSansPro', system-ui, sans-serif;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1;
    color: #6c757d;
    text-decoration: none;
    transition: color 0.2s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-button:hover {
    color: #0d6efd;
    text-decoration: none;
  }

  .nav-button:focus {
    outline: 2px solid #0d6efd;
    outline-offset: 2px;
  }

  .calendar-events {
    overflow: hidden;
  }

  .calendar-day {
    margin-bottom: 1.5rem;
  }

  .day-header {
    background-color: white;
    padding: 1.25rem 1rem 0.75rem 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.8);
    border-radius: 0.5rem 0.5rem 0 0;
  }

  .day-date {
    font-family: 'CerebriSansPro', system-ui, sans-serif;
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
    color: #212529;
  }

  .day-events {
    padding: 0;
  }

  .event-item {
    padding: 0.75rem 1rem;
    background-color: white;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
  }

  .event-item:hover {
    background-color: #f8f9fa;
  }

      .event-item:focus {
        outline: 2px solid #0d6efd;
        outline-offset: -2px;
      }

      .event-item.expanded {
        background-color: #e7f1ff;
      }

      .event-details-accordion {
        padding: 1rem;
        margin: 0 1.5rem;
        background-color: #f8f9fa;
        animation: slideDown 0.2s ease-in-out;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          max-height: 0;
        }
        to {
          opacity: 1;
          max-height: 1000px;
        }
      }

      .event-detail {
        font-family: 'CerebriSansPro', system-ui, sans-serif;
        font-size: 1rem;
        display: flex;
        align-items: flex-start;
      }

      .event-detail i {
        flex-shrink: 0;
        color: #6c757d;
        font-size: 1rem;
        margin-top: 0.25rem;
      }

      .event-detail span,
      .event-detail .event-description {
        flex: 1;
      }

      .event-description {
        line-height: 1.6;
      }

      .event-description :global(p) {
        margin-bottom: 0.75rem;
      }

      .event-description :global(p:last-child) {
        margin-bottom: 0;
      }

      .event-description :global(a) {
        color: #0d6efd;
        text-decoration: underline;
      }

      .event-description :global(a:hover) {
        color: #0a58ca;
      }

      .event-description :global(ul),
      .event-description :global(ol) {
        padding-left: 1.5rem;
        margin-bottom: 0.75rem;
      }

      .event-description :global(li) {
        margin-bottom: 0.25rem;
      }

      .map-container {
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      .map-container iframe {
        display: block;
      }

      .event-time {
    font-family: 'CerebriSansPro', system-ui, sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    color: #6c757d;
    margin-bottom: 0.25rem;
  }

  .event-title {
    font-family: 'CerebriSansPro', system-ui, sans-serif;
    font-size: 1rem;
    font-weight: 600;
    color: #212529;
    margin-bottom: 0.25rem;
  }

  .event-location {
    font-family: 'CerebriSansPro', system-ui, sans-serif;
    font-size: 0.875rem;
  }

  .no-events {
    font-family: 'CerebriSansPro', system-ui, sans-serif;
    padding: 1rem;
    text-align: center;
  }

  .legend-item {
    padding: 0.5rem 0;
  }

  .legend-color {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 0.25rem;
    margin-right: 0.75rem;
    flex-shrink: 0;
  }

  /* Responsive typography - match site standards */
  @media (min-width: 992px) {
    .day-date {
      font-size: 1.3125rem; /* 21px on desktop, matching h4 */
    }
  }

  @media (max-width: 768px) {
    .calendar-header {
      padding: 0.75rem;
    }

    .calendar-title {
      font-size: 1.25rem;
    }

    .nav-button {
      font-size: 0.875rem;
    }

    .nav-button span {
      display: none;
    }

    .nav-button i {
      font-size: 1.25rem;
    }

    .event-details-accordion {
      padding: 0.75rem;
    }

    .map-container iframe {
      height: 250px;
    }
  }
</style>

