<script>
  import { slugify } from '$lib/helpers/landingBlocks';
  import { t } from '$lib/helpers/translation';
  import CalendarWeekList from '$lib/components/calendar/CalendarWeekList.svelte';

  let { data = {}, events = [], locale = 'de' } = $props();

  const backgroundClass = 'bg-geko-white';
  const sectionId = $derived(data?.navbar_link_title ? slugify(data.navbar_link_title) : 'calendar');
</script>

<section id={sectionId} class={backgroundClass}>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-11 col-sm-11 my-5">
        <div class="text-center mb-4">
          <h2 class="geko-headline-canvas fw-bold mb-0">{data.title || t(locale).calendar}</h2>
        </div>

        <CalendarWeekList {events} {locale} showNavigation={false} />

        <div class="text-center mt-4">
          <a class="btn-geko bg-geko-yellow text-black" href="/{locale}/veranstaltungen">
            Alle Veranstaltungen ansehen
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
