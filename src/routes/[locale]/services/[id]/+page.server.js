import { getDetailsDataFromCMS } from '$lib/helpers/getDataFromCMS';
import { getValidLocale } from '$lib/helpers/translation';
import { error } from '@sveltejs/kit';

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




