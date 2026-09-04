import { CALENDAR_FEEDS, fetchCalendarEvents } from '$lib/server/calendar';
import { PRERENDER_LOCALES } from '$lib/helpers/translation';

export async function entries() {
	return PRERENDER_LOCALES.map((locale) => ({ locale }));
}

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const calendarEvents = await fetchCalendarEvents(CALENDAR_FEEDS);

  return {
    calendarEvents
  };
}


