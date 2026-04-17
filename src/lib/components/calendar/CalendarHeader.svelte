<script>
  import { t } from '$lib/helpers/translation';
  import { isSameLocalCalendarDay, isLocalDateBeforeToday } from '$lib/helpers/calendar';
  import './calendar.scss';

  let {
    weekDates = [],
    locale = 'de',
    showNavigation = true,
    isCurrentWeek = false,
    onPrevious,
    onNext,
    onToday,
  } = $props();

  const intlLocale = $derived(locale === 'ar' ? 'ar' : locale);

  function weekdayShort(d) {
    return new Intl.DateTimeFormat(intlLocale, { weekday: 'short' }).format(d);
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
        <span class="calendar-week-strip__daynum">{d.getDate()}</span>
      </div>
    {/each}
  </div>

  {#if showNavigation}
    <button
      type="button"
      class="calendar-week-strip__nav calendar-week-strip__nav--today"
      onclick={onToday}
      disabled={isCurrentWeek}
      aria-label={t(locale).today}
    >
      {t(locale).today}
    </button>
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
    gap: 0.5rem;
    padding: 0.7rem 0.85rem;
    background: var(--calendar-week-strip-bg);
    border-radius: 0.5rem 0.5rem 0 0;
    box-shadow: var(--calendar-shadow-sm);
    font-family: var(--calendar-font-family);
    overflow-x: auto;
  }

  .calendar-week-strip__days {
    display: flex;
    flex: 1 1 auto;
    min-width: 0;
    justify-content: center;
    align-items: stretch;
    gap: clamp(0.3rem, 2.2vw, 0.65rem);
  }

  .calendar-week-strip__days--full {
    flex: 1 1 100%;
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
    min-width: 2.65rem;
    min-height: 2.65rem;
    padding: 0.4rem 0.35rem;
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

  .calendar-week-strip__nav--today {
    width: auto;
    min-width: 2.75rem;
    padding: 0 0.65rem;
    border-radius: 1.35rem;
    font-size: 0.8125rem;
    font-weight: 700;
  }

</style>
