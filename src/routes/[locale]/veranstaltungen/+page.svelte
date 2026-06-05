<script>
  import { page } from '$app/stores';
  import { buildPageMeta } from '$lib/helpers/pageMeta';
  import PageMeta from '$lib/components/PageMeta.svelte';
  import RtlScope from '$lib/components/RtlScope.svelte';
  import { t } from '$lib/helpers/translation';
  import CalendarWeekList from '$lib/components/calendar/CalendarWeekList.svelte';
  import NewsletterBlock from '$lib/components/page-blocks/NewsletterBlock.svelte';
  import FooterBlock from '$lib/components/page-blocks/FooterBlock.svelte';
  import SupportersBlock from '$lib/components/page-blocks/SupportersBlock.svelte';
  import Breadcrumb from '$lib/components/Breadcrumb.svelte';

  let { data } = $props();

  const locale = $derived(data.locale ?? 'de');
  const events = $derived(data.calendarEvents ?? []);
  const meta = $derived(data['geko-meta']?.data ?? {});

  const pageMeta = $derived(
    buildPageMeta({
      title: `${t(locale).calendar} - Geko`,
      description: t(locale).footerTagline,
      pageUrl: $page.url,
      locale
    })
  );
</script>

<PageMeta {...pageMeta} />

<section class="bg-geko-white py-5">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-11 col-sm-11">
        <RtlScope {locale}>
          <Breadcrumb
            items={[
              { label: t(locale).home, href: `/${locale}` },
              { label: t(locale).events },
            ]}
          />
          <h1 class="mb-3 mb-lg-5">{t(locale).calendar}</h1>
        </RtlScope>
        <CalendarWeekList {events} {locale} showNavigation={true} />
      </div>
    </div>
  </div>
</section>

<NewsletterBlock {locale} />

<FooterBlock {meta} {locale} />

<SupportersBlock {locale} />
