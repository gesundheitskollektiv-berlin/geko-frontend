<script>
  import { browser } from '$app/environment';
  import { marked } from 'marked';
  import DOMPurify from 'dompurify';
  import { formatDateRange, isValidHttpUrl } from '$lib/helpers/calendar';
  import { t } from '$lib/helpers/translation';

  let { event = null, isOpen = false, onClose, locale = 'de' } = $props();

  // Parsed HTML from markdown (safely sanitized)
  const parsedDescription = $derived.by(() => {
    if (!event?.description) return '';
    
    try {
      const rawHtml = marked.parse(event.description);
      // Only sanitize on the client side
      if (browser) {
        return DOMPurify.sanitize(rawHtml);
      }
      return rawHtml;
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

  // Handle escape key to close modal
  $effect(() => {
    if (!browser || !isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  // Focus management
  $effect(() => {
    if (!browser || !isOpen) return;

    const modal = document.querySelector('.modal.show');
    if (modal) {
      // Focus the modal
      modal.focus();
    }
  });
</script>

{#if isOpen && event}
  <!-- Modal backdrop -->
  <div 
    class="modal-backdrop fade show" 
    onclick={onClose}
    role="presentation"
  ></div>

  <!-- Modal dialog -->
  <div 
    class="modal fade show" 
    style="display: block;" 
    tabindex="-1" 
    role="dialog"
    aria-modal="true"
    aria-labelledby="eventModalLabel"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header" style="border-left: 4px solid {event.color};">
          <h5 class="modal-title" id="eventModalLabel">{event.title}</h5>
          <button 
            type="button" 
            class="btn-close" 
            onclick={onClose}
            aria-label={t(locale).closeModal || 'Close'}
          ></button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <!-- Date/Time -->
          <div class="event-detail mb-3">
            <strong>📅 {t(locale).when || 'When'}:</strong>
            <div class="ms-4">
              {formatDateRange(event.start, event.end, locale)}
            </div>
          </div>

          <!-- Description -->
          {#if event.description}
            <div class="event-detail mb-3">
              <strong>📝 {t(locale).description || 'Description'}:</strong>
              <div class="ms-4 event-description">
                {@html parsedDescription}
              </div>
            </div>
          {/if}

          <!-- Location -->
          {#if event.location}
            <div class="event-detail mb-3">
              <strong>📍 {t(locale).where}:</strong>
              <div class="ms-4">{event.location}</div>
            </div>

            <!-- Google Maps iframe -->
            {#if mapUrl}
              <div class="map-container mt-3">
                <iframe
                  src={mapUrl}
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

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button 
            type="button" 
            class="btn btn-secondary" 
            onclick={onClose}
          >
            {t(locale).closeModal || 'Close'}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Ensure modal appears on top */
  .modal {
    z-index: 1055;
  }

  .modal-backdrop {
    z-index: 1050;
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
    color: #0d6efd;
    text-decoration: underline;
  }

  .event-description :global(a:hover) {
    color: #0a58ca;
  }

  .event-description :global(ul),
  .event-description :global(ol) {
    padding-left: 1.5rem;
    margin-bottom: 0.75rem;
  }

  .event-description :global(li) {
    margin-bottom: 0.25rem;
  }

  .event-detail {
    font-size: 1rem;
  }

  .event-detail strong {
    display: block;
    margin-bottom: 0.5rem;
  }

  .map-container {
    border-radius: 0.375rem;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .map-container iframe {
    display: block;
  }

  @media (max-width: 768px) {
    .modal-dialog {
      margin: 0.5rem;
    }

    .map-container iframe {
      height: 250px;
    }
  }
</style>

