<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import favicon from '$lib/assets/favicon.svg';
  import '../../app.scss';

  let { children } = $props();

  onMount(async () => {
    if (!browser) return;
    await import('bootstrap');
    await import('@fortawesome/fontawesome-free/js/all.js');
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="bg-light min-vh-100">
  <div class="container py-5">
    {@render children()}
  </div>
</div>
