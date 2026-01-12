<script>
  let { data = {}, locale = 'de' } = $props();
  
  // Access the populated geko_cta relation
  const cta = $derived(data?.geko_cta || {});
  
  // Check if link is external (starts with http://, https://, //, mailto:, tel:, etc.)
  function isExternalLink(link) {
    if (!link) return false;
    return /^(https?:\/\/|\/\/|mailto:|tel:|#)/i.test(link);
  }
  
  // Get the processed link URL with locale prefix for local links
  const linkUrl = $derived.by(() => {
    if (!cta.link) return '';
    if (isExternalLink(cta.link)) {
      return cta.link;
    }
    // Local link - prefix with locale
    const cleanLink = cta.link.startsWith('/') ? cta.link : `/${cta.link}`;
    return `/${locale}${cleanLink}`;
  });
</script>

<section class="bg-geko-red text-white py-5">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-9 col-sm-11">
        <div class="d-flex flex-column flex-md-row align-items-center justify-content-md-between text-center text-md-start">
          <div class="flex-grow-1 mb-3 mb-md-0">
            {#if cta.call_text}
              <p class="mb-0 fs-24 fw-bold cta-call-text">{cta.call_text}</p>
            {/if}
          </div>
          <div class="ms-md-4">
            {#if cta.link && cta.link_text}
              <a href={linkUrl} class="btn-geko bg-geko-blue text-white cta-button">
                {cta.link_text}
              </a>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .cta-button {
    border: 1.5px solid #000 !important;
  }

  .cta-call-text {
    -webkit-text-stroke: 0.75px #000;
    paint-order: stroke fill;
    font-weight: 700;
  }
</style>
