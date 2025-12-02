<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';

  export let data = {};
  export let services = [];
  export let anchor = '';
  export let backgroundClass = 'bg-white';
</script>

<section id={anchor || undefined}>
  <div class={`py-5 ${backgroundClass}`}>
    <div class="container" id="services">
      <div class="row">
        <div class="col-12">
          {#if data?.title}
            <h2 class="pt-3 pt-md-5 pt-lg-9 pb-3">{data.title}</h2>
          {/if}
        </div>
      </div>

      <div class="card shadow-none">
        <div class={`card-body p-4 ${backgroundClass}`}>
          <div class="row row-cols-1">
            {#if services?.length}
              {#each services as service (service.id)}
                <div class="col">
                  {#if service?.project_url}
                    <a
                      href={service.project_url}
                      class="text-decoration-none"
                      target={service.external_link_only ? '_blank' : '_self'}
                      rel={service.external_link_only ? 'noreferrer' : undefined}
                    >
                      <div class="card service-card">
                        <div class="card-body d-flex align-items-center px-md-3 px-0">
                          {#if service?.icon_name}
                            <img
                              src={`/assets/img/icons/${service.icon_name}.png`}
                              alt={service.title}
                              class="me-0 me-md-3"
                              loading="lazy"
                            />
                          {/if}
                          <p class="sm-fs-ml md-fs-l l-fs-xl my-0">{service.title}</p>
                        </div>
                      </div>
                    </a>
                  {:else}
                    <div class="card service-card">
                      <div class="card-body d-flex align-items-center px-md-3 px-0">
                        {#if service?.icon_name}
                          <img
                            src={`/assets/img/icons/${service.icon_name}.png`}
                            alt={service.title}
                            class="me-0 me-md-3"
                            loading="lazy"
                          />
                        {/if}
                        <p class="sm-fs-ml md-fs-l l-fs-xl my-0">{service.title}</p>
                      </div>
                    </div>
                  {/if}
                </div>
              {/each}
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
