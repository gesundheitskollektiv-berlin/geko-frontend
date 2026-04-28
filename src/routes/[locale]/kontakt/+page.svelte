<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import SubpageContent from '$lib/components/SubpageContent.svelte';
  import NewsletterBlock from '$lib/components/page-blocks/NewsletterBlock.svelte';
  import FooterBlock from '$lib/components/page-blocks/FooterBlock.svelte';
  import SupportersBlock from '$lib/components/page-blocks/SupportersBlock.svelte';
  import Breadcrumb from '$lib/components/Breadcrumb.svelte';
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

  let showGoogleMap = $state(false);

  const toggleMap = () => (showGoogleMap = !showGoogleMap);
</script>

<SubpageContent page={kontaktPage} showBody={false}>
  {#snippet breadcrumb()}
    <Breadcrumb
      items={[
        { label: t(locale).home, href: `/${locale}` },
        { label: t(locale).kontakt },
      ]}
    />
  {/snippet}
</SubpageContent>

{#if kontaktPage?.body}
  <section class="bg-geko-white">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-10 col-md-11 col-sm-11">
          <div class="row g-4">
            <div class="col-md-6">
              <div id="map-image" class={showGoogleMap ? 'd-none' : ''}>
                <div class="image-wrapper">
                  <img
                    src="/assets/img/Geko_einfacheKarte_gross.png"
                    alt="Einfache Karte"
                    class="img-fluid geko-image-rounded"
                  />
                </div>
              </div>

              <div id="google-map" class={showGoogleMap ? '' : 'd-none'}>
                <div class="ratio ratio-16x9">
                  <iframe
                    src={`https://maps.google.com/maps?width=100%25&height=600&hl=${locale}&q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=B&output=embed`}
                    allowfullscreen
                    loading="lazy"
                    title="Google Maps"
                  ></iframe>
                </div>
              </div>

              <div class="mt-5 mb-3" class:d-none={showGoogleMap}>
                <button
                  type="button"
                  class="btn-geko bg-geko-yellow text-black"
                  onclick={toggleMap}
                >
                  Zeige Google-Karte
                </button>
              </div>

              <div class="mt-5 mb-3" class:d-none={!showGoogleMap}>
                <button
                  type="button"
                  class="btn-geko bg-geko-yellow text-black"
                  onclick={toggleMap}
                >
                  Zeige einfache Karte
                </button>
              </div>
            </div>

            <div class="col-md-6">
              <div class="rich-text body-content">
                {@html resolveRichText(kontaktPage.body)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
{/if}

<NewsletterBlock {locale} />

<FooterBlock {meta} {locale} />

<SupportersBlock {locale} />

<style>
  .image-wrapper {
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    display: block;
  }

  .image-wrapper img {
    max-width: 100% !important;
    width: 100% !important;
    height: auto !important;
    display: block;
    box-sizing: border-box;
  }

  :global(.geko-image-rounded) {
    border-radius: 0.5rem;
  }

  .body-content :global(a) {
    display: inline-flex;
    align-items: center;
    padding: 12px 20px;
    background-color: var(--bs-geko-yellow);
    color: #000;
    border: 2px solid #000;
    border-radius: 28px;
    font-family: "CerebriSansPro", system-ui, sans-serif;
    font-weight: 700;
    font-size: 1.25rem;
    text-decoration: none;
    margin: 0.5rem 0.25rem 0.5rem 0;
    transition: all 0.2s ease-in-out;
  }

  .body-content :global(a:hover) {
    color: #000;
    box-shadow: -5px 5px 15px 0px rgba(0, 0, 0, 0.25);
    text-decoration: none;
  }
</style>
