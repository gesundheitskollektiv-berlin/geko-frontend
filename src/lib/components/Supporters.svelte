<script>
	import Supporter from '$lib/components/Supporter.svelte';

	let { supporters = [] } = $props();
</script>

<div class="row mb-7">
	{#if supporters?.length}
		{#each supporters as supporter (supporter.id)}
			<Supporter {supporter} />
		{/each}
	{:else}
		<div class="col-12">
			<p class="text-muted">No supporters available.</p>
		</div>
	{/if}
</div>

