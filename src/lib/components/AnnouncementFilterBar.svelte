<script>
  import { t } from '$lib/helpers/translation';

  let { tags = [], selectedTagId = $bindable(null), locale = 'de' } = $props();

  function select(id) {
    selectedTagId = id;
  }
</script>

<div class="filter-bar d-flex justify-content-center align-items-center flex-wrap gap-2 my-4">
  <span class="fw-bold me-2">{t(locale).filter}:</span>

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
  .filter-btn {
    background-color: var(--bs-geko-yellow);
    color: #000;
    font-size: 1rem;
    padding: 6px 14px;
  }
  .filter-btn.active {
    background-color: #000;
    color: var(--bs-geko-yellow);
  }
</style>
