<script>
  /**
   * Wraps editorial content with dir="rtl" and hook class `locale-ar` when locale is Arabic.
   * Non-Ar locales use dir="ltr" explicitly so direction never inherits incorrectly.
   */
  let { locale, children, tag = 'div', class: className = '' } = $props();

  const isAr = $derived(locale === 'ar');

  const mergedClass = $derived([isAr ? 'locale-ar' : '', className].filter(Boolean).join(' '));
</script>

<svelte:element this={tag} dir={isAr ? 'rtl' : 'ltr'} class={mergedClass}>
  {@render children()}
</svelte:element>
