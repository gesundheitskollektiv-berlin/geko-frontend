<script>
  import Newsletter from '$lib/components/Newsletter.svelte';

  let { locale = 'de' } = $props();
</script>

<section id="newsletter" class="newsletter-block pt-7 pb-0">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10 offset-lg-1 col-md-11 col-sm-11">
        <Newsletter {locale} />
      </div>
    </div>
  </div>
</section>

<style>
  .newsletter-block {
    background: linear-gradient(to bottom, var(--bs-geko-white) 0%, var(--bs-geko-lilac) 100%);
  }
</style>
