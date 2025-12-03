<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import { PUBLIC_STRAPI_URL } from '$env/static/public';

  let { job = {} } = $props();

  const getDownloadUrl = (file) => {
    if (!file?.url) return '';
    if (file.url.startsWith('http')) return file.url;
    return `${PUBLIC_STRAPI_URL}${file.url}`;
  };

  const downloads = $derived(job?.downlads ?? []);
</script>

<div class="row mb-3 mb-sm-4 mb-md-5 mb-lg-6">
  <div class="col-12">
    <h4 class="mt-5 mb-3">{job.title}</h4>

    {#if job.job_description}
      <div class="rich-text mb-3">
        {@html resolveRichText(job.job_description)}
      </div>
    {/if}

    {#if downloads.length > 0}
      {#each downloads as download}
        <a
          class="d-inline-block"
          href={getDownloadUrl(download)}
          download={download.name || ''}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="fas fa-download me-2" aria-hidden="true"></span>
          {download.name || 'Stellenausschreibung herunterladen'}
        </a>
      {/each}
    {/if}
  </div>
</div>

