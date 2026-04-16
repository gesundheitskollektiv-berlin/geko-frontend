import { building } from '$app/environment';
import { env } from '$env/dynamic/public';
import { getStrapiPublicUrl } from '$lib/helpers/strapiPublicUrl';

const cache = new Map();

const shouldUseCache = () => building && env.PUBLIC_PREVIEW_MODE !== 'true';

const fetchData = async (url, fetchFn = fetch) => {
  if (shouldUseCache() && cache.has(url)) {
    return cache.get(url);
  }

  const response = await fetchFn(url);
  const data = await response.json();

  if (shouldUseCache()) {
    cache.set(url, data);
  }

  return data;
};

export async function getDataFromCMS(path, locale, fetchFn = fetch) {
  const base = getStrapiPublicUrl();
  if (!base) {
    console.error('[getDataFromCMS] PUBLIC_STRAPI_URL is missing');
    return { data: null };
  }

  const shouldFetchAllPages = ['geko-announcements', 'geko-services', 'geko-jobs', 'geko-materials'];

  if (shouldFetchAllPages.includes(path)) {
    return await fetchAllPages(path, locale, fetchFn, base);
  }

  const queryUrl = `${base}/api/${path}?pLevel&locale=${locale}`;
  return await fetchData(queryUrl, fetchFn);
}

async function fetchAllPages(path, locale, fetchFn = fetch, baseUrl = getStrapiPublicUrl()) {
  let allData = [];
  let currentPage = 1;
  let totalPages = 1;

  do {
    const queryUrl = `${baseUrl}/api/${path}?pLevel&locale=${locale}&pagination[page]=${currentPage}&pagination[pageSize]=100`;
    const result = await fetchData(queryUrl, fetchFn);

    if (result?.data) {
      allData = allData.concat(result.data);

      if (result.meta?.pagination) {
        totalPages = result.meta.pagination.pageCount;
      }
    }

    currentPage++;
  } while (currentPage <= totalPages);

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
  const base = getStrapiPublicUrl();
  if (!base) {
    console.error('[getDetailsDataFromCMS] PUBLIC_STRAPI_URL is missing');
    return { data: null };
  }
  const queryUrl = `${base}/api/${path}?filters[slug][$eq]=${slug}&locale=${locale}&pLevel`;
  return await fetchData(queryUrl, fetchFn);
}
