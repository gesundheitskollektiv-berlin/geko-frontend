<script>
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { slugify } from '$lib/helpers/landingBlocks';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { t, SUPPORTED_LOCALES } from '$lib/helpers/translation';

  let { landingBlocks = [], locale = 'de' } = $props();

  // Check if we're on a detail page (service detail, announcement detail, about page, or support page)
  const isDetailPage = $derived(
    $page.url.pathname.match(/^\/[^/]+\/(services\/[^/]+|announcements\/[^/]+|ueber_uns|unterstuetzen)$/)
  );

  let isNavbarOpen = false;
  let isScrolled = $state(false);

  // Handle scroll behavior
  $effect(() => {
    if (!browser) return;
    
    const handleScroll = () => {
      isScrolled = window.scrollY > 50;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  // Filter blocks that should appear in navbar
  const navItems = $derived(
    (landingBlocks || [])
      .filter((block) => block?.navbar_link === true)
      .map((block) => ({
        title: block?.navbar_link_title || '',
        href: `#${slugify(block?.navbar_link_title || '')}`
      }))
  );

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

  function handleNavClick(event) {
    const href = event.currentTarget.getAttribute('href');
    if (href && href.startsWith('#')) {
      event.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        collapseNavbar();
      }
    }
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

<nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top" class:py-3={!isScrolled} class:py-2={isScrolled}>
  <div class="container">
    <a class="navbar-brand d-flex align-items-center" href="/">
      <img src="/assets/img/Logo_Geko_weiss_cropped.svg" alt="Geko Logo" class="navbar-logo" class:navbar-logo-small={isScrolled} />
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
        {#if isDetailPage}
          <!-- Back Button for detail pages (service detail and about page) -->
          <li class="nav-item">
            <a class="btn-geko bg-geko-yellow text-black mx-2" href="/{locale}">
              <i class="fas fa-arrow-left me-2"></i>
              Zurück
            </a>
          </li>
        {:else}
          <!-- Regular Navigation Items -->
          {#each navItems as item}
            <li class="nav-item">
              <a class="btn-geko bg-geko-yellow text-black mx-2" href={item.href} onclick={handleNavClick}>
                {item.title}
              </a>
            </li>
          {/each}
        {/if}
        
        <!-- Locale Selector Dropdown -->
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
    z-index: 1030;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transition: padding 0.3s ease;
  }

  .navbar-logo {
    height: 55px;
    width: auto;
    transition: height 0.3s ease;
  }

  .navbar-logo-small {
    height: 45px;
  }

  .btn-white {
    background-color: white;
    color: black;
    border: 1px solid #dee2e6;
    border-radius: 25px;
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

