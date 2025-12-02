<script>
  import { formatDate } from '$lib/helpers/formatDate';
  import { slugify } from '$lib/helpers/landingBlocks';

  export let data = {};
  export let announcements = [];

  $: backgroundClass = data?.background_color ? `bg-geko-${data.background_color}` : 'bg-geko-white';
  $: sectionId = data?.navbar_link_title ? slugify(data.navbar_link_title) : 'news';
</script>

<section id={sectionId} class={backgroundClass}>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-7 col-md-10 my-5">
          <div class="row mb-4">
            <div class="col-12 d-flex justify-content-between align-items-center gap-3">
              <div>
                <h2 class="fw-bold mb-0">{data.title}</h2>
                <p class="mb-0 text-muted">Aktuelle Meldungen aus dem Gesundheitskollektiv</p>
              </div>
              <a class="btn btn-dark" href="/news">Alle Meldungen</a>
            </div>
          </div>

          <div class="row g-4">
            {#if announcements?.length}
              {#each announcements as item (item.id)}
                <div class="col-md-6 col-lg-4">
                  <div class="card h-100 shadow-sm border-0">
                    <div class="card-body d-flex flex-column">
                      <p class="text-uppercase small fw-semibold text-secondary mb-2">
                        {item?.publish_date ? formatDate(item.publish_date) : 'Aktuell'}
                      </p>
                      <h3 class="h5 flex-grow-1">{item?.title}</h3>
                      {#if item?.teaser_text}
                        <p class="text-muted">{item.teaser_text}</p>
                      {/if}
                      <button class="btn btn-outline-dark mt-auto" type="button">Mehr erfahren</button>
                    </div>
                  </div>
                </div>
              {/each}
            {:else}
              <div class="col-12">
                <div class="alert alert-light border fw-semibold">Keine Neuigkeiten verfügbar.</div>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
</section>
