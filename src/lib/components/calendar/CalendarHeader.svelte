<script>
  import { t } from '$lib/helpers/translation';
  import './calendar.scss';

  let { weekRange = '', locale = 'de', onPrevious, onNext, onToday } = $props();
</script>

<div class="calendar-header mb-4">
  <div class="d-flex justify-content-between align-items-center">
    <!-- Previous button (left edge) -->
    <button 
      type="button"
      class="btn btn-link nav-button" 
      onclick={onPrevious}
      aria-label={t(locale).previous}
    >
      <i class="fas fa-chevron-left"></i>
    </button>
    
    <!-- Center: Date range + Reset button -->
    <div class="d-flex align-items-center gap-2">
      <h3 class="calendar-title mb-0">{weekRange}</h3>
      <button 
        type="button"
        class="btn btn-link reset-button" 
        onclick={onToday}
        aria-label="Go to current week"
      >
        <i class="fas fa-arrow-rotate-right"></i>
      </button>
    </div>
    
    <!-- Next button (right edge) -->
    <button 
      type="button"
      class="btn btn-link nav-button" 
      onclick={onNext}
      aria-label={t(locale).next}
    >
      <i class="fas fa-chevron-right"></i>
    </button>
  </div>
</div>

<style>
  .calendar-header {
    font-family: var(--calendar-font-family);
    padding: 1rem;
    background-color: var(--calendar-bg-light);
  }

  .calendar-title {
    font-family: var(--calendar-font-family);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--calendar-text-dark);
  }

  .nav-button {
    font-size: 1.5rem;
    color: var(--calendar-text-muted);
    text-decoration: none;
    transition: color var(--calendar-transition-standard);
    padding: 0.5rem;
  }

  .nav-button:hover {
    color: var(--calendar-primary);
    text-decoration: none;
  }

  .nav-button:focus {
    outline: 2px solid var(--calendar-primary);
    outline-offset: 2px;
  }

  .reset-button {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--calendar-text-muted);
    border: 1px solid var(--calendar-border-gray);
    background-color: transparent;
    transition: all var(--calendar-transition-standard);
    text-decoration: none;
  }

  .reset-button:hover {
    color: var(--calendar-primary);
    border-color: var(--calendar-primary);
    text-decoration: none;
  }

  .reset-button i {
    font-size: 0.875rem;
  }

  @media (max-width: 768px) {
    .calendar-header {
      padding: 0.75rem;
    }

    .calendar-title {
      font-size: 1rem;
    }

    .nav-button {
      font-size: 1.25rem;
    }
  }
</style>

