<script>
  import { formatDate } from '$lib/helpers/formatDate';
  import StrapiImage from '$lib/components/StrapiImage.svelte';

  let { item = {}, locale = 'de' } = $props();
</script>

<div class="col-md-6 col-lg-4">
  <a href="/{locale}/announcements/{item.documentId || item.id}" class="text-decoration-none text-dark">
    <div class="card h-100 border">
      {#if item?.image}
        <StrapiImage
          asset={item.image}
          alt={item.image.alternativeText || item.title}
          class="card-img-top"
          style="aspect-ratio: 16/9; object-fit: cover;"
        />
      {/if}
      <div class="card-body d-flex flex-column">
        {#if item.publish_date || item.publishedAt}
          <time class="publish-date small text-muted mb-2">
            {formatDate(item.publish_date || item.publishedAt, locale)}
          </time>
        {/if}
        
        {#if item.is_event && item.event_date}
          <time class="event-date small text-muted mb-2 d-block">
            <i class="fas fa-calendar me-1"></i>
            {formatDate(item.event_date, locale)}
          </time>
        {/if}
        
        <h3 class="h5 mb-0 fw-normal">{item?.title}</h3>
      </div>
    </div>
  </a>
</div>

<style>
  .card {
    border-radius: 0.5rem;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }

  .event-date {
    font-size: 0.875rem;
    font-style: italic;
  }
</style>




