<script>
  import { t } from '$lib/helpers/translation';

  export const data = {};
  export let meta = {};
  export let locale = 'de';

  $: baseUrl = `/${locale}`;
</script>

<footer id="footer" class="bg-geko-yellow py-9">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-11 col-sm-11">
        <p class="footer-intro mb-4">
          {t(locale).footerTagline}<br>
          {t(locale).footerCarriedBy}
        </p>

        <div class="row gy-4">

          <!-- 1. LOGO -->
          <div class="col-lg-3 col-md-6 col-12 d-flex align-items-start">
            <a href={baseUrl} aria-label="Geko Startseite">
              <img
                src="/assets/img/Logo_Kollektiv.svg"
                alt="Geko Logo"
                class="footer-logo"
              />
            </a>
          </div>

          <!-- 2. CONTACT -->
          <div class="col-lg-3 col-md-6 col-12 footer-col">
            {#if meta?.street || meta?.postal || meta?.city}
              <p class="mb-1">
                <i class="fa fa-home me-2" aria-hidden="true"></i>
                {meta?.street}{meta?.street && (meta?.postal || meta?.city) ? ',' : ''}
                {meta?.postal ?? ''} {meta?.city ?? ''}
              </p>
            {/if}
            {#if meta?.phone}
              <p class="mb-1">
                <i class="fa fa-phone me-2" aria-hidden="true"></i>
                <a href={`tel:${meta.phone}`} class="footer-link">{meta.phone}</a>
              </p>
            {/if}
            {#if meta?.email}
              <p class="mb-0">
                <i class="fa fa-at me-2" aria-hidden="true"></i>
                <a href={`mailto:${meta.email}`} class="footer-link">{meta.email}</a>
              </p>
            {/if}
          </div>

          <!-- 3. LEGAL LINKS -->
          <div class="col-lg-3 col-md-6 col-12 footer-col">
            <p class="mb-1">
              <a href={`${baseUrl}/impressum`} class="footer-link">{t(locale).imprint}</a>
            </p>
            <p class="mb-0">
              <a href={`${baseUrl}/datenschutz`} class="footer-link">{t(locale).privacyPolicy}</a>
            </p>
          </div>

          <!-- 4. INSTAGRAM -->
          {#if meta?.instagram}
            <div class="col-lg-3 col-md-6 col-12 d-flex align-items-start">
              <a
                href={meta.instagram}
                target="_blank"
                rel="noopener noreferrer"
                class="footer-social-circle"
                aria-label="Instagram"
              >
                <i class="fa-brands fa-instagram" aria-hidden="true"></i>
              </a>
            </div>
          {/if}

        </div>
      </div>
    </div>
  </div>
</footer>

<style>
  .footer-intro {
    font-size: 0.9375rem;
    line-height: 1.6;
  }

  .footer-logo {
    height: 64px;
    width: auto;
  }

  .footer-col {
    font-size: 0.9375rem;
  }

  .footer-link {
    color: inherit;
    text-decoration: none;
    font-weight: 600;
  }

  .footer-link:hover {
    text-decoration: underline;
  }

  .footer-social-circle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    background: #000;
    color: #fff;
    font-size: 1.2rem;
    text-decoration: none;
    transition: opacity 0.2s ease-in-out;
  }

  .footer-social-circle:hover {
    opacity: 0.8;
  }
</style>
