import { getDataFromCMS } from '$lib/helpers/getDataFromCMS';
import { getValidLocale } from '$lib/helpers/translation';

export async function load({ params, fetch }) {
  // Validate and get locale
  const locale = getValidLocale(params.locale);

  const data = {};

  // Define all endpoints to fetch from Strapi
  const endpoints = [
    'geko-page-landing',
    'geko-page-about',
    'geko-page-support',
    'geko-page-datenschutzerklaerung',
    'geko-page-impressum',
    'geko-meta',
    'geko-announcements',
    'geko-services',
    'geko-jobs',
    'geko-materials'
  ];

  for (const endpoint of endpoints) {
    try {
      data[endpoint] = await getDataFromCMS(endpoint, locale, fetch);
    } catch (err) {
      console.error(`[layout.server] Failed to fetch ${endpoint}:`, err);
      data[endpoint] = { data: null };
    }
  }

  // Add locale to data
  data['locale'] = locale;

  return data;
}
