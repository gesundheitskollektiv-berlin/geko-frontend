import { PUBLIC_STRAPI_URL } from '$env/static/public';
import { getValidLocale } from '$lib/helpers/translation';
import { error } from '@sveltejs/kit';

export async function load({ params, fetch }) {
  const locale = getValidLocale(params.locale);
  const { id } = params;

  try {
    // Fetch single service by documentId
    const response = await fetch(
      `${PUBLIC_STRAPI_URL}/api/geko-services/${id}?pLevel&locale=${locale}`
    );

    if (!response.ok) {
      throw error(404, 'Service not found');
    }

    const result = await response.json();

    return {
      service: result?.data || null,
      locale
    };
  } catch (err) {
    throw error(404, 'Service not found');
  }
}



