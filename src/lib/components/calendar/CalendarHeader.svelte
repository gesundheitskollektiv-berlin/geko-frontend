<script>
  import { t } from '$lib/helpers/translation';
  import { isSameLocalCalendarDay, isLocalDateBeforeToday } from '$lib/helpers/calendar';
  import './calendar.scss';

  let {
    weekDates = [],
    locale = 'de',
    showNavigation = true,
    onPrevious,
    onNext,
  } = $props();

  const intlLocale = $derived(locale === 'ar' ? 'ar' : locale);

  function weekdayShort(d) {
    return new Intl.DateTimeFormat(intlLocale, { weekday: 'short' }).format(d);
  }

  function dayMonth(d) {
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.`;
  }

  function isTodayCell(d) {
    return isSameLocalCalendarDay(d, new Date());
  }

  function isPastCell(d) {
    return isLocalDateBeforeToday(d);
  }
</script>

<div class="calendar-week-strip">
  {#if showNavigation}
    <button
      type="button"
      class="calendar-week-strip__nav"
      onclick={onPrevious}
      aria-label={t(locale).previous}
    >
      <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
    </button>
  {/if}

  <div class="calendar-week-strip__days" class:calendar-week-strip__days--full={!showNavigation}>
    {#each weekDates as d (d.getTime())}
      {@const todayCell = isTodayCell(d)}
      {@const pastCell = isPastCell(d)}
      <div
        class="calendar-week-strip__cell"
        class:calendar-week-strip__cell--today={todayCell}
        class:calendar-week-strip__cell--past={pastCell && !todayCell}
      >
        <span class="calendar-week-strip__weekday">{weekdayShort(d)}</span>
        <span class="calendar-week-strip__daynum">{dayMonth(d)}</span>
      </div>
    {/each}
  </div>

  {#if showNavigation}
    <button
      type="button"
      class="calendar-week-strip__nav"
      onclick={onNext}
      aria-label={t(locale).next}
    >
      <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
    </button>
  {/if}
</div>

<style>
  .calendar-week-strip {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: center;
    gap: 1rem;
    padding: 0.9rem 1.1rem;
    background: var(--calendar-week-strip-bg);
    border-radius: 0.5rem 0.5rem 0 0;
    box-shadow: 0 2px 4px -2px rgba(0, 0, 0, 0.15);
    font-family: var(--calendar-font-family);
    overflow-x: auto;
  }

  .calendar-week-strip__days {
    display: flex;
    flex: 0 1 auto;
    min-width: 0;
    justify-content: center;
    align-items: stretch;
    gap: clamp(0.5rem, 2.6vw, 0.95rem);
  }

  .calendar-week-strip__days--full {
    flex: 1 1 auto;
  }

  .calendar-week-strip__cell {
    flex: 0 0 auto;
    min-width: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.15rem;
    padding: 0.35rem 0.2rem;
    text-align: center;
    font-weight: 600;
    color: var(--calendar-text-dark);
    line-height: 1.25;
  }

  .calendar-week-strip__cell--past:not(.calendar-week-strip__cell--today) {
    color: var(--bs-secondary-color, #6c757d);
    opacity: 0.85;
  }

  .calendar-week-strip__cell--today {
    background: #000;
    color: #fff;
    border-radius: 999px;
    min-width: 3.4rem;
    min-height: 2.65rem;
    padding: 0.4rem 0.65rem;
    align-self: center;
    justify-content: center;
  }

  .calendar-week-strip__weekday {
    font-size: 0.8125rem;
    text-transform: capitalize;
  }

  .calendar-week-strip__daynum {
    font-size: 1rem;
  }

  .calendar-week-strip__nav {
    flex-shrink: 0;
    width: 2.65rem;
    height: 2.65rem;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: #000;
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    align-self: center;
    transition: opacity var(--calendar-transition-standard);
  }

  .calendar-week-strip__nav:hover:not(:disabled) {
    opacity: 0.85;
  }

  .calendar-week-strip__nav:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

</style>
