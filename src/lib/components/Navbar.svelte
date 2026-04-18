<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { t, SUPPORTED_LOCALES } from '$lib/helpers/translation';

  let { locale = 'de' } = $props();

  let isNavbarOpen = false;

  const navItems = $derived([
    { label: t(locale).announcements, href: `/${locale}/aktuelles` },
    { label: t(locale).events,        href: `/${locale}/veranstaltungen` },
    { label: t(locale).aboutUs,       href: `/${locale}/ueber_uns` },
    { label: t(locale).support,       href: `/${locale}/unterstuetzen` },
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

<nav class="navbar navbar-expand-xl navbar-light bg-white py-3">
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
            <a class="btn-geko bg-geko-yellow text-black mx-2" href={item.href} onclick={collapseNavbar}>
              {item.label}
            </a>
          </li>
        {/each}

        <li class="nav-item dropdown ms-4">
          <button
            class="btn btn-white text-black dropdown-toggle"
            type="button"
            id="localeDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {locale.toUpperCase()}
          </button>
          <ul class="dropdown-menu" aria-labelledby="localeDropdown">
            {#each SUPPORTED_LOCALES as localeOption}
              <li>
                <button
                  class="dropdown-item"
                  class:active={localeOption === locale}
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

  .btn-white {
    background-color: white;
    color: black;
    border: 1px solid #dee2e6;
    border-radius: 0.5rem;
    padding: 0.25rem 1.0rem;
    font-family: "CerebriSansPro", system-ui, sans-serif;
    font-weight: 700;
    font-size: 1.25rem;
  }

  .btn-white:hover {
    background-color: #f8f9fa;
  }

  .dropdown-item.active {
    background-color: #0d6efd;
    color: white;
  }
</style>
