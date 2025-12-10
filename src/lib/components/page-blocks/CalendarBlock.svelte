<script>
  import { slugify } from '$lib/helpers/landingBlocks';
  import { t } from '$lib/helpers/translation';
  import CalendarWeekList from '$lib/components/calendar/CalendarWeekList.svelte';

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
      </div>
    </div>
  </div>
</section>
