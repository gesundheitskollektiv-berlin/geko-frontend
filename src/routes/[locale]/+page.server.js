import { fetchCalendarEvents } from '$lib/server/calendar';
import { PRERENDER_LOCALES } from '$lib/helpers/translation';
import { env } from '$env/dynamic/public';

export async function entries() {
	// Skip entries in preview mode (SSR) - pages are rendered on-demand
	if (env.PUBLIC_PREVIEW_MODE === 'true') {
		return [];
	}
	return PRERENDER_LOCALES.map((locale) => ({ locale }));
}

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  // Calendar URLs for Nextcloud CalDAV feeds
  const calendarUrls = [
    {
      url: 'https://intern.geko-berlin.de/remote.php/dav/public-calendars/a7bymwRGr9jgxcBH?export',
      feedId: 'gekoCenter',
    },
    {
      url: 'https://intern.geko-berlin.de/remote.php/dav/public-calendars/8B6TbF2QSSB2BeKP?export',
      feedId: 'kiez',
    },
  ];

  // Fetch calendar events
  const calendarEvents = await fetchCalendarEvents(calendarUrls);

  return {
    calendarEvents
  };
}


