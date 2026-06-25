<script>
  import { onDestroy } from 'svelte';
  import { t } from '$lib/helpers/translation';

  let { locale = 'de' } = $props();

  // Public Brevo subscription endpoint (no secret involved). reCAPTCHA is disabled
  // on the form, so a token-less POST is accepted; bots are handled by the honeypot
  // field below plus Brevo double opt-in.
  const BREVO_ACTION =
    'https://e2e5db3e.sibforms.com/serve/MUIFAG0dYxfQn9ZBfjPd8CfAqj9qj2R8Sx9vHxvZ-BxLoX_ipkPrfX2muDBlLbO97w69TsjNMHH2RASKsL0D6r_RuXuXv-odFg_Qm3Yr9GYOYfJruhfmTnLgV08oJaMObu0CmBPlIWOd0cAuqoRqPKStOpobJQ_3N_4hnJewH8MzU2DpC1UJdREexw_gcoUQq66lyW6Nsn9LXcKBEA==';

  const MSG_SUCCESS =
    'Deine Anmeldung zum Newsletter des Gesundheitskollektiv Berlin war erfolgreich.';
  const MSG_ERROR =
    'Deine Anmeldung konnte nicht gespeichert werden. Bitte versuche es erneut.';
  const MSG_INVALID_EMAIL =
    'Die eingegebenen Informationen sind nicht gültig. Bitte überprüfe das Feldformat und versuche es erneut.';
  const MSG_EMPTY = 'Dieses Feld darf nicht leer sein.';
  const MSG_CONSENT_REQUIRED =
    'Bitte bestätige, dass du den Newsletter erhalten möchtest.';

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let email = $state('');
  let consent = $state(false);
  let honeypot = $state('');
  let status = $state(null); // 'success' | 'error' | null
  let statusMessage = $state('');
  let submitting = $state(false);

  let hideTimer = null;

  function setStatus(kind, message) {
    if (hideTimer) clearTimeout(hideTimer);
    status = kind;
    statusMessage = message;
    hideTimer = setTimeout(() => {
      status = null;
      statusMessage = '';
      hideTimer = null;
    }, 5000);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    // Honeypot: real users never fill this; silently ignore bot submissions.
    if (honeypot) return;

    const value = email.trim();
    if (!value) {
      setStatus('error', MSG_EMPTY);
      return;
    }
    if (!EMAIL_RE.test(value)) {
      setStatus('error', MSG_INVALID_EMAIL);
      return;
    }
    if (!consent) {
      setStatus('error', MSG_CONSENT_REQUIRED);
      return;
    }

    submitting = true;
    try {
      const fd = new FormData();
      fd.append('EMAIL', value);
      fd.append('CONSENT_GIVEN', '1');
      fd.append('email_address_check', '');
      fd.append('locale', 'de');

      const res = await fetch(`${BREVO_ACTION}?isAjax=1`, {
        method: 'POST',
        body: fd
      });
      const data = await res.json().catch(() => null);

      if (data && data.success) {
        setStatus('success', data.message || MSG_SUCCESS);
        email = '';
        consent = false;
      } else {
        setStatus('error', (data && data.message) || MSG_ERROR);
      }
    } catch {
      setStatus('error', MSG_ERROR);
    } finally {
      submitting = false;
    }
  }

  onDestroy(() => {
    if (hideTimer) clearTimeout(hideTimer);
  });
</script>

<div
  class="newsletter-layout d-flex flex-column flex-lg-row align-items-lg-center gap-4 gap-lg-5"
