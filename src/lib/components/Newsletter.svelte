<script>
  import { onMount } from 'svelte';
  import { t } from '$lib/helpers/translation';

  let { locale = 'de' } = $props();

  let iframeEl;

  onMount(() => {
    const SCRIPT_SRC = 'https://app.mailjet.com/pas-nc-embedded-v2.js';

    // The Mailjet v2 widget self-initializes from a `window.load` listener.
    // When this component mounts after the page has already loaded
    // (e.g. on client-side navigation), that listener never fires, so we
    // call iframe-resizer ourselves once the script is available.
    function initWidget() {
      if (!iframeEl || typeof window.iFrameResize !== 'function') return;
      window.iFrameResize({ checkOrigin: false }, iframeEl);
    }

    function onCaptchaMessage(event) {
      if (!iframeEl) return;
      const type = event?.data?.type;
      if (type === 'CAPTCHA_OPEN') iframeEl.style.minHeight = '650px';
      if (type === 'CAPTCHA_CLOSE') iframeEl.style.minHeight = '0px';
    }

    let script = document.querySelector('script[data-mailjet-embed-v2]');
    if (!script) {
      script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.type = 'text/javascript';
      script.async = true;
      script.dataset.mailjetEmbedV2 = '';
      document.body.appendChild(script);
    }

    if (typeof window.iFrameResize === 'function') {
      initWidget();
    } else {
      script.addEventListener('load', initWidget, { once: true });
    }

    window.addEventListener('message', onCaptchaMessage);

    return () => {
      window.removeEventListener('message', onCaptchaMessage);
      script.removeEventListener('load', initWidget);
      try {
        iframeEl?.iFrameResizer?.removeListeners?.();
      } catch {
        // no-op
      }
    };
  });
</script>

<div
  class="newsletter-layout d-flex flex-column flex-lg-row align-items-lg-center gap-4 gap-lg-5"
>
  <div class="newsletter-content">
    <h2 class="newsletter-heading mb-5">{t(locale).newsletterHeading}</h2>

    <div class="newsletter-iframe-wrapper">
      <iframe
        bind:this={iframeEl}
        data-w-type="embedded"
        frameborder="0"
        scrolling="no"
        marginheight="0"
        marginwidth="0"
        src="https://x983w.mjt.lu/wgt/x983w/0j7k/form?c=392471ef"
        width="100%"
        style="height: 0;"
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
    /* Avoid mid-word hyphenation that shows up on narrower viewports. */
    hyphens: manual;
    overflow-wrap: break-word;
  }

  /* Let the form column grow into the available row so we don't leave a
     gap before the graphic, and so the embedded Mailjet widget gets enough
     width to switch into its horizontal layout. */
  .newsletter-content {
    width: 100%;
    flex: 1 1 0;
    min-width: 0;
  }

  .newsletter-iframe-wrapper {
    width: 100%;
  }

  .newsletter-iframe-wrapper iframe {
    display: block;
    width: 100%;
    max-width: 100%;
    border: 0;
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
