<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import { slugify } from '$lib/helpers/landingBlocks';

  export let data = {};
  export let meta = {};

  let showGoogleMap = false;

  $: backgroundClass = data?.background_color ? `bg-geko-${data.background_color}` : 'bg-geko-white';
  $: sectionId = data?.navbar_link_title ? slugify(data.navbar_link_title) : 'contact';
  $: mapQuery = encodeURIComponent(
    `${meta?.street ?? ''}, ${meta?.postal ?? ''} ${meta?.city ?? ''}`.trim()
  );

  const toggleMap = () => (showGoogleMap = !showGoogleMap);
</script>

<section id={sectionId} class={`${backgroundClass} py-0`}>
  <div class="container" id="contact">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-9 col-sm-11 my-5">
        <h2 class="mb-4">{data.title}</h2>

        <!-- Contact Information Row -->
        <div class="row mb-5">
          <div class="col-md-7" id="contact-image">
            <div class="image-wrapper">
              <img
                src="/assets/img/geko_eingang.jpeg"
                alt="Geko Eingang"
                class="img-fluid rounded"
              />
            </div>
          </div>
          <div class="col-md-5" id="contact-data">
            <!-- ADDRESS -->
            <p>
              <span class="fa fa-home" aria-hidden="true"></span>
              &nbsp;
              {meta?.street}, {meta?.postal} {meta?.city}
            </p>

            <p>
              <a href="#contact" class="fw-bold">Alle Telefonnummern und E-Mail-Adressen findet ihr hier</a>
            </p>
          </div>
        </div>

        <!-- Map and Content Row -->
        <div class="row mb-5">
          <!-- Left Column: Map -->
          <div class="col-md-7">
            <!-- Simple Map -->
            <div id="map-image" class={showGoogleMap ? 'd-none' : ''}>
              <div class="image-wrapper">
                <img
                  src="/assets/img/Geko_einfacheKarte_gross.png"
                  alt="Einfache Karte"
                  class="img-fluid rounded"
                />
              </div>
            </div>

            <!-- Google Map (Hidden by Default) -->
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

            <!-- Map Toggle Links -->
            <div id="show-google-map" class="py-5" class:d-none={showGoogleMap}>
              <a
                href="#"
                class="toggle-map-view text-decoration-underline text-geko-black fs-20 fw-bold"
                onclick={(e) => { e.preventDefault(); toggleMap(); }}
                style="cursor: pointer;"
              >
                Zeige Google-Karte
              </a>
            </div>

            <div id="show-simple-map" class="py-5" class:d-none={!showGoogleMap}>
              <a
                href="#"
                class="toggle-map-view text-decoration-underline text-geko-black fs-20 fw-bold"
                onclick={(e) => { e.preventDefault(); toggleMap(); }}
                style="cursor: pointer;"
              >
                Zeige einfache Karte
              </a>
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
  </div>
</section>

<style>
  .image-wrapper {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    display: block;
  }

  .image-wrapper img {
    max-width: 100% !important;
    width: 100% !important;
    height: auto !important;
    display: block;
    box-sizing: border-box;
  }

  #contact .col-md-7,
  #contact .col-md-5 {
    overflow: hidden;
    box-sizing: border-box;
  }

  .content-container {
    overflow-wrap: break-word;
    word-wrap: break-word;
    max-width: 100%;
    overflow: hidden;
  }

  .content-container img {
    max-width: 100% !important;
    height: auto !important;
    box-sizing: border-box;
  }

  .content-container :global(ul) {
    padding-left: 1rem !important;
  }
</style>
