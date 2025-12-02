<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import { onMount } from 'svelte';

  export let data = {};
  export let meta = {};
  export let anchor = '';
  export let backgroundClass = 'bg-white';

  let showGoogleMap = false;

  $: mapQuery = encodeURIComponent(
    `${meta?.street ?? ''}, ${meta?.postal ?? ''} ${meta?.city ?? ''}`.trim()
  );

  function toggleMap() {
    showGoogleMap = !showGoogleMap;
  }
</script>

<section id={anchor || undefined}>
  <div class={`py-0 ${backgroundClass}`}>
    <div class="container" id="contact">
      {#if data?.title}
        <h2 class="pt-3 pt-md-5 pt-lg-9 pb-3">{data.title}</h2>
      {/if}

      <!-- Contact Information Row -->
      <div class="row mb-5">
        <div class="col-md-7" id="contact-image">
          {#if meta?.page_banner}
            <img
              src={meta.page_banner.url}
              alt={meta.page_banner.alternativeText || 'Geko Eingang'}
              class="img-fluid rounded w-100"
            />
          {/if}
        </div>
        <div class="col-md-5" id="contact-data">
          <!-- ADDRESS -->
          <div class="card border-0 bg-transparent">
            <div class="card-body">
              <span class="fa fa-home" aria-hidden="true"></span>
              &nbsp;
              {meta?.street}, {meta?.postal}
              {meta?.city}
            </div>
          </div>

          <div class="mb-3"></div>
          <p>
            <a href="#contact" class="fw-bold"
              >Alle Telefonnummern und E-Mail-Adressen findet ihr hier</a
            >
          </p>
        </div>
      </div>

      <!-- Map and Content Row -->
      <div class="row mb-5">
        <!-- Left Column: Map -->
        <div class="col-md-7">
          <!-- Simple Map -->
          <div id="map-image" class={showGoogleMap ? 'd-none' : ''}>
            {#if meta?.page_banner}
              <img
                src="/assets/img/Geko_einfacheKarte_gross.png"
                alt="Einfache Karte"
                class="img-fluid rounded w-100"
              />
            {/if}
          </div>

          <!-- Google Map -->
          <div id="google-map" class={showGoogleMap ? '' : 'd-none'}>
            <div class="ratio ratio-16x9">
              <iframe
                src={`https://maps.google.com/maps?width=100%25&height=600&hl=de&q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=B&output=embed`}
                allowfullscreen
                loading="lazy"
                title="Google Maps"
              ></iframe>
            </div>
          </div>

          <!-- Map Toggle Buttons -->
          <div id="show-google-map" class="py-5" class:d-none={showGoogleMap}>
            <button
              type="button"
              class="toggle-map-view btn-geko bg-geko-blue text-white px-3"
              onclick={toggleMap}
            >
              <span class="text-white">Zeige Google-Karte</span>
            </button>
          </div>

          <div id="show-simple-map" class="py-5" class:d-none={!showGoogleMap}>
            <button
              type="button"
              class="toggle-map-view btn-geko bg-geko-blue text-white px-3"
              onclick={toggleMap}
            >
              <span class="text-white">Zeige einfache Karte</span>
            </button>
          </div>
        </div>

        <!-- Right Column: Content -->
        <div class="col-md-5">
          {#if data?.content}
            <div class="content-container">
              {@html resolveRichText(data.content)}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</section>
