import { PUBLIC_STRAPI_URL } from '$env/static/public';

const fetchData = async (url) => {
  const response = await fetch(url);
  return await response.json();
};

export async function getDataFromCMS(path, locale) {
  // For collections that might have pagination, fetch all pages
  const shouldFetchAllPages = ['geko-announcements', 'geko-services', 'geko-jobs', 'geko-materials'];

  if (shouldFetchAllPages.includes(path)) {
    return await fetchAllPages(path, locale);
  }

  // For single entries or small collections, use original method
  const queryUrl = `${PUBLIC_STRAPI_URL}/api/${path}?pLevel&locale=${locale}`;
  return await fetchData(queryUrl);
}

async function fetchAllPages(path, locale) {
  let allData = [];
  let currentPage = 1;
  let totalPages = 1;

  do {
    const queryUrl = `${PUBLIC_STRAPI_URL}/api/${path}?pLevel&locale=${locale}&pagination[page]=${currentPage}&pagination[pageSize]=100`;
    const result = await fetchData(queryUrl);

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

export async function getDetailsDataFromCMS(path, locale, slug) {
  const queryUrl = `${PUBLIC_STRAPI_URL}/api/${path}?filters[slug][$eq]=${slug}&locale=${locale}&pLevel`;
  return await fetchData(queryUrl);
}
