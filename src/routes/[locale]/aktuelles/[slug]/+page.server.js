import { getDataFromCMS, getDetailsDataFromCMS } from '$lib/helpers/getDataFromCMS';
import { getValidLocale, PRERENDER_LOCALES } from '$lib/helpers/translation';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

export async function entries() {
	// Skip entries in preview mode (SSR) - pages are rendered on-demand
	if (env.PUBLIC_PREVIEW_MODE === 'true') {
		return [];
	}
	
	const entries = [];
	
	for (const locale of PRERENDER_LOCALES) {
		try {
			const result = await getDataFromCMS('geko-announcements', locale);
			if (result?.data) {
				for (const announcement of result.data) {
					if (announcement.slug) {
						entries.push({ locale, slug: announcement.slug });
					}
				}
			}
		} catch (err) {
			console.error(`Failed to fetch announcements for locale ${locale}:`, err);
		}
	}
	
	return entries;
}

export async function load({ params, fetch }) {
  const locale = getValidLocale(params.locale);
  const { slug } = params;

  try {
    const result = await getDetailsDataFromCMS('geko-announcements', locale, slug, fetch);

    if (!result?.data?.[0]) {
      throw error(404, 'Announcement not found');
    }

    return {
      announcement: result.data[0],
      locale
    };
  } catch (err) {
    throw error(404, 'Announcement not found');
  }
}




