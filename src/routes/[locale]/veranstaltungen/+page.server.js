import { fetchCalendarEvents } from '$lib/server/calendar';
import { PRERENDER_LOCALES } from '$lib/helpers/translation';

export async function entries() {
  return PRERENDER_LOCALES.map((locale) => ({ locale }));
}

/** @type {import('./$types').PageServerLoad} */
export async function load() {
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

  const calendarEvents = await fetchCalendarEvents(calendarUrls);

  return {
    calendarEvents,
  };
}
