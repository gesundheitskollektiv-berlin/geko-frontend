import { json } from '@sveltejs/kit';
import { CALENDAR_FEEDS, fetchCalendarEvents } from '$lib/server/calendar';

export const prerender = false;

export async function GET() {
  const events = await fetchCalendarEvents(CALENDAR_FEEDS);

  return json(events, {
    headers: {
      'cache-control': 'public, max-age=60',
      'netlify-cdn-cache-control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
