<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import { getStrapiPublicUrl } from '$lib/helpers/strapiPublicUrl';
  import { t } from '$lib/helpers/translation';

  let { job = {}, locale = 'de', isExpanded = false, onToggle } = $props();

  const getDownloadUrl = (file) => {
    if (!file?.url) return '';
    if (file.url.startsWith('http')) return file.url;
    return `${getStrapiPublicUrl()}${file.url}`;
  };

  const downloads = $derived(job?.downlads ?? []);

  function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    onToggle?.();
    // Remove focus after click to prevent outline
    if (event.currentTarget) {
      event.currentTarget.blur();
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(event);
    }
  }
</script>

<div class="job-accordion-item mt-3">
  <div
    class="job-accordion-header bg-geko-white ps-0"
    onclick={handleClick}
    onkeydown={handleKeydown}
    role="button"
    tabindex="-1"
    aria-expanded={isExpanded}
    aria-controls="job-content-{job.id || job.documentId}"
  >
    <span 
      class="chevron-icon text-geko-blue me-3"
      class:rotated={isExpanded}
    >
      <i class="fas fa-chevron-right" aria-hidden="true"></i>
    </span>
    <h4 class="mb-0 text-geko-black">{job.title}</h4>
  </div>

  {#if isExpanded}
    <div
      id="job-content-{job.id || job.documentId}"
      class="job-accordion-content bg-geko-white"
      role="region"
    >
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
  {/if}
</div>

<style>
  .job-accordion-item {
    margin-bottom: 1rem;
    overflow: hidden;
  }

  .job-accordion-header {
    padding: 1.25rem 1rem 0.75rem 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .chevron-icon {
    flex-shrink: 0;
    display: inline-block;
    transition: transform 0.3s ease-in-out;
    transform-origin: center center;
  }

  .chevron-icon.rotated {
    transform: rotate(90deg);
  }

  .job-accordion-header h4 {
    flex: 1;
    font-weight: 600;
    margin: 0;
  }

  .job-accordion-content {
    padding: 1.25rem;
    animation: slideDown 0.3s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      max-height: 0;
    }
    to {
      opacity: 1;
      max-height: 1000px;
    }
  }
</style>

