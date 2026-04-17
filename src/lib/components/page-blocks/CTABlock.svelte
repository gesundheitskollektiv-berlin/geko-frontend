<script>
  import StrapiImage from '$lib/components/StrapiImage.svelte';

  let { data = {}, locale = 'de' } = $props();

  const colorMap = { blue: 'var(--bs-geko-blue)', purple: 'var(--bs-geko-lilac)' };

  const cta = $derived(data?.geko_cta || {});
  const bgColor = $derived(colorMap[cta.background_color] ?? colorMap.purple);

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

<section class="cta-section py-5" style:--cta-color={bgColor}>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-11 col-sm-11">
        <div class="row">
          <div class="col-lg-4">
            {#if cta.logo}
              <StrapiImage
                asset={cta.logo}
                alt={cta.logo.alternativeText || ''}
                class="img-fluid cta-logo"
              />
            {/if}
          </div>
          <div class="col-lg-8">
            {#if cta.call_text}
              <h2 class="fw-bold">{cta.call_text}</h2>
            {/if}
            {#if cta.link && cta.link_text}
              <div class="mt-4">
                <a href={linkUrl} class="btn-geko bg-geko-yellow text-black">
                  {cta.link_text} →
                </a>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .cta-section {
    background: linear-gradient(to bottom, #ffffff 0%, var(--cta-color) 60%);
  }

  .cta-section :global(.cta-logo) {
    max-width: 150px;
  }
</style>
