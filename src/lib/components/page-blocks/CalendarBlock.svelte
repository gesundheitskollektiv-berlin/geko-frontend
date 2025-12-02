<script>
	import { formatDateTime } from '$lib/helpers/formatDate';

	export let data = {};
	export let events = [];
	export let anchor = '';
	export let backgroundClass = 'bg-white';
</script>

<section class={`landing-block ${backgroundClass}`} id={anchor || undefined}>
	<div class="container">
		<div class="row mb-4">
			<div class="col-12 d-flex justify-content-between align-items-center gap-3">
				<div>
					{#if data?.title}
						<h2 class="fw-bold mb-0">{data.title}</h2>
					{/if}
					<p class="mb-0 text-muted">Aktuelle Veranstaltungen & Termine</p>
				</div>
				<a class="btn btn-outline-dark" href="#contact">Kalender abonnieren</a>
			</div>
		</div>

		<div class="row g-4">
			{#if events?.length}
				{#each events as event (event.id)}
					<div class="col-md-6 col-lg-4">
						<div class="card h-100 shadow-sm border-0">
							<div class="card-body">
								<p class="text-uppercase fw-semibold small text-secondary mb-2">
									{event?.is_event ? 'Event' : 'Aktuelles'}
								</p>
								<h3 class="h5">{event?.title}</h3>
								{#if event?.event_date}
									<p class="text-muted mb-1">{formatDateTime(event.event_date)}</p>
								{/if}
								{#if event?.where_address}
									<p class="mb-3 small text-muted">{event.where_address}</p>
								{/if}
								{#if event?.teaser_text}
									<p class="mb-0">{event.teaser_text}</p>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			{:else}
				<div class="col-12">
					<div class="alert alert-light border fw-semibold">Keine Termine veröffentlicht.</div>
				</div>
			{/if}
		</div>
	</div>
</section>

