<script>
  import 'lazysizes';
  import { resolveMediaPath, resolveStrapiAssetUrl } from '$lib/helpers/pageMeta';

  let { src, asset, alt, style, class: classProps = '' } = $props();

  const getSrc = () => {
    if (asset?.url) {
      return resolveStrapiAssetUrl(asset);
    }
    if (src) {
      return resolveMediaPath(src);
    }
    return '';
  };

  const resolvedSrc = $derived(getSrc());
  const resolvedAlt = $derived(alt || asset?.alternativeText || '');

  const buildSrcset = () => {
    if (!asset?.formats) return '';

    const formats = asset.formats;
    const srcsetParts = [];

    if (formats.small?.url) {
      srcsetParts.push(`${resolveMediaPath(formats.small.url)} ${formats.small.width}w`);
    }
    if (formats.medium?.url) {
      srcsetParts.push(`${resolveMediaPath(formats.medium.url)} ${formats.medium.width}w`);
    }
    if (formats.large?.url) {
      srcsetParts.push(`${resolveMediaPath(formats.large.url)} ${formats.large.width}w`);
    }
    if (asset.url) {
      srcsetParts.push(`${resolveMediaPath(asset.url)} ${asset.width || 1800}w`);
    }

    return srcsetParts.join(', ');
  };

  const srcset = $derived(buildSrcset());
  const defaultSrc = $derived(
    asset?.formats?.large?.url ? resolveMediaPath(asset.formats.large.url) : resolvedSrc
  );
</script>

{#if resolvedSrc && !resolvedSrc.match(/\.(svg|webp)$/i)}
  {#if srcset}
    <img
      alt={resolvedAlt != null ? resolvedAlt : " "}
      class={classProps + " lazyload"}
      style={style}
      data-src={defaultSrc}
      data-sizes="auto"
      data-srcset={srcset}
      src={defaultSrc}
    />
  {:else}
    <img
      alt={resolvedAlt != null ? resolvedAlt : " "}
      class={classProps + " lazyload"}
      style={style}
      data-src={resolvedSrc}
      data-sizes="auto"
      src={resolvedSrc}
    />
  {/if}
{:else if resolvedSrc}
  <img
    src={resolvedSrc}
    alt={resolvedAlt != null ? resolvedAlt : " "}
    class={classProps}
    style={style}
  />
{/if}
