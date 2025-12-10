<script>
  import { t } from '$lib/helpers/translation';
  import './calendar.scss';

  let { weekRange = '', locale = 'de', isCurrentWeek = false, onPrevious, onNext, onToday } = $props();
</script>

<div class="calendar-header mt-5 mb-5">
  <div class="row header-content align-items-center">
    <!-- Week date range - left side -->
    <div class="col-auto">
      <h2 class="calendar-title mb-0">
        <i class="fas fa-calendar me-2"></i>{weekRange}
      </h2>
    </div>
    
    <!-- Action buttons - right side -->
    <div class="col-auto ms-auto">
      <div class="d-flex gap-2">
        <button 
          type="button"
          class="btn btn-geko bg-geko-dark-grey text-white"
          onclick={onPrevious}
          aria-label={t(locale).previous}
        >
          <i class="fas fa-backward"></i>
        </button>
        
        <button 
          type="button"
          class="btn btn-geko bg-geko-dark-grey text-white"
          onclick={onToday}
          disabled={isCurrentWeek}
          aria-label={t(locale).today}
        >
          {t(locale).today}
        </button>
        
        <button 
          type="button"
          class="btn btn-geko bg-geko-dark-grey text-white"
          onclick={onNext}
          aria-label={t(locale).next}
        >
          <i class="fas fa-forward"></i>
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .calendar-header {
    font-family: var(--calendar-font-family);
    /* No background color */
  }

  .header-content {
    background-color: var(--calendar-white);
    padding: 0.75rem 1rem;
    box-shadow: var(--calendar-shadow-standard);
    border-radius: 0.5rem 0.5rem 0 0;
  }

  .calendar-title {
    font-family: var(--calendar-font-family);
    font-weight: 700;
    color: var(--calendar-text-dark);
    font-size: 1.5rem;
  }

  @media (max-width: 992px) {
    .calendar-title {
      font-size: 1.5rem;
    }
    
    .calendar-header .btn {
      font-size: 0.875rem;
      padding: 0.25rem 0.5rem;
    }
  }
</style>

