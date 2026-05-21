<script>
  import { onMount } from 'svelte';
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import StrapiImage from '$lib/components/StrapiImage.svelte';
  import RtlScope from '$lib/components/RtlScope.svelte';
  import Breadcrumb from '$lib/components/Breadcrumb.svelte';
  import NewsletterBlock from '$lib/components/page-blocks/NewsletterBlock.svelte';
  import FooterBlock from '$lib/components/page-blocks/FooterBlock.svelte';
  import SupportersBlock from '$lib/components/page-blocks/SupportersBlock.svelte';
  import { t } from '$lib/helpers/translation';

  let { data } = $props();

  const kontaktPage = $derived(data['geko-page-kontakt']?.data ?? {});
  const locale = $derived(data.locale);
  const meta = $derived(data['geko-meta']?.data ?? {});

  const mapQuery = $derived(
    encodeURIComponent(
      `${meta?.street ?? ''}, ${meta?.postal ?? ''} ${meta?.city ?? ''}`.trim()
    )
  );

  const slides = $derived.by(() => {
    const base = [
      {
        kind: 'image',
        src: '/assets/img/Geko_einfacheKarte_gross.png',
        alt: t(locale).simpleMapAlt,
      },
      {
        kind: 'iframe',
        src: `https://maps.google.com/maps?width=100%25&height=600&hl=${locale}&q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=B&output=embed`,
      },
    ];
    if (kontaktPage?.header_image) {
      base.push({
        kind: 'strapi',
        asset: kontaktPage.header_image,
        alt: kontaktPage.header_image?.alternativeText || kontaktPage.title,
      });
    }
    return base;
  });

  let activeSlide = $state(0);

  /** @type {ReturnType<typeof setInterval> | undefined} */
  let intervalId;

  function next() {
    const len = slides.length;
    if (len === 0) return;
    activeSlide = (activeSlide + 1) % len;
  }

  function prev() {
    const len = slides.length;
    if (len === 0) return;
    activeSlide = (activeSlide - 1 + len) % len;
  }

  function restart() {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(next, 5000);
  }

  function pause() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
  }

  /** @param {number} i */
  function go(i) {
    activeSlide = i;
    restart();
  }

  $effect(() => {
    const len = slides.length;
    if (len > 0 && activeSlide >= len) {
      activeSlide = len - 1;
    }
  });

  onMount(() => {
    restart();
    return () => pause();
  });
</script>

