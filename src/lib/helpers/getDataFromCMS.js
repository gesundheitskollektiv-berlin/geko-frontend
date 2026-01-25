import { PUBLIC_STRAPI_URL } from '$env/static/public';
import { building } from '$app/environment';
import { env } from '$env/dynamic/public';

// Cache for build-time request deduplication (only used during static builds)
const cache = new Map();

// Check if we should use cache (only during static builds, not in preview/dev mode)
const shouldUseCache = () => building && env.PUBLIC_PREVIEW_MODE !== 'true';

const fetchData = async (url, fetchFn = fetch) => {
  // Check cache first (only for build-time deduplication during static builds)
  if (shouldUseCache() && cache.has(url)) {
    return cache.get(url);
  }

  const response = await fetchFn(url);
  const data = await response.json();
  
  // Cache the response only during static builds
  if (shouldUseCache()) {
    cache.set(url, data);
  }
  
  return data;
};

export async function getDataFromCMS(path, locale, fetchFn = fetch) {
  // For collections that might have pagination, fetch all pages
  const shouldFetchAllPages = ['geko-announcements', 'geko-services', 'geko-jobs', 'geko-materials'];

  if (shouldFetchAllPages.includes(path)) {
    return await fetchAllPages(path, locale, fetchFn);
  }

  // Special handling for landing page to populate all relations including CTA and supporters
  if (path === 'geko-page-landing') {
    // Use pLevel for deep population which handles all nested relations including supporters images
    const queryUrl = `${PUBLIC_STRAPI_URL}/api/${path}?pLevel&locale=${locale}`;
    return await fetchData(queryUrl, fetchFn);
  }

  // For single entries or small collections, use original method
  const queryUrl = `${PUBLIC_STRAPI_URL}/api/${path}?pLevel&locale=${locale}`;
  return await fetchData(queryUrl, fetchFn);
}

async function fetchAllPages(path, locale, fetchFn = fetch) {
  let allData = [];
  let currentPage = 1;
  let totalPages = 1;

  do {
    const queryUrl = `${PUBLIC_STRAPI_URL}/api/${path}?pLevel&locale=${locale}&pagination[page]=${currentPage}&pagination[pageSize]=100`;
    const result = await fetchData(queryUrl, fetchFn);

    if (result?.data) {
      allData = allData.concat(result.data);

      if (result.meta?.pagination) {
        totalPages = result.meta.pagination.pageCount;
      }
    }

    currentPage++;
  } while (currentPage <= totalPages);

  // Return in the same format as the original API
  return {
    data: allData,
    meta: {
      pagination: {
        page: 1,
        pageSize: allData.length,
        pageCount: 1,
        total: allData.length
      }
    }
  };
}

export async function getDetailsDataFromCMS(path, locale, slug, fetchFn = fetch) {
  const queryUrl = `${PUBLIC_STRAPI_URL}/api/${path}?filters[slug][$eq]=${slug}&locale=${locale}&pLevel`;
  return await fetchData(queryUrl, fetchFn);
}
