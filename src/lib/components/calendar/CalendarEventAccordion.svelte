<script>
  import { browser } from '$app/environment';
  import { marked } from 'marked';
  import DOMPurify from 'dompurify';
  import { t } from '$lib/helpers/translation';
  import './calendar.scss';

  let { event, locale = 'de', isExpanded = false } = $props();

  // Parsed description
  const parsedDescription = $derived(() => {
    if (!browser || !isExpanded || !event?.description) return '';
    
    try {
      const rawHtml = marked.parse(event.description);
      return DOMPurify.sanitize(rawHtml);
    } catch (error) {
      console.error('Error parsing description:', error);
      return '';
    }
  });

  // Google Maps embed URL
  const mapUrl = $derived(() => {
    if (!event?.location) return null;
    const encodedLocation = encodeURIComponent(event.location);
    return `https://www.google.com/maps?q=${encodedLocation}&output=embed`;
  });
</script>

{#if isExpanded}
  <div class="event-details-accordion mb-1">
    <!-- Description -->
    {#if event.description}
      <div class="event-detail">
        <div class="event-description">
          {@html parsedDescription()}
        </div>
      </div>
    {/if}

    <!-- Location -->
    {#if event.location}
      <div class="event-detail mt-3">
        <i class="fas fa-house me-2"></i>
        <span>{event.location}</span>
      </div>

      <!-- Google Maps iframe -->
      {#if mapUrl()}
        <div class="map-container mt-3">
          <iframe
            src={mapUrl()}
            width="100%"
            height="300"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Event location map"
          ></iframe>
        </div>
      {/if}
    {/if}
  </div>
{/if}

<style>
  .event-details-accordion {
    padding: 1rem;
    margin: 0 1.5rem;
    background-color: var(--calendar-bg-light);
    animation: slideDown var(--calendar-transition-standard);
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

  .event-detail {
    font-family: var(--calendar-font-family);
    font-size: 1rem;
    display: flex;
    align-items: flex-start;
  }

  .event-detail i {
    flex-shrink: 0;
    color: var(--calendar-text-muted);
    font-size: 1rem;
    margin-top: 0.25rem;
  }

  .event-detail span,
  .event-detail .event-description {
    flex: 1;
  }

  .event-description {
    line-height: 1.6;
  }

  .event-description :global(p) {
    margin-bottom: 0.75rem;
  }

  .event-description :global(p:last-child) {
    margin-bottom: 0;
  }

  .event-description :global(a) {
    color: var(--calendar-primary);
    text-decoration: underline;
  }

  .event-description :global(a:hover) {
    color: var(--calendar-primary-dark);
  }

  .event-description :global(ul),
  .event-description :global(ol) {
    padding-left: 1.5rem;
    margin-bottom: 0.75rem;
  }

  .event-description :global(li) {
    margin-bottom: 0.25rem;
  }

  .map-container {
    overflow: hidden;
    box-shadow: var(--calendar-shadow-sm);
  }

  .map-container iframe {
    display: block;
  }

  @media (max-width: 768px) {
    .event-details-accordion {
      padding: 0.75rem;
    }

    .map-container iframe {
      height: 250px;
    }
  }
</style>

