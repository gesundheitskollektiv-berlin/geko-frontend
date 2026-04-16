<script>
  let { data = {}, locale = 'de' } = $props();

  const cta = $derived(data?.geko_cta || {});

  function isExternalLink(link) {
    if (!link) return false;
    return /^(https?:\/\/|\/\/|mailto:|tel:|#)/i.test(link);
  }

  const linkUrl = $derived.by(() => {
    if (!cta.link) return '';
    if (isExternalLink(cta.link)) return cta.link;
    const cleanLink = cta.link.startsWith('/') ? cta.link : `/${cta.link}`;
    return `/${locale}${cleanLink}`;
  });
</script>

<section class="bg-geko-blue py-5">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-9 col-sm-11">
        {#if cta.cta_name}
          <h2 class="fw-bold">{cta.cta_name}</h2>
        {/if}
        {#if cta.call_text}
          <p>{cta.call_text}</p>
        {/if}
        {#if cta.link && cta.link_text}
          <div class="text-center mt-4">
            <a href={linkUrl} class="btn-geko bg-geko-blue text-white cta-button">
              {cta.link_text}
            </a>
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>
