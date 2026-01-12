<script>
  let { data = {}, locale = 'de' } = $props();
  
  // Access the populated geko_cta relation
  const cta = $derived(data?.geko_cta || {});
</script>

<section class="bg-geko-red text-white py-5">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-9 col-sm-11">
        <div class="d-flex flex-column flex-md-row align-items-center justify-content-md-between text-center text-md-start">
          <div class="flex-grow-1 mb-3 mb-md-0">
            {#if cta.call_text}
              <p class="mb-0 fs-20 fw-bold">{cta.call_text}</p>
            {/if}
          </div>
          <div class="ms-md-4">
            {#if cta.link && cta.link_text}
              <a href={cta.link} class="btn-geko bg-geko-blue text-white">
                {cta.link_text}
              </a>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
