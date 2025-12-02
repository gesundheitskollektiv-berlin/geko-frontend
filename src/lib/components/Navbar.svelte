<script>
  import { slugify } from '$lib/helpers/landingBlocks';
  import { onMount } from 'svelte';

  export let landingBlocks = [];

  let isNavbarOpen = false;

  // Filter blocks that should appear in navbar
  $: navItems = landingBlocks
    .filter((block) => block?.navbar_link === true)
    .map((block) => ({
      title: block?.navbar_link_title || '',
      href: `#${slugify(block?.navbar_link_title || '')}`
    }));

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

<nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top">
  <div class="container">
    <a class="navbar-brand" href="/">Geko</a>

    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
      on:click={toggleNavbar}
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        {#each navItems as item}
          <li class="nav-item">
            <a class="nav-link" href={item.href} on:click={handleNavClick}>
              {item.title}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</nav>

