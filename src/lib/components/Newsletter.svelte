<script>
  import { onMount } from 'svelte';
  import { t } from '$lib/helpers/translation';

  let { locale = 'de' } = $props();

  onMount(() => {
    const script = document.createElement('script');
    script.src = 'https://app.mailjet.com/pas-nc-embedded-v1.js';
    script.type = 'text/javascript';
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  });
</script>

<div class="row align-items-center">
  <div class="col-lg-7">
    <h2 class="newsletter-heading mb-4">{t(locale).newsletterHeading}</h2>

    <div class="newsletter-iframe-wrapper">
      <iframe
        data-w-type="embedded"
        frameborder="0"
        scrolling="no"
        marginheight="0"
        marginwidth="0"
        src="https://x983w.mjt.lu/wgt/x983w/vrn/form?c=4f94931a"
        width="100%"
        style="height: 232px; overflow: hidden;"
        title="Newsletter Anmeldung"
      ></iframe>
    </div>
  </div>

  <div class="col-lg-5 d-none d-lg-flex justify-content-center align-items-center">
    <img
      src="/assets/img/logo_arrow_swing.svg"
      alt=""
      aria-hidden="true"
      class="newsletter-logo"
    />
  </div>
</div>

<style>
  .newsletter-heading {
    font-weight: 800;
    line-height: 1.15;
  }

  .newsletter-iframe-wrapper {
    width: 100%;
  }

  .newsletter-iframe-wrapper iframe {
    display: block;
    max-width: 100%;
  }

  .newsletter-logo {
    width: 100%;
    max-width: 280px;
  }

  /* Mailjet widget injects its form into the DOM — style the submit button */
  :global(.newsletter-iframe-wrapper input[type='submit'],
          .newsletter-iframe-wrapper button[type='submit'],
          .newsletter-iframe-wrapper .mj-widget-button) {
    background-color: #fff15b !important;
    color: #000 !important;
    border: none !important;
    border-radius: 2rem !important;
    font-weight: 700 !important;
    padding: 0.55rem 1.5rem !important;
    cursor: pointer !important;
  }

  :global(.newsletter-iframe-wrapper input[type='submit']:hover,
          .newsletter-iframe-wrapper button[type='submit']:hover,
          .newsletter-iframe-wrapper .mj-widget-button:hover) {
    opacity: 0.88 !important;
  }
</style>
