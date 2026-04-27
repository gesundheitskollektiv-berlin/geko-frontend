<script>
  import { formatTime, getCalendarEventExternalUrl } from '$lib/helpers/calendar';
  import { t } from '$lib/helpers/translation';
  import CalendarEventAccordion from './CalendarEventAccordion.svelte';
  import './calendar.scss';

  let { event, locale = 'de', isExpanded = false, onClick } = $props();

  const calendarName = $derived.by(() => {
    const strings = t(locale);
    if (event.feedId === 'gekoCenter') return strings.legendBlueItem;
    if (event.feedId === 'kiez') return strings.legendYellowItem;
    return '';
  });

  const opensExternal = $derived(getCalendarEventExternalUrl(event) !== null);

  function handleKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  }
</script>

<div class="event-wrapper">
  <div
    class="event-item"
    class:expanded={isExpanded}
    onclick={onClick}
    onkeydown={handleKeydown}
    role="button"
    tabindex="0"
  >
    <div class="event-item__main">
      <div class="event-time fw-semibold text-muted">
        {formatTime(event.start, locale)}
        {#if event.end && new Date(event.end).getTime() - new Date(event.start).getTime() > 60000}
          – {formatTime(event.end, locale)}
        {/if}
      </div>
      <div class="event-title">{event.title}</div>
      {#if calendarName}
        <div class="event-location text-muted">
          <i class="fa-solid fa-location-dot me-1" aria-hidden="true"></i>
          {calendarName}
        </div>
      {/if}
    </div>
    <span
      class="event-item__action"
      class:event-item__action--external={opensExternal}
      aria-hidden="true"
    >
      {#if opensExternal}
        <i class="fa-solid fa-arrow-up-right-from-square"></i>
      {:else}
        <i class="fa-solid fa-plus"></i>
      {/if}
    </span>
  </div>

  <CalendarEventAccordion {event} {locale} {isExpanded} />
</div>

<style>
  .event-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 0.85rem;
    padding: 1.1rem 1.15rem 1.1rem 1.35rem;
    background-color: var(--calendar-event-row-bg);
    cursor: pointer;
    transition: background-color var(--calendar-transition-standard);
    border-left: 3px solid var(--calendar-border-gray);
    box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.1);
  }

  .event-item:hover {
    filter: brightness(0.98);
  }

  .event-item:focus {
    outline: 2px solid var(--calendar-primary);
    outline-offset: -2px;
  }

  .event-item.expanded {
    background-color: var(--calendar-event-row-bg);
  }

  .event-item__main {
    flex: 1 1 auto;
    min-width: 0;
    text-align: left;
  }

  .event-item__action {
    flex-shrink: 0;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    background: #000;
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
  }

  .event-item__action--external {
    font-size: 0.78rem;
  }

  .event-time {
    margin-bottom: 0.25rem;
    font-size: 0.875rem;
  }

  .event-title {
    color: var(--calendar-text-dark);
    font-weight: 700;
    font-size: 1.125rem;
    margin-bottom: 0.25rem;
    line-height: 1.25;
  }

  .event-location {
    font-size: 0.875rem;
  }
</style>