>
  <div class="newsletter-content">
    <h2 class="newsletter-heading mb-4 text-center text-lg-start">{t(locale).newsletterHeading}</h2>

    <p class="newsletter-intro mb-4 text-center text-lg-start">{t(locale).newsletterIntro}</p>

    <form class="newsletter-form" novalidate onsubmit={handleSubmit}>
      {#if status}
        <div
          class="newsletter-message newsletter-message--{status}"
          role="status"
          aria-live="polite"
        >
          {statusMessage}
        </div>
      {/if}

      <div
        class="newsletter-fields d-flex flex-column flex-sm-row gap-2 gap-sm-3 align-items-stretch align-items-sm-end"
      >
        <div class="newsletter-field flex-grow-1">
          <label class="newsletter-label" for="newsletter-email">E-Mail-Adresse</label>
          <input
            id="newsletter-email"
            class="newsletter-input"
            type="email"
            name="EMAIL"
            autocomplete="email"
            placeholder="Gib bitte deine E-Mail-Adresse für die Anmeldung an, z. B. abc@xyz.com."
            bind:value={email}
            disabled={submitting}
            required
          />
        </div>

        <button class="newsletter-button" type="submit" disabled={submitting || !consent}>
          {submitting ? 'Senden…' : 'ANMELDEN'}
        </button>
      </div>

      <div class="newsletter-consent">
        <input
          id="newsletter-consent"
          class="newsletter-consent__checkbox"
          type="checkbox"
          bind:checked={consent}
          disabled={submitting}
        />
        <label class="newsletter-consent__label" for="newsletter-consent">
          Ich möchte deinen Newsletter erhalten und akzeptiere die
          <a href="/{locale}/datenschutz">Datenschutzerklärung</a>. Du kannst den Newsletter
          jederzeit über den Link in unserem Newsletter abbestellen.
        </label>
      </div>

      <input
        class="newsletter-honeypot"
        type="text"
        name="email_address_check"
        tabindex="-1"
        autocomplete="off"
        aria-hidden="true"
        bind:value={honeypot}
      />
    </form>
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

  .newsletter-form {
    width: 100%;
    max-width: 540px;
    margin-left: auto;
    margin-right: auto;
  }

  .newsletter-message {
    border: 1px solid;
    border-radius: 3px;
    padding: 12px 16px;
    margin-bottom: 16px;
    font-size: 16px;
    line-height: 1.4;
    text-align: left;
  }

  .newsletter-message--success {
    color: #085229;
    background-color: #e7faf0;
    border-color: #13ce66;
  }

  .newsletter-message--error {
    color: #661d1d;
    background-color: #ffeded;
    border-color: #ff4949;
  }

  .newsletter-label {
    display: block;
    margin-bottom: 6px;
    font-weight: 700;
    font-size: 16px;
    color: #3c4858;
    text-align: left;
  }

  .newsletter-input {
    width: 100%;
    padding: 10px 14px;
    font-size: 16px;
    color: #3c4858;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 8px;
    line-height: 1.5;
  }

  .newsletter-input::placeholder {
    color: #c0ccda;
  }

  .newsletter-input:focus {
    outline: none;
    border-color: #86b7fe;
    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
  }

  .newsletter-input:disabled {
    opacity: 0.7;
  }

  .newsletter-button {
    flex-shrink: 0;
    padding: 11px 24px;
    font-size: 16px;
    font-weight: 700;
    color: #000000;
    background-color: var(--bs-geko-yellow, #fff15b);
    border: 0;
    border-radius: 16px;
    cursor: pointer;
    white-space: nowrap;
  }

  .newsletter-button:hover:not(:disabled) {
    filter: brightness(0.95);
  }

  .newsletter-button:disabled {
    opacity: 0.65;
    cursor: default;
  }

  .newsletter-consent {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-top: 16px;
  }

  .newsletter-consent__checkbox {
    margin-top: 3px;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
  }

  .newsletter-consent__label {
    font-size: 14px;
    line-height: 1.4;
    color: #3c4858;
    text-align: left;
  }

  .newsletter-consent__label a {
    color: #2bb2fc;
    text-decoration: underline;
  }

  /* Honeypot: hidden from users but present for bots to fill in. */
  .newsletter-honeypot {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
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
