<script>
  import { page } from '$app/stores';
  import Supporters from '$lib/components/Supporters.svelte';
  import { t } from '$lib/helpers/translation';

  let { locale = 'de' } = $props();

  const supporters = $derived($page.data['geko-supporters']?.data ?? []);
</script>

{#if supporters.length}
  <section id="supporters" class="bg-geko-white footer">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-10 col-md-11 col-sm-11 mt-5">
          <div class="row align-items-center">
            <div class="col-md-12">
              <h4>{t(locale).supportedBy}</h4>

              <Supporters {supporters} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
{/if}
