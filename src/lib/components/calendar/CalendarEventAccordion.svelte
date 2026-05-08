<script>
  import { browser } from '$app/environment';
  import { Marked } from 'marked';
  import DOMPurify from 'dompurify';
  import { t } from '$lib/helpers/translation';
  import './calendar.scss';

  let { event, locale = 'de', isExpanded = false } = $props();

  /** @param {string} s */
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /** @param {string} s */
  function escapeAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;');
  }

  const parsedDescription = $derived.by(() => {
    if (!browser || !isExpanded || !event?.description) return '';

    const readMoreLabel = t(locale).readMore;
    const md = new Marked();
    md.use({
      renderer: {
        /** @param {{ href?: string; title?: string | null }} token */
        link(token) {
          const href = token.href ?? '#';
          const titleAttr =
            token.title != null && token.title !== ''
              ? ` title="${escapeAttr(token.title)}"`
              : '';
          const label = escapeHtml(readMoreLabel);
          return (
            `<a class="event-readmore-btn" href="${escapeAttr(href)}"${titleAttr} target="_blank" rel="noopener noreferrer">` +
            `<span>${label}</span>` +
            `<i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>` +
            `</a>`
          );
        },
      },
    });

    try {
      const rawHtml = md.parse(event.description);
      return DOMPurify.sanitize(rawHtml, { ADD_ATTR: ['target', 'rel'] });
    } catch (error) {
      console.error('Error parsing description:', error);
      return '';
    }
  });

  const mapUrl = $derived.by(() => {
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
          {@html parsedDescription}
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
      {#if mapUrl}
        <div class="map-container mt-3">
          <iframe
            src={mapUrl}
            width="100%"
            height="300"
            class="map-iframe"
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
    background-color: var(--calendar-bg-light);
    animation: slideDown var(--calendar-transition-standard);
    border-left: 3px solid var(--calendar-border-gray);
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
    /* Inherit font-size from body text - no explicit size needed */
    display: flex;
    align-items: flex-start;
  }

  .event-detail i {
    flex-shrink: 0;
    color: var(--calendar-text-muted);
    /* Inherit font-size from parent */
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

  .event-description :global(.event-readmore-btn) {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    margin-top: 0.35rem;
    margin-bottom: 0.35rem;
    background: #000;
    color: #fff;
    border-radius: 999px;
    text-decoration: none;
    font-weight: 600;
    transition: opacity var(--calendar-transition-standard);
  }

  .event-description :global(.event-readmore-btn:hover) {
    opacity: 0.85;
    color: #fff;
  }

  .event-description :global(.event-readmore-btn span) {
    flex-shrink: 0;
  }

  .event-description :global(.event-readmore-btn i) {
    font-size: 0.78rem;
    margin-top: 0;
    color: inherit;
  }

  .event-description :global(a:not(.event-readmore-btn)) {
    color: var(--calendar-primary);
    text-decoration: underline;
  }

  .event-description :global(a:not(.event-readmore-btn):hover) {
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

  .map-iframe {
    border: 0;
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
