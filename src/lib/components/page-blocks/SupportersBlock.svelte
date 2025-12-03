<script>
  import Supporters from '$lib/components/Supporters.svelte';
  import { slugify } from '$lib/helpers/landingBlocks';
  import { t } from '$lib/helpers/translation';

  export let data = {};
  export let locale = 'de';

  const supporters = data?.supporters ?? [];
  $: backgroundClass = data?.background_color ? `bg-geko-${data.background_color}` : 'bg-geko-white';
  $: sectionId = data?.navbar_link_title ? slugify(data.navbar_link_title) : 'supporters';
</script>

<section id={sectionId} class={`${backgroundClass} footer`}>
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-lg-10 col-md-10 mt-5">
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


