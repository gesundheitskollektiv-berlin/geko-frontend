<script>
  import { slugify } from '$lib/helpers/landingBlocks';
  import { t } from '$lib/helpers/translation';
  import CalendarWeekList from '$lib/components/calendar/CalendarWeekList.svelte';

  let { data = {}, events = [], locale = 'de' } = $props();

  const backgroundClass = 'bg-geko-white';
  const sectionId = $derived(data?.navbar_link_title ? slugify(data.navbar_link_title) : 'calendar');
</script>

<!-- <section id={sectionId} class="{backgroundClass} py-5"> -->
<section id={sectionId} class="{backgroundClass} py-5 py-lg-9">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-11 col-sm-11">
        <div class="text-center">
          <h2 class="geko-headline-canvas mb-7">{data.title || t(locale).calendar}</h2>
        </div>

        <CalendarWeekList {events} {locale} showNavigation={false} />

        <div class="text-center mt-5 mt-lg-7">
          <a
            class="btn-geko bg-geko-yellow text-black d-md-none"
            href="/{locale}/veranstaltungen"
          >
            {t(locale).allEvents}
          </a>
          <a
            class="text-decoration-underline text-geko-black fs-20 fw-bold d-none d-md-inline"
            href="/{locale}/veranstaltungen"
          >
            {t(locale).allEvents}
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
