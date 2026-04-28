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

  const shouldFetchAllPages = ['geko-announcements', 'geko-services', 'geko-jobs', 'geko-materials', 'geko-supporters'];

  if (shouldFetchAllPages.includes(path)) {
    return await fetchAllPages(path, locale, fetchFn, base);
  }

  // pLevel (strapi-v5-plugin-populate-deep) doesn't populate media fields on
  // these single-types reliably, so fall back to populate=* which does.
  const populateParam = useStarPopulate.includes(path) ? 'populate=*' : 'pLevel';

  const queryUrl = `${base}/api/${path}?${populateParam}&locale=${locale}`;
  return await fetchData(queryUrl, fetchFn);
}

// Collections / single-types whose media fields aren't populated by pLevel —
// we use populate=* for those.
const useStarPopulate = [
  'geko-page-about',
  'geko-page-support',
  'geko-page-kontakt',
  'geko-page-angebote',
  'geko-materials',
  'geko-supporters',
  'geko-services'
];

// Per-path caps and server-side sorts. Only listed paths get the treatment;
// everything else goes through fetchAllPages untouched.
const maxItemsByPath = { 'geko-announcements': 500 };
const sortByPath = { 'geko-announcements': 'publish_date:desc' };

async function fetchAllPages(path, locale, fetchFn = fetch, baseUrl = getStrapiPublicUrl()) {
  let allData = [];
  let currentPage = 1;
  let totalPages = 1;

  const populateParam = useStarPopulate.includes(path) ? 'populate=*' : 'pLevel';
  const maxItems = maxItemsByPath[path];
  const sort = sortByPath[path];
  const sortParam = sort ? `&sort[0]=${sort}` : '';

  do {
    const queryUrl = `${baseUrl}/api/${path}?${populateParam}&locale=${locale}${sortParam}&pagination[page]=${currentPage}&pagination[pageSize]=100`;
    const result = await fetchData(queryUrl, fetchFn);

    if (result?.data) {
      allData = allData.concat(result.data);

      if (result.meta?.pagination) {
        totalPages = result.meta.pagination.pageCount;
      }
    }

    if (maxItems !== undefined && allData.length >= maxItems) {
      allData = allData.slice(0, maxItems);
      break;
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
  const populateParam = useStarPopulate.includes(path) ? 'populate=*' : 'pLevel';
  const queryUrl = `${base}/api/${path}?filters[slug][$eq]=${slug}&locale=${locale}&${populateParam}`;
  return await fetchData(queryUrl, fetchFn);
}
