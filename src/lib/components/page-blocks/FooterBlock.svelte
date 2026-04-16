<script>
  import { slugify } from '$lib/helpers/landingBlocks';

  export let data = {};
  export let meta = {};
  export let locale = 'de';

  $: backgroundClass = data?.background_color ? `bg-geko-${data.background_color}` : 'bg-geko-green';
  $: sectionId = data?.navbar_link_title ? slugify(data.navbar_link_title) : 'footer';
  $: baseUrl = `/${locale}`;
</script>

<footer id={sectionId} class={`${backgroundClass} py-5`}>
  <div class="container fs-5" id="footer">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-11 col-sm-11">
        <!-- LOGO SECTION -->
        <div class="row">
          <div class="col-12">
            <div class="mb-5"></div>
            <p class="mb-4">Geko - Stadtteil-Gesundheits-Zentrum Neukölln<br>Wird getragen von</p>
            <a href={baseUrl}>
              <figure id="logo-kollektiv" class="mb-0 py-3 text-start">
                <img src="/assets/img/Logo_Kollektiv.svg" alt="Logo" style="height: 80px; width: auto;" />
              </figure>
            </a>
          </div>
        </div>

        <!-- THREE COLUMNS -->
        <div class="row mt-4">
          <!-- CONTACT -->
          <div class="col-md-4 contact-data">
        <h5 class="h5">Kontakt</h5>
        <span class="fa fa-home" aria-hidden="true"></span>
        &nbsp;
        {meta?.street}, {meta?.postal} {meta?.city}
        <br>

        <span class="fa fa-phone" aria-hidden="true"></span>
        &nbsp;
        {#if meta?.phone}
          <a href={`tel:${meta.phone}`} target="_blank" rel="noopener" class="text-decoration-none">{meta.phone}</a>
        {/if}
        <br>

        <span class="fa fa-at" aria-hidden="true"></span>
        &nbsp;
        {#if meta?.email}
          <a href={`mailto:${meta.email}`} target="_blank" rel="noopener" class="text-decoration-none">{meta.email}</a>
        {/if}
        <br>

        <div class="my-3"></div>
        <strong>Presseanfragen:</strong><br>
        {#if meta?.press_email}
          <a href={`mailto:${meta.press_email}`} target="_blank" rel="noopener" class="text-decoration-none">{meta.press_email}</a>
        {/if}
      </div>

      <!-- SOCIAL MEDIA -->
      <div class="col-md-4 text-md-start">
        <h5 class="h5">Social Media</h5>
        {#if meta?.facebook}
          <span class="fab fa-facebook" aria-hidden="true"></span>
          &nbsp;
          <a href={meta.facebook} target="_blank" rel="noopener noreferrer" class="text-decoration-underline fw-lighter">Facebook</a>
          <br>
        {/if}

        {#if meta?.instagram}
          <span class="fab fa-instagram" aria-hidden="true"></span>
          &nbsp;
          <a href={meta.instagram} target="_blank" rel="noopener noreferrer" class="text-decoration-underline fw-lighter">Instagram</a>
          <br>
        {/if}

        {#if meta?.twitter}
          <span class="fab fa-twitter" aria-hidden="true"></span>
          &nbsp;
          <a href={meta.twitter} target="_blank" rel="noopener noreferrer" class="text-decoration-underline fw-lighter">Twitter</a>
        {/if}

        <div class="my-3"></div>
        <strong>Fotos: </strong>
        Felicia Scheuerecker,
        Gesundheitskollektiv Berlin
      </div>

      <!-- LEGAL INFO -->
      <div class="col-md-4 text-md-start">
        <h5 class="h5">Angaben gemäß §5 TMG</h5>
        <h5 class="h5">Rechtsform</h5>
        Eingetragener Verein (e.V.)<br>

        <div>
          <h5 class="h5">Registereintrag</h5>
          Vereinsregister<br>
          VRNR 34 873<br>
        </div>

        <p class="mb-4">
          <a href={`${baseUrl}/impressum`} class="text-decoration-underline fw-lighter">Ausführliches Impressum</a><br>
          <a href={`${baseUrl}/datenschutz`} class="text-decoration-underline fw-lighter">Datenschutz</a><br>
        </p>
      </div>
    </div>
      </div>
    </div>
  </div>
</footer>

