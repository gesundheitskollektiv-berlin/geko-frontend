<script>
	import { PUBLIC_STRAPI_URL } from '$env/static/public';

	export let asset = null;
	export let alt = '';
	export let className = '';
	export let width;
	export let height;
	export let loading = 'lazy';

	const getSrc = () => {
		if (!asset) return '';
		if (asset.url?.startsWith('http')) return asset.url;
		return `${PUBLIC_STRAPI_URL}${asset.url}`;
	};

	$: resolvedAlt = alt || asset?.alternativeText || '';
</script>

{#if asset}
	<img
		src={getSrc()}
		alt={resolvedAlt}
		class={className}
		width={width ?? asset?.width}
		height={height ?? asset?.height}
		loading={loading}
	/>
{/if}

