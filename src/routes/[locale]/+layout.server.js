import { env } from '$env/dynamic/private';
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
    'geko-page-kontakt',
    'geko-page-angebote',
    'geko-page-datenschutzerklaerung',
    'geko-page-impressum',
    'geko-meta',
    'geko-announcements',
    'geko-services',
    'geko-materials',
    'geko-supporters'
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

  const parsedThresh = parseInt(env.NEWS_LENGTH_THRESH ?? '150', 10);
  data['newsLengthThresh'] = Number.isFinite(parsedThresh) ? parsedThresh : 150;

  return data;
}
