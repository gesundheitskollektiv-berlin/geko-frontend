<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import { PUBLIC_STRAPI_URL } from '$env/static/public';

  let { material = {} } = $props();

  const getDownloadUrl = (file) => {
    if (!file?.url) return '';
    if (file.url.startsWith('http')) return file.url;
    return `${PUBLIC_STRAPI_URL}${file.url}`;
  };
</script>

<div class="row mb-3 mb-sm-4 mb-md-5 mb-lg-6">
  <div class="col-12">
    <h4 class="mt-5 mb-3">{material.title}</h4>

    {#if material.description}
      <div class="rich-text mb-3">
        {@html resolveRichText(material.description)}
      </div>
    {/if}

    {#if material.file}
      <a
        class="d-inline-block"
        href={getDownloadUrl(material.file)}
        download={material.file.name || ''}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="fas fa-download me-2" aria-hidden="true"></span>
        {material.file.name || 'Material herunterladen'}
      </a>
    {/if}
  </div>
</div>

