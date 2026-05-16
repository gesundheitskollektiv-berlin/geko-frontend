<script>
  import { t } from '$lib/helpers/translation';

  let { tags = [], selectedTagId = $bindable(null), locale = 'de' } = $props();

  function select(id) {
    selectedTagId = id;
  }
</script>

<div class="filter-bar d-flex justify-content-start align-items-center flex-wrap gap-2">
  <span class="filter-bar-label fw-bold me-2 d-none d-md-inline">{t(locale).filter}:</span>

  <button
    type="button"
    class="btn-geko filter-btn"
    class:active={selectedTagId === null}
    onclick={() => select(null)}
  >
    {t(locale).all}
  </button>

  {#each tags as tag (tag.id)}
    <button
      type="button"
      class="btn-geko filter-btn"
      class:active={selectedTagId === tag.id}
      onclick={() => select(tag.id)}
    >
      {tag.name}
    </button>
  {/each}
</div>

<style>
  /* Fluid to Figma body 21px on large screens (visible md+ only) */
  .filter-bar-label {
    font-size: clamp(1rem, 0.875rem + 0.625vw, 1.3125rem);
  }

  .filter-btn {
    background-color: var(--bs-geko-yellow);
    color: #000;
    /* Fluid 16px → 20px; cap reached at ~1200px viewport */
    font-size: clamp(1rem, 0.875rem + 0.5vw, 1.25rem);
    /* em-based so vertical and horizontal padding scale with font-size */
    padding: 0.3em 0.7em;
  }
  .filter-btn.active {
    background-color: #000;
    color: var(--bs-geko-yellow);
  }
</style>
