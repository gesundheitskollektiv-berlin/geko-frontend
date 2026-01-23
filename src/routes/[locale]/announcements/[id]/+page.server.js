import { PUBLIC_STRAPI_URL } from '$env/static/public';
import { getDataFromCMS } from '$lib/helpers/getDataFromCMS';
import { getValidLocale, PRERENDER_LOCALES } from '$lib/helpers/translation';
import { error } from '@sveltejs/kit';

export async function entries() {
	const entries = [];
	
	for (const locale of PRERENDER_LOCALES) {
		try {
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
    // Fetch single announcement by documentId
    const response = await fetch(
      `${PUBLIC_STRAPI_URL}/api/geko-announcements/${id}?pLevel&locale=${locale}`
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




