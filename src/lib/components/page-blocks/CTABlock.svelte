<script>
  import CTAContent from './CTAContent.svelte';
  
  let { data = {}, locale = 'de' } = $props();
  
  // Access the populated geko_cta relation
  const cta = $derived(data?.geko_cta || {});
  
  // Dynamic background color with fallback to red
  // Check both cta.background_color and data.background_color (for backward compatibility)
  const backgroundClass = $derived(
    cta?.background_color 
      ? `bg-geko-${cta.background_color}` 
      : data?.background_color 
        ? `bg-geko-${data.background_color}` 
        : 'bg-geko-red'
  );
  
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

<section class="{backgroundClass} text-white py-5">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-9 col-sm-11">
        <CTAContent {cta} {linkUrl} />
      </div>
    </div>
  </div>
</section>
