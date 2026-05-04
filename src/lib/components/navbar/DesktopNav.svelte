<script>
  import { page } from '$app/stores';
  import { t, SUPPORTED_LOCALES } from '$lib/helpers/translation';

  let { locale = 'de' } = $props();

  const navItems = $derived([
    { label: t(locale).atTheCenter,   href: `/${locale}/angebote` },
    { label: t(locale).announcements, href: `/${locale}/aktuelles` },
    { label: t(locale).events,        href: `/${locale}/veranstaltungen` },
    { label: t(locale).aboutUs,       href: `/${locale}/ueber_uns` },
    { label: t(locale).support,       href: `/${locale}/unterstuetzen` },
    { label: t(locale).kontakt,       href: `/${locale}/kontakt` },
  ]);
</script>

<nav class="navbar navbar-expand navbar-light bg-geko-yellow py-3">
  <div class="container">
    <a class="navbar-brand d-flex align-items-center" href="/{locale}">
      <img src="/assets/img/Logo_Geko_weiss_cropped.svg" alt="Geko Logo" class="navbar-logo" />
    </a>

    <div class="navbar-collapse">
      <ul class="navbar-nav ms-auto">
        {#each navItems as item}
          <li class="nav-item">
            <a class="btn-geko bg-white text-black mx-2" href={item.href}>
              {item.label}
            </a>
          </li>
        {/each}

        <li class="nav-item dropdown ms-4">
          <button
            class="btn-geko btn-locale dropdown-toggle mx-2"
            type="button"
            id="localeDropdownDesktop"
            data-bs-toggle="dropdown"
            data-bs-offset="0,16"
            aria-expanded="false"
          >
            {locale.toUpperCase()}
          </button>
          <ul class="dropdown-menu dropdown-menu-end locale-menu" aria-labelledby="localeDropdownDesktop">
            {#each SUPPORTED_LOCALES as localeOption}
              {@const newPath = $page.url.pathname.replace(`/${locale}`, `/${localeOption}`)}
              <li>
                <a
                  class="locale-item font-locale-link"
                  class:active={localeOption === locale}
                  aria-current={localeOption === locale ? 'true' : undefined}
                  href={newPath}
                >
                  {t(locale).languages[localeOption]}
                </a>
              </li>
            {/each}
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>

<style>
  .navbar {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  .navbar-logo {
    height: 55px;
    width: auto;
  }

  .navbar :global(.btn-geko) {
    padding: 4px 12px;
    gap: 10px;
    border-radius: 24px;
    font-size: 1rem;
    line-height: 1.4;
  }

  .btn-locale {
    background-color: #000;
    color: var(--bs-geko-yellow);
  }

  .btn-locale:hover,
  .btn-locale:focus {
    background-color: #000;
    color: var(--bs-geko-yellow);
  }

  .locale-menu {
    padding: 8px 0;
    border-radius: 20px;
    border: 2px solid #000;
    background: var(--bs-geko-yellow);
    box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.1);
    min-width: 0;
    width: max-content;
    overflow: hidden;
  }

  .locale-item {
    display: block;
    padding: 10px 20px;
    color: #000;
    background: transparent;
    text-decoration: none;
    white-space: nowrap;
  }

  .locale-item:hover,
  .locale-item:focus {
    text-decoration: underline;
    color: #000;
    background: transparent;
  }

  .locale-item.active {
    text-decoration: underline;
  }
</style>
