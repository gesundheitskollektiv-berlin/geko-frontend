<script>
  let { cta, linkUrl, index = 0 } = $props();

  // Determine if order should be reversed (even indices: 0, 2, 4...)
  const isReversed = $derived(index % 2 === 0);
</script>

<!-- Mobile Layout -->
<div class="cta-mobile d-md-none">
  <div class="text-center mb-3">
    {#if cta.call_text}
      <p class="mb-0 fs-24 fw-bold cta-call-text">{cta.call_text}</p>
    {/if}
  </div>
  <div class="text-center">
    {#if cta.link && cta.link_text}
      <a href={linkUrl} class="btn-geko bg-geko-blue text-white cta-button">
        {cta.link_text}
      </a>
    {/if}
  </div>
</div>

<!-- Desktop Layout -->
<div class="cta-desktop d-none d-md-flex align-items-center justify-content-center" class:reversed={isReversed}>
  {#if isReversed}
    <!-- Reversed order: Button first, then text -->
    <div>
      {#if cta.link && cta.link_text}
        <a href={linkUrl} class="btn-geko bg-geko-blue text-white cta-button">
          {cta.link_text}
        </a>
      {/if}
    </div>
    <div class="ms-4">
      {#if cta.call_text}
        <p class="mb-0 fs-24 fw-bold cta-call-text">{cta.call_text}</p>
      {/if}
    </div>
  {:else}
    <!-- Normal order: Text first, then button -->
    <div class="me-4">
      {#if cta.call_text}
        <p class="mb-0 fs-24 fw-bold cta-call-text">{cta.call_text}</p>
      {/if}
    </div>
    <div>
      {#if cta.link && cta.link_text}
        <a href={linkUrl} class="btn-geko bg-geko-blue text-white cta-button">
          {cta.link_text}
        </a>
      {/if}
    </div>
  {/if}
</div>

<style>
  .cta-desktop {
    gap: 1rem;
    max-width: fit-content;
    margin-left: auto;
    margin-right: auto;
  }

  .cta-button {
    border: none !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .cta-button:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }

  .cta-call-text {
    -webkit-text-stroke: 1.5px #000;
    paint-order: stroke fill;
    font-weight: 700;
  }
</style>
