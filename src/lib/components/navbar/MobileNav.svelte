<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { t, SUPPORTED_LOCALES } from '$lib/helpers/translation';

  let { locale = 'de' } = $props();
  let isOpen = $state(false);

  const navItems = $derived([
    { label: t(locale).atTheCenter,   href: `/${locale}/angebote` },
    { label: t(locale).announcements, href: `/${locale}/aktuelles` },
    { label: t(locale).events,        href: `/${locale}/veranstaltungen` },
    { label: t(locale).aboutUs,       href: `/${locale}/ueber_uns` },
    { label: t(locale).support,       href: `/${locale}/unterstuetzen` },
    { label: t(locale).kontakt,       href: `/${locale}/kontakt` },
  ]);

  const instagramUrl = $derived($page.data?.['geko-meta']?.data?.instagram);

  const isActive = (href) => $page.url.pathname.startsWith(href);

  const close = () => (isOpen = false);

  const switchLocale = (l) => {
    const newPath = $page.url.pathname.replace(`/${locale}`, `/${l}`);
    isOpen = false;
    goto(newPath);
  };

  // Body scroll lock + Esc to close
  $effect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  });

  // Auto-close when viewport crosses into desktop width
  $effect(() => {
    const mq = window.matchMedia('(min-width: 1200px)');
    const handler = (e) => { if (e.matches) isOpen = false; };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  });
</script>

<!-- Top bar (always visible on mobile) -->
<header class="mobile-bar bg-geko-yellow">
  <a class="brand" href="/{locale}" aria-label="Geko Startseite">
    <img src="/assets/img/Logo_Geko_weiss_cropped.svg" alt="Geko Logo" class="brand-logo" />
  </a>
  <button
    type="button"
    class="burger"
    class:open={isOpen}
    aria-label={isOpen ? 'Menü schließen' : 'Menü öffnen'}
    aria-expanded={isOpen}
    onclick={() => (isOpen = !isOpen)}
  >
    <span></span><span></span><span></span>
  </button>
</header>

<!-- Fullscreen overlay -->
{#if isOpen}
  <div class="mobile-overlay bg-geko-yellow" role="dialog" aria-modal="true" aria-label="Hauptnavigation">
    <header class="mobile-bar overlay-bar">
      <a class="brand" href="/{locale}" onclick={close} aria-label="Geko Startseite">
        <img src="/assets/img/Logo_Geko_weiss_cropped.svg" alt="Geko Logo" class="brand-logo" />
      </a>
      <button class="burger open" type="button" onclick={close} aria-label="Menü schließen">
        <span></span><span></span><span></span>
      </button>
    </header>

    <nav class="overlay-nav">
      <ul class="overlay-list">
        {#each navItems as item}
          <li>
            <a
              href={item.href}
              onclick={close}
              class="btn-geko {isActive(item.href) ? 'bg-geko-lilac-light' : 'bg-white'} text-black"
            >
              {item.label}
            </a>
          </li>
        {/each}

        <li class="locale-li">
          <div class="dropdown">
            <button
              class="btn-geko btn-locale dropdown-toggle"
              type="button"
              id="localeDropdownMobile"
              data-bs-toggle="dropdown"
              data-bs-offset="0,16"
              aria-expanded="false"
            >
              {locale.toUpperCase()}
            </button>
            <ul class="dropdown-menu dropdown-menu-end locale-menu" aria-labelledby="localeDropdownMobile">
              {#each SUPPORTED_LOCALES as l}
                <li>
                  <button
                    class="dropdown-item locale-item"
                    class:active={l === locale}
                    aria-current={l === locale ? 'true' : undefined}
                    onclick={() => switchLocale(l)}
                  >{t(locale).languages[l]}</button>
                </li>
              {/each}
            </ul>
          </div>
        </li>
      </ul>
    </nav>

    <footer class="overlay-footer">
      <div class="overlay-legal">
        <a href={`/${locale}/impressum`} onclick={close}>{t(locale).imprint}</a>
        <a href={`/${locale}/datenschutz`} onclick={close}>{t(locale).privacyPolicyShort}</a>
      </div>
      {#if instagramUrl}
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="overlay-social"
          aria-label="Instagram"
        >
          <i class="fa-brands fa-instagram"></i>
        </a>
      {/if}
    </footer>
  </div>
{/if}

<style>
  .mobile-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  .brand-logo {
    height: 55px;
    width: auto;
  }

  /* Animated burger -> X */
  .burger {
    background: transparent;
    border: 0;
    width: 44px;
    height: 44px;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 6px;
    padding: 0;
    cursor: pointer;
  }

  .burger span {
    display: block;
    width: 28px;
    height: 4px;
    border-radius: 2px;
    background: #000;
    transition: transform 250ms ease, opacity 200ms ease;
    transform-origin: center;
  }

  .burger.open span:nth-child(1) { transform: translateY(10px) rotate(45deg); }
  .burger.open span:nth-child(2) { opacity: 0; }
  .burger.open span:nth-child(3) { transform: translateY(-10px) rotate(-45deg); }

  /* Fullscreen overlay */
  .mobile-overlay {
    position: fixed;
    inset: 0;
    z-index: 1050;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .overlay-bar {
    box-shadow: none;
  }

  .overlay-nav {
    flex: 1;
    padding: 24px 24px 0;
  }

  .overlay-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 14px;
  }

  .overlay-list :global(.btn-geko) {
    font-size: 1.125rem;
    padding: 12px 22px;
    border-radius: 24px;
    font-family: 'CerebriSansPro', system-ui, sans-serif;
    font-weight: 700;
    text-decoration: none;
    display: inline-block;
  }

  .overlay-footer {
    padding: 24px 24px 32px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .overlay-legal {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 28px;
  }

  .overlay-legal a {
    color: #000;
    font-weight: 700;
    text-decoration: underline;
  }

  .overlay-social {
    align-self: flex-end;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #000;
    color: #fff;
    font-size: 1.2rem;
    text-decoration: none;
  }

  /* Locale dropdown inside overlay */
  .btn-locale {
    background-color: #000;
    color: var(--bs-geko-yellow);
    border-radius: 24px;
    font-family: 'CerebriSansPro', system-ui, sans-serif;
    font-weight: 700;
    padding: 12px 22px;
    font-size: 1.125rem;
  }

  .btn-locale:hover,
  .btn-locale:focus {
    background-color: #000;
    color: var(--bs-geko-yellow);
  }

  .locale-menu {
    padding: 8px 0;
    border-radius: 24px;
    border: 2px solid #000;
    background: #fff;
    box-shadow: -5px 5px 15px rgba(0, 0, 0, 0.15);
    min-width: 200px;
    overflow: hidden;
  }

  .locale-item {
    font-family: 'CerebriSansPro', system-ui, sans-serif;
    font-weight: 700;
    padding: 10px 20px;
    color: #000;
    background: transparent;
    white-space: nowrap;
  }

  .locale-item:hover,
  .locale-item:focus {
    background: var(--bs-geko-lilac-light);
    color: #000;
  }

  .locale-item.active,
  .locale-item.active:hover,
  .locale-item.active:focus {
    background: var(--bs-geko-lilac);
    color: #000;
  }
</style>
