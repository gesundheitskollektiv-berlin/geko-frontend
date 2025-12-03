<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import { PUBLIC_STRAPI_URL } from '$env/static/public';
  import { t } from '$lib/helpers/translation';

  let { job = {}, locale = 'de' } = $props();

  const getDownloadUrl = (file) => {
    if (!file?.url) return '';
    if (file.url.startsWith('http')) return file.url;
    return `${PUBLIC_STRAPI_URL}${file.url}`;
  };

  const downloads = $derived(job?.downlads ?? []);
</script>

<div class="row mt-5">
  <div class="col-12">
    <h4 class="mb-3">{job.title}</h4>

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
          {t(locale).download}
        </a>
      {/each}
    {/if}
  </div>
</div>

