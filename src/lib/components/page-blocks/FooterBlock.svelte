<script>
  export let data = {};
  export let meta = {};
  export let anchor = '';
  export let backgroundClass = 'bg-white';
</script>

<footer class={`landing-block ${backgroundClass}`} id={anchor || undefined}>
  <div class="container">
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
</footer>
