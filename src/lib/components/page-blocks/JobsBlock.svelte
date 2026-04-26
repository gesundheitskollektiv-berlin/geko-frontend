<script>
  import { slugify } from '$lib/helpers/landingBlocks';
  import { t } from '$lib/helpers/translation';
  import JobDescription from '$lib/components/JobDescription.svelte';

  let { data = {}, jobs = [], locale = 'de' } = $props();

  let expandedJobId = $state(null);

  function handleJobToggle(jobId) {
    if (expandedJobId === jobId) {
      expandedJobId = null;
    } else {
      expandedJobId = jobId;
    }
  }

  const backgroundClass = $derived(data?.background_color ? `bg-geko-${data.background_color}` : 'bg-geko-white');
  const sectionId = $derived(data?.navbar_link_title ? slugify(data.navbar_link_title) : 'jobs');
</script>

<section id={sectionId} class={`${backgroundClass} py-5`}>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 col-md-11 col-sm-11">
        <h2 class="mb-3 mb-lg-5">{data.title}</h2>

        {#if jobs.length > 0}
          <p class="mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          {#each jobs as job (job.id)}
            <JobDescription 
              {job} 
              {locale} 
              isExpanded={expandedJobId === (job.id || job.documentId)}
              onToggle={() => handleJobToggle(job.id || job.documentId)}
            />
          {/each}
        {:else}
          <p class="mt-4">{t(locale).noJobsAvailable}</p>
        {/if}
      </div>
    </div>
  </div>
</section>
