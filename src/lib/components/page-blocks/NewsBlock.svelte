<script>
  import { slugify } from '$lib/helpers/landingBlocks';
  import { t } from '$lib/helpers/translation';
  import NewsItems from '$lib/components/NewsItems.svelte';
  import { env } from '$env/dynamic/public';

  export let data = {};
  export let announcements = [];
  export let locale = 'de';

  $: backgroundClass = 'bg-geko-white';
  $: sectionId = data?.navbar_link_title ? slugify(data.navbar_link_title) : 'news';

  // Calculate max announcements from environment
  $: maxAnnouncements = parseInt(env.PUBLIC_LANDING_MAX_ANNOUNCEMENTS || '6', 10);
</script>

<section id={sectionId} class="{backgroundClass} py-9">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-11 col-sm-11">
        <div class="row mb-5">
          <div class="col-12 text-center">
            <h2 class="geko-headline-canvas mb-3">{data.title}</h2>
            <p class="mb-0 text-muted">{t(locale).currentNews}</p>
          </div>
        </div>

        <div class="mb-4">
          <NewsItems {announcements} {maxAnnouncements} {locale} />
        </div>

        <div class="text-center mt-5 mt-lg-7">
          <a class="text-decoration-underline text-geko-black fs-20 fw-bold" href="/{locale}/aktuelles">
            {t(locale).allAnnouncements}
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
