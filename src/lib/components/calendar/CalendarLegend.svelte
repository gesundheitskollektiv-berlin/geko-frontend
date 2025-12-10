<script>
  import { t } from '$lib/helpers/translation';
  import './calendar.scss';

  let { locale = 'de' } = $props();
</script>

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

<style>
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
</style>

