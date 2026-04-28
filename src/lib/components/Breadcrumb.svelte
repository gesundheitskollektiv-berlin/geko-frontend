<script>
  import { getPreviousPath } from '$lib/helpers/navHistory.js';

  /** Each item: label (required), href optional. Last item is always the "current" crumb (underlined). */
  let { items = [] } = $props();

  function handleClick(event, href) {
    if (!href) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    const target = new URL(href, window.location.origin).pathname;
    if (getPreviousPath() === target) {
      event.preventDefault();
      history.back();
    }
  }
</script>

<nav class="breadcrumb-nav mb-4" aria-label="breadcrumb">
  {#each items as item, i (i)}
    {#if i > 0}
      <span class="breadcrumb-separator mx-2" aria-hidden="true">&gt;</span>
    {/if}
    {#if item.href && i < items.length - 1}
      <a
        href={item.href}
        class="breadcrumb-link"
        onclick={(e) => handleClick(e, item.href)}
      >{item.label}</a>
    {:else}
      <span class="breadcrumb-current">{item.label}</span>
    {/if}
  {/each}
</nav>

<style>
  .breadcrumb-nav {
    font-size: 1rem;
    color: #000;
  }

  .breadcrumb-link {
    color: inherit;
    text-decoration: none;
  }

  .breadcrumb-link:hover {
    text-decoration: underline;
  }

  .breadcrumb-current {
    text-decoration: underline;
  }
</style>
