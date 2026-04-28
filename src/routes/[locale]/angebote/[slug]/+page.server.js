import { getDataFromCMS } from '$lib/helpers/getDataFromCMS';
import { getValidLocale, PRERENDER_LOCALES } from '$lib/helpers/translation';
import { error } from '@sveltejs/kit';

export async function entries() {
	const entries = [];
	
	for (const locale of PRERENDER_LOCALES) {
		try {
			const result = await getDataFromCMS('geko-services', locale);
			if (result?.data) {
				const bySlug = new Map();
				for (const service of result.data) {
					if (!service.slug) continue;
					const cur = bySlug.get(service.slug);
					if (!cur || (service.image && !cur.image)) {
						bySlug.set(service.slug, service);
					}
				}
				for (const service of bySlug.values()) {
					entries.push({ locale, slug: service.slug });
				}
			}
		} catch (err) {
			console.error(`Failed to fetch services for locale ${locale}:`, err);
		}
	}
	
	return entries;
}

export async function load({ params, fetch }) {
  const locale = getValidLocale(params.locale);
  const { slug } = params;

  const result = await getDataFromCMS('geko-services', locale, fetch);
  const matches = result?.data?.filter((s) => s.slug === slug) ?? [];
  const service =
    matches.find((s) => s.image) ??
    matches.find((s) => Array.isArray(s.teaser_text) && s.teaser_text.length > 0) ??
    matches[0];

  if (!service) {
    throw error(404, 'Service not found');
  }

  return { service, locale };
}




