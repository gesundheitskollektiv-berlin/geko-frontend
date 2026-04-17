<script>
  import { t } from '$lib/helpers/translation';
  import CalendarWeekList from '$lib/components/calendar/CalendarWeekList.svelte';
  import NewsletterBlock from '$lib/components/page-blocks/NewsletterBlock.svelte';
  import FooterBlock from '$lib/components/page-blocks/FooterBlock.svelte';

  let { data } = $props();

  const locale = $derived(data.locale ?? 'de');
  const events = $derived(data.calendarEvents ?? []);
  const meta = $derived(data['geko-meta']?.data ?? {});
</script>

<svelte:head>
  <title>{t(locale).calendar} – Geko</title>
</svelte:head>

<section class="bg-geko-white py-5">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-11 col-sm-11">
        <div class="text-center mb-4">
          <h1 class="geko-headline-canvas fw-bold mb-0">{t(locale).calendar}</h1>
        </div>
        <CalendarWeekList {events} {locale} showNavigation={true} />
      </div>
    </div>
  </div>
</section>

<NewsletterBlock {locale} />

<FooterBlock {meta} {locale} />
