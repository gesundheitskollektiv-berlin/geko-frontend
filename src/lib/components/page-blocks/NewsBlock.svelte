<script>
  import { slugify } from '$lib/helpers/landingBlocks';
  import { t } from '$lib/helpers/translation';
  import NewsItems from '$lib/components/NewsItems.svelte';
  import { env } from '$env/dynamic/public';

  export let data = {};
  export let announcements = [];
  export let locale = 'de';

  $: backgroundClass = data?.background_color ? `bg-geko-${data.background_color}` : 'bg-geko-white';
  $: sectionId = data?.navbar_link_title ? slugify(data.navbar_link_title) : 'news';

  // Calculate max announcements from environment
  $: maxAnnouncements = parseInt(env.PUBLIC_LANDING_MAX_ANNOUNCEMENTS || '6', 10);
</script>

<section id={sectionId} class={backgroundClass}>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-9 col-sm-11 my-5">
        <div class="row mb-4">
          <div class="col-12">
            <h2 class="fw-bold mb-0">{data.title}</h2>
            <p class="mb-0 text-muted">{t(locale).currentNews}</p>
          </div>
        </div>

        <div class="mb-5">
          <NewsItems {announcements} {maxAnnouncements} {locale} />
        </div>

        <!-- View all button -->
        {#if announcements?.length > maxAnnouncements}
          <div class="row">
            <div class="col-12">
              <a class="btn-geko bg-geko-blue text-white" href="/{locale}/announcements">{t(locale).allAnnouncements}</a>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>
