import { getDataFromCMS } from '$lib/helpers/getDataFromCMS';
import { getValidLocale } from '$lib/helpers/translation';

export async function load({ params }) {
  // Validate and get locale
  const locale = getValidLocale(params.locale);

  const data = {};

  // Define all endpoints to fetch from Strapi
  const endpoints = [
    'geko-page-landing',
    'geko-page-about',
    'geko-page-datenschutzerklaerung',
    'geko-page-impressum',
    'geko-meta',
    'geko-announcements',
    'geko-services'
  ];

  // Fetch data from all endpoints
  for (const endpoint of endpoints) {
    data[endpoint] = await getDataFromCMS(endpoint, locale);
  }

  // Add locale to data
  data['locale'] = locale;

  return data;
}
