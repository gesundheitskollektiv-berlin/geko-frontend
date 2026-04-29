<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { t, SUPPORTED_LOCALES } from '$lib/helpers/translation';

  let { locale = 'de' } = $props();

  let isNavbarOpen = false;

  const navItems = $derived([
    { label: t(locale).atTheCenter,   href: `/${locale}/angebote` },
    { label: t(locale).announcements, href: `/${locale}/aktuelles` },
    { label: t(locale).events,        href: `/${locale}/veranstaltungen` },
    { label: t(locale).aboutUs,       href: `/${locale}/ueber_uns` },
    { label: t(locale).support,       href: `/${locale}/unterstuetzen` },
    { label: t(locale).kontakt,       href: `/${locale}/kontakt` },
  ]);

  function toggleNavbar() {
    isNavbarOpen = !isNavbarOpen;
  }

  function collapseNavbar() {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      if (window.bootstrap) {
        const bsCollapse = new window.bootstrap.Collapse(navbarCollapse, {
          toggle: false
        });
        bsCollapse.hide();
      } else {
        navbarCollapse.classList.remove('show');
      }
    }
    isNavbarOpen = false;
  }

  function switchLocale(newLocale) {
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(`/${locale}`, `/${newLocale}`);
    goto(newPath);
  }

  onMount(() => {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse) {
      navbarCollapse.addEventListener('shown.bs.collapse', () => {
        isNavbarOpen = true;
      });
      navbarCollapse.addEventListener('hidden.bs.collapse', () => {
        isNavbarOpen = false;
      });
    }
  });
</script>

<nav class="navbar navbar-expand-xl navbar-light bg-geko-yellow py-3">
  <div class="container">
    <a class="navbar-brand d-flex align-items-center" href="/{locale}">
      <img src="/assets/img/Logo_Geko_weiss_cropped.svg" alt="Geko Logo" class="navbar-logo" />
    </a>

    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
      onclick={toggleNavbar}
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        {#each navItems as item}
          <li class="nav-item">
            <a class="btn-geko bg-white text-black mx-2" href={item.href} onclick={collapseNavbar}>
              {item.label}
            </a>
          </li>
        {/each}

        <li class="nav-item dropdown ms-4">
          <button
            class="btn-geko btn-locale dropdown-toggle mx-2"
            type="button"
            id="localeDropdown"
            data-bs-toggle="dropdown"
            data-bs-offset="0,16"
            aria-expanded="false"
          >
            {locale.toUpperCase()}
          </button>
          <ul class="dropdown-menu dropdown-menu-end locale-menu" aria-labelledby="localeDropdown">
            {#each SUPPORTED_LOCALES as localeOption}
              <li>
                <button
                  class="dropdown-item locale-item"
                  class:active={localeOption === locale}
                  aria-current={localeOption === locale ? 'true' : undefined}
                  onclick={() => switchLocale(localeOption)}
                >
                  {t(locale).languages[localeOption]}
                </button>
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
