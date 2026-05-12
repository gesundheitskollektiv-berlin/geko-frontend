<script>
  import { formatTime, splitCalendarCancellation } from '$lib/helpers/calendar';
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

  const cancellation = $derived(splitCalendarCancellation(event?.description));
  const isCancelled = $derived(cancellation.cancelled);
  const hasDescription = $derived(String(event?.description ?? '').trim().length > 0);
  const hasAccordionContent = $derived(
    hasDescription || String(event?.location ?? '').trim().length > 0
  );

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
    class:event-item--non-interactive={!hasAccordionContent}
    onclick={hasAccordionContent ? onClick : undefined}
    onkeydown={hasAccordionContent ? handleKeydown : undefined}
    role={hasAccordionContent ? 'button' : undefined}
    tabindex={hasAccordionContent ? 0 : undefined}
  >
    <div class="event-item__main">
      <div class="event-time fw-semibold text-muted">
        {formatTime(event.start, locale)}
        {#if event.end && new Date(event.end).getTime() - new Date(event.start).getTime() > 60000}
          – {formatTime(event.end, locale)}
        {/if}
      </div>
      <div class="event-title" class:event-title--cancelled={isCancelled}>{event.title}</div>
      {#if calendarName}
        <div class="event-location text-muted">
          <i class="fa-solid fa-location-dot me-1" aria-hidden="true"></i>
          {calendarName}
        </div>
      {/if}
    </div>
    {#if hasDescription}
      <span
        class="event-item__action"
        class:event-item__action--expanded={isExpanded}
        aria-hidden="true"
      >
        <i class="fa-solid fa-chevron-down event-item__chevron"></i>
      </span>
    {/if}
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
    background-color: var(--calendar-row-hover-bg);
  }

  .event-item--non-interactive {
    cursor: default;
  }

  .event-item--non-interactive:hover {
    background-color: var(--calendar-event-row-bg);
  }

  .event-item:focus:not(.event-item--non-interactive) {
    outline: 2px solid var(--calendar-primary);
    outline-offset: -2px;
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

  .event-item__chevron {
    transition: transform var(--calendar-transition-standard);
  }

  .event-item__action--expanded .event-item__chevron {
    transform: rotate(180deg);
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

  .event-title--cancelled {
    text-decoration: line-through;
  }

  .event-location {
    font-size: 0.875rem;
  }
</style>
