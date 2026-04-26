<script>
  import { resolveRichText } from '$lib/helpers/richTextResolver';
  import { slugify } from '$lib/helpers/landingBlocks';

  let { data = {} } = $props();

  const backgroundClass = $derived(data?.background_color ? `bg-geko-${data.background_color}` : 'bg-geko-white');
  const sectionId = $derived(data?.navbar_link_title ? slugify(data.navbar_link_title) : 'neighbours');
</script>

<section id={sectionId} class={backgroundClass}>
	<div class="container">
		<div class="row justify-content-center">
			<div class="col-lg-8 col-md-9 col-sm-11 my-5">
					<h2 class="mb-5">{data.title}</h2>
					<div class="neighbours-content">
						{@html resolveRichText(data.content)}
					</div>
			</div>
		</div>
	</div>
</section>

<style>
	.neighbours-content :global(a) {
		display: inline-block;
		border-radius: 25px;
		padding: 0.25rem 1.5rem;
		font-family: "CerebriSansPro", system-ui, sans-serif;
		font-weight: 700;
		font-size: 1.25rem;
		transition: all 0.2s ease-in-out;
		border: none;
		text-align: center;
		text-decoration: none;
		cursor: pointer;
		background-color: #58a9ff;
		color: white;
	}

	.neighbours-content :global(a:hover) {
		opacity: 0.85;
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}
</style>

