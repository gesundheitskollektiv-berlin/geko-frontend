<script>
  import { formatTime } from '$lib/helpers/calendar';
  import CalendarEventAccordion from './CalendarEventAccordion.svelte';
  import './calendar.scss';

  let { event, locale = 'de', isExpanded = false, onClick } = $props();
</script>

<div class="event-wrapper">
  <div 
    class="event-item" 
    class:mb-1={!isExpanded}
    class:expanded={isExpanded}
    style="border-left: 8px solid {event.color};"
    onclick={onClick}
    role="button"
    tabindex="0"
    onkeydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
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
  <CalendarEventAccordion {event} {locale} {isExpanded} />
</div>

<style>
  .event-item {
    padding: 0.75rem 1rem;
    background-color: var(--calendar-white);
    cursor: pointer;
    transition: background-color var(--calendar-transition-standard);
  }

  .event-item:hover {
    background-color: var(--calendar-bg-light);
  }

  .event-item:focus {
    outline: 2px solid var(--calendar-primary);
    outline-offset: -2px;
  }

  .event-item.expanded {
    background-color: var(--calendar-expanded-bg);
  }

  .event-time {
    font-family: var(--calendar-font-family);
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--calendar-text-muted);
    margin-bottom: 0.25rem;
  }

  .event-title {
    font-family: var(--calendar-font-family);
    font-size: 1rem;
    font-weight: 600;
    color: var(--calendar-text-dark);
    margin-bottom: 0.25rem;
  }

  .event-location {
    font-family: var(--calendar-font-family);
    font-size: 0.875rem;
  }
</style>

