import { getDataFromCMS, getDetailsDataFromCMS } from '$lib/helpers/getDataFromCMS';
import { getValidLocale, PRERENDER_LOCALES } from '$lib/helpers/translation';
import { error } from '@sveltejs/kit';

export async function entries() {
	const entries = [];
	
	for (const locale of PRERENDER_LOCALES) {
		try {
			const result = await getDataFromCMS('geko-services', locale);
			if (result?.data) {
				for (const service of result.data) {
					if (service.slug) {
						entries.push({ locale, id: service.slug });
					}
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
  const { id: slug } = params;

  try {
    const result = await getDetailsDataFromCMS('geko-services', locale, slug);

    if (!result?.data?.[0]) {
      throw error(404, 'Service not found');
    }

    return {
      service: result.data[0],
      locale
    };
  } catch (err) {
    throw error(404, 'Service not found');
  }
}