<RtlScope {locale}>
  <section class="hero-section bg-geko-white">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-10 col-md-11 col-sm-11">
          <Breadcrumb
            items={[
              { label: t(locale).home, href: `/${locale}` },
              { label: t(locale).kontakt },
            ]}
          />

          <div class="row">
            <div class="col-12">
              <h1 class="mb-3 mb-lg-5">{kontaktPage.title}</h1>
            </div>
          </div>

          <div class="row g-4 align-items-start">
            <div class="col-md-6">
              {#if kontaktPage.intro_text}
                <div class="rich-text support-content">
                  {@html resolveRichText(kontaktPage.intro_text)}
                </div>
              {/if}
            </div>

            <div class="col-md-6">
              <div
                class="carousel slide carousel-fade kontakt-carousel"
                onmouseenter={pause}
                onmouseleave={restart}
                onfocusin={pause}
                onfocusout={restart}
                role="region"
                aria-roledescription="carousel"
              >
                <div class="carousel-indicators">
                  {#each slides as _, i}
                    <button
                      type="button"
                      class:active={i === activeSlide}
                      aria-current={i === activeSlide ? 'true' : undefined}
                      aria-label={`${i + 1}`}
                      onclick={() => go(i)}
                    ></button>
                  {/each}
                </div>

                <div class="carousel-inner">
                  {#each slides as slide, i}
                    <div class="carousel-item" class:active={i === activeSlide}>
                      {#if slide.kind === 'image'}
                        <img
                          src={slide.src}
                          alt={slide.alt}
                          class="kontakt-carousel__media geko-image-rounded"
                        />
                      {:else if slide.kind === 'iframe'}
                        <iframe
                          src={slide.src}
                          class="kontakt-carousel__media"
                          title="Google Maps"
                          allowfullscreen
                          loading="lazy"
                        ></iframe>
                      {:else if slide.kind === 'strapi'}
                        <StrapiImage
                          asset={slide.asset}
                          alt={slide.alt}
                          class="kontakt-carousel__media geko-image-rounded"
                        />
                      {/if}
                    </div>
                  {/each}
                </div>

                <button
                  class="carousel-control-prev"
                  type="button"
                  onclick={() => {
                    prev();
                    restart();
                  }}
                >
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">{t(locale).previous}</span>
                </button>
                <button
                  class="carousel-control-next"
                  type="button"
                  onclick={() => {
                    next();
                    restart();
                  }}
                >
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">{t(locale).next}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {#if kontaktPage?.body}
    <section class="bg-geko-white">
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-10 col-md-11 col-sm-11">
            <div class="rich-text body-content">
              {@html resolveRichText(kontaktPage.body)}
            </div>
          </div>
        </div>
      </div>
    </section>
  {/if}
</RtlScope>

<NewsletterBlock {locale} />

<FooterBlock {meta} {locale} />

<SupportersBlock {locale} />

<style>
  .hero-section {
    position: relative;
    z-index: 1;
    box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.1);
  }

  .support-content :global(a) {
    text-decoration: underline;
    color: #000;
    font-size: 1.25rem;
    font-weight: 400;
  }

  .support-content :global(a:hover) {
    opacity: 0.85;
  }

  .kontakt-carousel {
    position: relative;
    aspect-ratio: 4 / 3;
    border-radius: 0.5rem;
    overflow: hidden;
    background: #000;
  }

  .kontakt-carousel .carousel-inner {
    height: 100%;
  }

  .kontakt-carousel .carousel-item {
    height: 100%;
  }

  .kontakt-carousel :global(.kontakt-carousel__media) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: 0;
    display: block;
  }

  .kontakt-carousel .carousel-control-prev,
  .kontakt-carousel .carousel-control-next {
    width: auto;
    padding: 0 0.65rem;
    opacity: 1;
    filter: none;
    z-index: 4;
    background-image: none;
  }

  .kontakt-carousel .carousel-control-prev {
    left: 0.5rem;
  }

  .kontakt-carousel .carousel-control-next {
    right: 0.5rem;
  }

  .kontakt-carousel .carousel-control-prev:hover,
  .kontakt-carousel .carousel-control-next:hover,
  .kontakt-carousel .carousel-control-prev:focus,
  .kontakt-carousel .carousel-control-next:focus {
    opacity: 1;
  }

  .kontakt-carousel .carousel-control-prev-icon,
  .kontakt-carousel .carousel-control-next-icon {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    background-color: rgba(46, 46, 46, 0.88);
    background-size: 45% 45%;
    background-position: center;
    background-repeat: no-repeat;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
    transition: background-color 0.15s ease;
  }

  .kontakt-carousel .carousel-control-prev:hover .carousel-control-prev-icon,
  .kontakt-carousel .carousel-control-next:hover .carousel-control-next-icon,
  .kontakt-carousel .carousel-control-prev:focus .carousel-control-prev-icon,
  .kontakt-carousel .carousel-control-next:focus .carousel-control-next-icon {
    background-color: rgba(62, 62, 65, 0.95);
  }

  :global(.geko-image-rounded) {
    border-radius: 0.5rem;
  }

  .body-content :global(a) {
    color: #000;
    text-decoration: underline;
    font-weight: 400;
  }

  .body-content :global(a:hover) {
    opacity: 0.75;
  }

  .body-content :global(h1),
  .body-content :global(h2),
  .body-content :global(h3),
  .body-content :global(h4) {
    margin-top: 2rem;
  }

  .support-content :global(h4),
  .body-content :global(h4) {
    font-size: 1.5rem;
  }
</style>
