<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
	import favicon from '$lib/assets/favicon.svg';
  import '../../app.scss';
  import Navbar from '$lib/components/Navbar.svelte';
  import TopScroller from '$lib/components/TopScroller.svelte';
  import { trackNavigation } from '$lib/helpers/navHistory.js';

  trackNavigation();

  let { children, data } = $props();

  onMount(async () => {
    if (!browser) return;
    await import('bootstrap');
    await import('@fortawesome/fontawesome-free/js/all.js');
  });
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Navbar locale={data.locale} />
<div class="bg-light min-vh-100">
{@render children()}
</div>
<TopScroller />