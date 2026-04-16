import { getDataFromCMS } from '$lib/helpers/getDataFromCMS';
import { getStrapiPublicUrl } from '$lib/helpers/strapiPublicUrl';
import { getValidLocale, PRERENDER_LOCALES } from '$lib/helpers/translation';
import { error } from '@sveltejs/kit';

export async function entries() {
	const entries = [];
	
	for (const locale of PRERENDER_LOCALES) {
		try {
			// entries() doesn't receive fetch, so use global fetch
			const result = await getDataFromCMS('geko-announcements', locale);
			if (result?.data) {
				for (const announcement of result.data) {
					if (announcement.documentId) {
						entries.push({ locale, id: announcement.documentId });
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
  const { id } = params;

  try {
    const base = getStrapiPublicUrl();
    if (!base) {
      throw error(500, 'CMS URL not configured');
    }
    const response = await fetch(
      `${base}/api/geko-announcements/${id}?pLevel&locale=${locale}`
    );

    if (!response.ok) {
      throw error(404, 'Announcement not found');
    }

    const result = await response.json();

    return {
      announcement: result?.data || null,
      locale
    };
  } catch (err) {
    throw error(404, 'Announcement not found');
  }
}




