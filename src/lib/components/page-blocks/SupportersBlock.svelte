<script>
  import { page } from '$app/stores';
  import Supporters from '$lib/components/Supporters.svelte';
  import { t } from '$lib/helpers/translation';

  let { locale = 'de', supporters } = $props();

  const allSupporters = $derived.by(
    () => $page.data['geko-supporters']?.data ?? []
  );

  const supportersToShow = $derived.by(() => {
    if (Array.isArray(supporters) && supporters.length > 0) {
      // Strapi v5 REST may expose documentId vs id inconsistently across relations —
      // index both so we still resolve logos from the layout-loaded list.
      const byAnyId = new Map();
      for (const s of allSupporters) {
        if (s?.id != null) byAnyId.set(s.id, s);
        if (s?.documentId != null) byAnyId.set(s.documentId, s);
      }
      const selKey = (r) => r?.id ?? r?.documentId;
      const resolved = supporters.map((r) => byAnyId.get(selKey(r))).filter(Boolean);
      // If CMS sent relation rows we couldn't match, fall back to full list rather than hiding the section.
      return resolved.length > 0 ? resolved : allSupporters;
    }
    return allSupporters;
  });
</script>

{#if supportersToShow.length}
  <section id="supporters" class="bg-geko-white footer">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-10 col-md-11 col-sm-11 mt-5">
          <div class="row align-items-center">
            <div class="col-md-12">
              <h4>{t(locale).supportedBy}</h4>

              <Supporters supporters={supportersToShow} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
{/if}
