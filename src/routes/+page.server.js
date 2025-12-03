import { redirect } from '@sveltejs/kit';
import { DEFAULT_LOCALE } from '$lib/helpers/translation';

export function load() {
  // Redirect root path to default locale
  throw redirect(307, `/${DEFAULT_LOCALE}`);
}


