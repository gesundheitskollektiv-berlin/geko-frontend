<script>
  import { t } from '$lib/helpers/translation';

  let {
    title,
    description = '',
    image = '',
    url = '',
    locale = 'de',
    type = 'website',
    siteName = 'Geko'
  } = $props();

  const resolvedDescription = $derived(description.trim() || t(locale).footerTagline);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={resolvedDescription} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={resolvedDescription} />
  {#if image}
    <meta property="og:image" content={image} />
  {/if}
  {#if url}
    <meta property="og:url" content={url} />
  {/if}
  <meta property="og:type" content={type} />
  <meta property="og:site_name" content={siteName} />
  <meta property="og:locale" content={locale} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={resolvedDescription} />
  {#if image}
    <meta name="twitter:image" content={image} />
  {/if}
</svelte:head>
