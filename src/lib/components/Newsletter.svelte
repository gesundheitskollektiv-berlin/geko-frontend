<script>
  import { onMount } from 'svelte';
  import { t } from '$lib/helpers/translation';

  let { locale = 'de' } = $props();

  let iframeEl;

  onMount(() => {
    const script = document.createElement('script');
    script.src = 'https://app.mailjet.com/pas-nc-embedded-v1.js';
    script.type = 'text/javascript';
    document.body.appendChild(script);

    // Listen for Mailjet widget postMessage resize events and apply exactly,
    // so the iframe is never taller than its form content.
    function onMessage(event) {
      if (!iframeEl) return;
      if (event.source !== iframeEl.contentWindow) return;
      const data = event.data;
      const height =
        typeof data === 'number'
          ? data
          : data && typeof data === 'object'
            ? data.height ?? data.iframeHeight ?? data?.payload?.height
            : null;
      if (typeof height === 'number' && height > 0) {
        iframeEl.style.height = `${height}px`;
      }
    }
    window.addEventListener('message', onMessage);

    return () => {
      window.removeEventListener('message', onMessage);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  });
</script>

<div
  class="newsletter-layout d-flex flex-column flex-lg-row align-items-lg-center gap-4 gap-lg-5"
>
  <div class="newsletter-content">
    <h2 class="newsletter-heading mb-4">{t(locale).newsletterHeading}</h2>

    <div class="newsletter-iframe-wrapper">
      <iframe
        bind:this={iframeEl}
        data-w-type="embedded"
        frameborder="0"
        scrolling="no"
        marginheight="0"
        marginwidth="0"
        src="https://x983w.mjt.lu/wgt/x983w/vrn/form?c=4f94931a"
        width="100%"
        title="Newsletter Anmeldung"
      ></iframe>
    </div>
  </div>

  <div class="newsletter-graphic d-none d-lg-flex justify-content-center align-items-center">
    <img
      src="/assets/img/Logo_Geko-Newsletter-Icon.svg"
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

  /* Cap the whole content column to the form width so the heading and form
     share the same right edge and the graphic sits flush against them. */
  .newsletter-content {
    width: 100%;
    max-width: 520px;
  }

  /* Constrain form width so its content wraps consistently across breakpoints
     and the iframe height stays predictable. */
  .newsletter-iframe-wrapper {
    width: 100%;
    max-width: 520px;
  }

  .newsletter-iframe-wrapper iframe {
    display: block;
    width: 100%;
    max-width: 100%;
    min-height: 320px;
    border: 0;
  }

  /* Very narrow screens where 520px cap is irrelevant and text wraps more. */
  @media (max-width: 575.98px) {
    .newsletter-iframe-wrapper iframe {
      min-height: 380px;
    }
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
