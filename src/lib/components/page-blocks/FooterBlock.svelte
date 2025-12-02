<script>
  export let data = {};
  export let meta = {};

  $: backgroundClass = data?.background_color ? `bg-geko-${data.background_color}` : 'bg-geko-white';
</script>

<footer id="footer" class={backgroundClass}>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-7 col-md-10">
          <div class="row g-4 align-items-center">
            <div class="col-lg-8">
              <h3 class="fw-bold mb-2">{meta?.company ?? 'Gesundheitskollektiv Berlin e.V.'}</h3>
              <p class="mb-2">
                {meta?.street} · {meta?.postal}
                {meta?.city}
              </p>
              <p class="mb-0">
                {#if meta?.email}
                  <a class="link-dark me-3" href={`mailto:${meta.email}`}>{meta.email}</a>
                {/if}
                {#if meta?.phone}
                  <a class="link-dark" href={`tel:${meta.phone}`}>{meta.phone}</a>
                {/if}
              </p>
            </div>
            <div class="col-lg-4 text-lg-end">
              <p class="small text-muted mb-1">
                © {new Date().getFullYear()} Gesundheitskollektiv Berlin
              </p>
              <p class="small text-muted mb-0">Gemeinsam für ein solidarisches Gesundheitssystem.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
</footer>
