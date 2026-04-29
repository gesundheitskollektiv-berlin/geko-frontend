<script>
  import { slugify } from '$lib/helpers/landingBlocks';
  import { t } from '$lib/helpers/translation';
  import CalendarWeekList from '$lib/components/calendar/CalendarWeekList.svelte';

  let { data = {}, events = [], locale = 'de' } = $props();

  const backgroundClass = 'bg-geko-white';
  const sectionId = $derived(data?.navbar_link_title ? slugify(data.navbar_link_title) : 'calendar');
</script>

<section id={sectionId} class="{backgroundClass} py-5">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-11 col-sm-11">
        <div class="text-center">
          <h2 class="geko-headline-canvas mb-7">{data.title || t(locale).calendar}</h2>
        </div>

        <CalendarWeekList {events} {locale} showNavigation={false} />

        <div class="text-center mt-3 mt-lg-5">
          <a class="btn-geko bg-geko-yellow text-black" href="/{locale}/veranstaltungen">
            {t(locale).allEvents}
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
