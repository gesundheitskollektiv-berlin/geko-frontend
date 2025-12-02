// place files you want to import through the `$lib` alias in this folder.

// Data fetching helpers
export { getDataFromCMS, getDetailsDataFromCMS } from './helpers/getDataFromCMS';

// Rich text helpers
export { resolveRichText } from './helpers/richTextResolver';

// Translation helpers
export { 
  SUPPORTED_LOCALES, 
  DEFAULT_LOCALE, 
  isValidLocale, 
  getValidLocale, 
  getLocaleName 
} from './helpers/translation';

// Date formatting helpers
export { formatDate, formatDateTime, formatDateShort } from './helpers/formatDate';

// Landing helpers
export { mapLandingBlocks, getBackgroundClass } from './helpers/landingBlocks';

// Generic components
export { default as StrapiImage } from './components/StrapiImage.svelte';
