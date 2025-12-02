<script>
	import { resolveRichText } from '$lib/helpers/richTextResolver';

	export let data = {};
	export let meta = {};
	export let anchor = '';
	export let backgroundClass = 'bg-white';

	$: mapQuery = encodeURIComponent(
		`${meta?.street ?? ''}, ${meta?.postal ?? ''} ${meta?.city ?? ''}`.trim()
	);
</script>

<section class={`landing-block ${backgroundClass}`} id={anchor || undefined}>
	<div class="container">
		{#if data?.title}
			<h2 class="fw-bold mb-4">{data.title}</h2>
		{/if}

		<div class="row g-4 align-items-start">
			<div class="col-lg-5">
				<div class="card shadow-sm border-0">
					<div class="card-body">
						<p class="text-uppercase small fw-semibold text-muted mb-2">Kontakt</p>
						<p class="mb-1 fw-semibold">{meta?.company}</p>
						<p class="mb-1">{meta?.street}</p>
						<p class="mb-3">
							{meta?.postal} {meta?.city}
						</p>
						{#if meta?.phone}
							<p class="mb-1">
								Telefon:
								<a href={`tel:${meta.phone}`} class="link-dark">{meta.phone}</a>
							</p>
						{/if}
						{#if meta?.email}
							<p class="mb-1">
								E-Mail:
								<a href={`mailto:${meta.email}`} class="link-dark">{meta.email}</a>
							</p>
						{/if}
						{#if meta?.press_email}
							<p class="mb-1">
								Presse:
								<a href={`mailto:${meta.press_email}`} class="link-dark">
									{meta.press_email}
								</a>
							</p>
						{/if}
						<div class="d-flex gap-3 pt-3">
							{#if meta?.facebook}
								<a
									href={meta.facebook}
									target="_blank"
									rel="noreferrer"
									class="text-dark"
									aria-label="Facebook"
								>
									<i class="fa-brands fa-facebook fa-lg"></i>
								</a>
							{/if}
							{#if meta?.instagram}
								<a
									href={meta.instagram}
									target="_blank"
									rel="noreferrer"
									class="text-dark"
									aria-label="Instagram"
								>
									<i class="fa-brands fa-instagram fa-lg"></i>
								</a>
							{/if}
							{#if meta?.twitter}
								<a
									href={meta.twitter}
									target="_blank"
									rel="noreferrer"
									class="text-dark"
									aria-label="X (Twitter)"
								>
									<i class="fa-brands fa-x-twitter fa-lg"></i>
								</a>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<div class="col-lg-7">
				<div class="ratio ratio-16x9 rounded-4 overflow-hidden shadow-sm mb-4">
					<iframe
						src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
						loading="lazy"
						referrerpolicy="no-referrer-when-downgrade"
						title="Standort des Gesundheitskollektiv Berlin"
					></iframe>
				</div>

				{#if data?.content}
					<div class="rich-text">
						{@html resolveRichText(data.content)}
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

