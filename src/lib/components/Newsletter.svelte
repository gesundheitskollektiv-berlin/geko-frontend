<script>
  import { t } from '$lib/helpers/translation';

  let { locale = 'de' } = $props();
</script>

<div
  class="newsletter-layout d-flex flex-column flex-lg-row align-items-lg-center gap-4 gap-lg-5"
>
  <div class="newsletter-content">
    <h2 class="newsletter-heading mb-4 text-center text-lg-start">{t(locale).newsletterHeading}</h2>

    <p class="newsletter-intro mb-2 text-center text-lg-start">{t(locale).newsletterIntro}</p>

    <div class="newsletter-iframe-wrapper">
      <iframe
        class="newsletter-iframe"
        src="https://e2e5db3e.sibforms.com/v2/serve/MUIFAG0dYxfQn9ZBfjPd8CfAqj9qj2R8Sx9vHxvZ-BxLoX_ipkPrfX2muDBlLbO97w69TsjNMHH2RASKsL0D6r_RuXuXv-odFg_Qm3Yr9GYOYfJruhfmTnLgV08oJaMObu0CmBPlIWOd0cAuqoRqPKStOpobJQ_3N_4hnJewH8MzU2DpC1UJdREexw_gcoUQq66lyW6Nsn9LXcKBEA=="
        frameborder="0"
        scrolling="no"
        allowfullscreen
        title="Newsletter Anmeldung"
      ></iframe>
    </div>
  </div>

  <div class="newsletter-graphic d-flex justify-content-center align-items-center order-first order-lg-last">
    <img
      src="/assets/img/Logo_Geko-Newsletter-Icon.svg"
      alt=""
      aria-hidden="true"
      class="newsletter-logo"
    />
  </div>
</div>

<style>
  .newsletter-intro {
    font-size: 16px;
    line-height: 1.5;
  }

  @media (min-width: 992px) {
    .newsletter-intro {
      font-size: 20px;
    }
  }

  .newsletter-heading {
    font-weight: 800;
    line-height: 1.15;
    /* Avoid mid-word hyphenation that shows up on narrower viewports. */
    hyphens: manual;
    overflow-wrap: break-word;
  }

  .newsletter-content {
    width: 100%;
    flex: 1 1 0;
    min-width: 0;
  }

  /* Clip Brevo’s 32px top padding inside the iframe (see .sib-form in sib-styles.css). */
  .newsletter-iframe-wrapper {
    width: 100%;
    max-width: 540px;
    margin-left: auto;
    margin-right: auto;
    overflow: hidden;
    height: 368px;
  }

  .newsletter-iframe {
    display: block;
    width: 100%;
    height: 400px;
    margin-top: -32px;
    border: 0;
  }

  @media (min-width: 992px) {
    .newsletter-iframe-wrapper {
      height: 273px;
    }

    .newsletter-iframe {
      height: 305px;
    }
  }

  .newsletter-logo {
    width: 100%;
    max-width: 100px;
  }

  @media (min-width: 992px) {
    .newsletter-logo {
      max-width: 220px;
    }
  }
</style>
