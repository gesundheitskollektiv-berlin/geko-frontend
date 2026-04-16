<script>
  import { formatDate } from '$lib/helpers/formatDate';
  import StrapiImage from '$lib/components/StrapiImage.svelte';

  let { item = {}, locale = 'de' } = $props();
</script>

<div class="col-md-6 col-lg-4">
  <a href="/{locale}/announcements/{item.documentId || item.id}" class="text-decoration-none text-dark">
    <div class="card h-100 border" class:highlight={item.highlight}>
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
          <time class="small text-muted mb-2">
            {formatDate(item.publish_date || item.publishedAt, locale)}
          </time>
        {/if}
        <h3 class="h5 mb-3 fw-normal">{item?.title}</h3>
        <div class="mt-auto">
          <span class="btn-geko bg-geko-blue text-white d-block text-center">
            Mehr erfahren
          </span>
        </div>
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

  .card.highlight {
    border-top: 3px solid var(--geko-blue, #3366ff);
  }
</style>




