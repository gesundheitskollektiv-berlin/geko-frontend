<script>
  import { slugify } from '$lib/helpers/landingBlocks';
  import { t } from '$lib/helpers/translation';
  import { isValidHttpUrl } from '$lib/helpers/calendar';
  import CalendarWeekList from '$lib/components/CalendarWeekList.svelte';
  import CalendarEventModal from '$lib/components/CalendarEventModal.svelte';

  let { data = {}, events = [], locale = 'de' } = $props();

  // Modal state
  let selectedEvent = $state(null);
  let isModalOpen = $state(false);

  // Derived reactive values
  const backgroundClass = $derived(data?.background_color ? `bg-geko-${data.background_color}` : 'bg-geko-white');
  const sectionId = $derived(data?.navbar_link_title ? slugify(data.navbar_link_title) : 'calendar');

  // Handle event click
  function handleEventClick(event) {
    const description = event.description || '';
    const firstLine = description.split('\n')[0].trim();

    if (isValidHttpUrl(firstLine)) {
      // Open external URL in new tab
      window.open(firstLine, '_blank');
    } else {
      // Show modal with event details
      selectedEvent = event;
      isModalOpen = true;
    }
  }

  function closeModal() {
    isModalOpen = false;
    selectedEvent = null;
  }
</script>

<section id={sectionId} class={backgroundClass}>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-10 py-5">
        <h2 class="text-center mb-4">{t(locale).calendar}</h2>

        <!-- Calendar week list component -->
        <CalendarWeekList {events} {locale} onEventClick={handleEventClick} />

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

<!-- Event Modal -->
<CalendarEventModal event={selectedEvent} isOpen={isModalOpen} onClose={closeModal} {locale} />

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
