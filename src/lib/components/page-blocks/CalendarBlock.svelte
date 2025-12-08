<script>
  import { slugify } from '$lib/helpers/landingBlocks';
  import { t } from '$lib/helpers/translation';
  import CalendarWeekList from '$lib/components/CalendarWeekList.svelte';

  let { data = {}, events = [], locale = 'de' } = $props();

  // Derived reactive values
  const backgroundClass = $derived(data?.background_color ? `bg-geko-${data.background_color}` : 'bg-geko-white');
  const sectionId = $derived(data?.navbar_link_title ? slugify(data.navbar_link_title) : 'calendar');
</script>

<section id={sectionId} class={backgroundClass}>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-10 my-5">
        <h2 class="mb-4">{data.title || t(locale).calendar}</h2>

        <!-- Calendar week list component -->
        <CalendarWeekList {events} {locale} />

        <!-- Legend -->
        <div id="calendar-legend" class="mt-5">
          <div class="row">
            <div class="col-md-6 mb-3">
              <div class="legend-item d-flex align-items-center">
                <div class="legend-color" style="background-color: #58a9ff;"></div>
                <span class="legend-text">{t(locale).legendBlueItem}</span>
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <div class="legend-item d-flex align-items-center">
                <div class="legend-color" style="background-color: #fff15b;"></div>
                <span class="legend-text">{t(locale).legendYellowItem}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

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

  .legend-text {
    font-size: 1rem;
    color: #495057;
  }
</style>
