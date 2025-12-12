import { PUBLIC_STRAPI_URL } from '$env/static/public';
import { getValidLocale } from '$lib/helpers/translation';
import { error } from '@sveltejs/kit';

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




