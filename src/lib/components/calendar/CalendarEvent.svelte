<script>
  import { formatTime } from '$lib/helpers/calendar';
  import CalendarEventAccordion from './CalendarEventAccordion.svelte';
  import './calendar.scss';

  let { event, locale = 'de', isExpanded = false, onClick } = $props();

  const colorClass = $derived(
    event.color === '#58a9ff' ? 'color-blue' : event.color === '#fff15b' ? 'color-yellow' : 'color-default'
  );
</script>

<div class="event-wrapper">
  <div 
    class="event-item mt-1 {colorClass}" 
    class:expanded={isExpanded}
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
    <div class="event-time fw-semibold text-muted">
      {formatTime(event.start, locale)}
      {#if event.end && new Date(event.end).getTime() - new Date(event.start).getTime() > 60000}
        - {formatTime(event.end, locale)}
      {/if}
    </div>
    <div class="event-title h5 fw-normal">{event.title}</div>
    {#if event.location}
      <div class="event-location text-muted">
        📍 {event.location}
      </div>
    {/if}
  </div>

  <!-- Accordion content -->
  <CalendarEventAccordion {event} {locale} {isExpanded} color={event.color} />
</div>

<style>
  .event-item {
    padding: 0.75rem 1rem;
    background-color: var(--calendar-white);
    cursor: pointer;
    transition: background-color var(--calendar-transition-standard);
    border-left: 8px solid var(--calendar-primary);
  }

  .event-item.color-blue {
    border-left-color: #58a9ff;
  }

  .event-item.color-yellow {
    border-left-color: #fff15b;
  }

  .event-item.color-default {
    border-left-color: var(--calendar-primary);
  }

  .event-item:hover {
    background-color: var(--calendar-bg-light);
  }

  .event-item:focus {
    outline: none;
  }

  .event-item.expanded {
    background-color: var(--calendar-white);
  }

  .event-time {
    margin-bottom: 0.25rem;
  }

  .event-title {
    color: var(--calendar-text-dark);
    margin-bottom: 0.25rem;
  }
</style>

