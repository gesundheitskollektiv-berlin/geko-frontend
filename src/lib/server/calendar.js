import ICAL from 'ical.js';

/**
 * Nextcloud public CalDAV feeds shared by the prerendered page loads and the
 * live /api/calendar endpoint. feedId drives the UI label/legend, not color.
 * @type {Array<{ url: string, feedId: string }>}
 */
export const CALENDAR_FEEDS = [
  {
    url: 'https://intern.geko-berlin.de/remote.php/dav/public-calendars/a7bymwRGr9jgxcBH?export',
    feedId: 'gekoCenter',
  },
  {
    url: 'https://intern.geko-berlin.de/remote.php/dav/public-calendars/8B6TbF2QSSB2BeKP?export',
    feedId: 'kiez',
  },
];

/**
 * Fetches and parses iCal feed from a URL
 * @param {string} url - The ICS feed URL
 * @param {string} feedId - Stable id for this feed (used for UI labels, not color)
 * @returns {Promise<Array>} Array of parsed event objects
 */
export async function fetchCalendarFeed(url, feedId) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch calendar from ${url}: ${response.status}`);
      return [];
    }

    const icsData = await response.text();
    const events = parseICalData(icsData, feedId);
    
    return events;
  } catch (error) {
    console.error(`Error fetching calendar from ${url}:`, error);
    return [];
  }
}

/**
 * Parses iCal data string into event objects
 * @param {string} icsData - Raw ICS data
 * @param {string} feedId - Feed id stored on each event for display labels
 * @returns {Array} Array of event objects
 */
function parseICalData(icsData, feedId) {
  try {
    const jcalData = ICAL.parse(icsData);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents('vevent');

    // Expand recurring events from ~3 months back so the week view (which shows
    // past days of the current week) and back-navigation are populated, through
    // 1 year ahead.
    const rangeStart = new Date();
    rangeStart.setMonth(rangeStart.getMonth() - 3);
    const rangeEnd = new Date();
    rangeEnd.setFullYear(rangeEnd.getFullYear() + 1);

    // Split into masters and RECURRENCE-ID overrides. When a single occurrence
    // of a recurring Nextcloud event is edited, the export keeps the untouched
    // master (with RRULE) and appends an override sharing the same UID plus a
    // RECURRENCE-ID. The override must replace that occurrence, not add a second
    // entry.
    const masters = [];
    const overridesByUid = new Map();

    vevents.forEach(vevent => {
      if (vevent.hasProperty('recurrence-id')) {
        const uid = vevent.getFirstPropertyValue('uid');
        if (!overridesByUid.has(uid)) {
          overridesByUid.set(uid, []);
        }
        overridesByUid.get(uid).push(vevent);
      } else {
        masters.push(vevent);
      }
    });

    const allEvents = [];

    masters.forEach(vevent => {
      const event = new ICAL.Event(vevent);

      if (event.isRecurring()) {
        // Attach any edited occurrences so the iterator yields the override's
        // values instead of the original for those dates.
        const overrides = overridesByUid.get(event.uid) ?? [];
        overrides.forEach(ex => {
          try {
            event.relateException(ex);
          } catch (error) {
            // UID/RECURRENCE-ID mismatch: leave it as an orphan handled below.
            console.error('Error relating calendar exception:', error);
          }
        });
        // Overrides related to this master are consumed; drop them so they are
        // not later emitted again as orphan singles.
        overridesByUid.delete(event.uid);

        const occurrences = expandRecurringOccurrences(event, rangeStart, rangeEnd);
        occurrences.forEach(details => {
          allEvents.push(buildEventFromOccurrence(details, event, feedId));
        });
      } else {
        allEvents.push(buildSingleEvent(event, feedId, false));
      }
    });

    // Emit orphan overrides (RECURRENCE-ID components whose master is missing
    // from the feed) as standalone single events so they are not silently lost.
    overridesByUid.forEach(overrides => {
      overrides.forEach(vevent => {
        allEvents.push(buildSingleEvent(new ICAL.Event(vevent), feedId, false));
      });
    });

    // Filter out events without valid dates
    return allEvents.filter(e => e.start !== null);
  } catch (error) {
    console.error('Error parsing iCal data:', error);
    return [];
  }
}

/**
 * Builds an event object from an expanded recurring occurrence.
 * @param {ICAL.Event.occurrenceDetails} details - Occurrence details
 * @param {ICAL.Event} event - The master event
 * @param {string} feedId - Feed id stored on the event
 * @returns {Object} Event object
 */
function buildEventFromOccurrence(details, event, feedId) {
  const item = details.item;
  return {
    title: item.summary || 'Untitled Event',
    description: item.description || '',
    location: item.location || '',
    start: details.startDate.toJSDate(),
    end: details.endDate ? details.endDate.toJSDate() : details.startDate.toJSDate(),
    feedId,
    isRecurring: true,
    uid: `${event.uid}-${details.recurrenceId.toString()}`
  };
}

/**
 * Builds an event object from a non-recurring (or orphan) event.
 * @param {ICAL.Event} event - The event
 * @param {string} feedId - Feed id stored on the event
 * @param {boolean} isRecurring - Whether the event is recurring
 * @returns {Object} Event object
 */
function buildSingleEvent(event, feedId, isRecurring) {
  return {
    title: event.summary || 'Untitled Event',
    description: event.description || '',
    location: event.location || '',
    start: event.startDate ? event.startDate.toJSDate() : null,
    end: event.endDate ? event.endDate.toJSDate() : null,
    feedId,
    isRecurring,
    uid: event.uid
  };
}

/**
 * Expands a recurring event into individual occurrence details. Each occurrence
 * is resolved through the event so that RECURRENCE-ID overrides replace the
 * original occurrence's summary/times.
 * @param {ICAL.Event} event - The master event (with exceptions related)
 * @param {Date} rangeStart - Start of date range
 * @param {Date} rangeEnd - End of date range
 * @returns {Array<ICAL.Event.occurrenceDetails>} Array of occurrence details
 */
function expandRecurringOccurrences(event, rangeStart, rangeEnd) {
  const occurrences = [];

  try {
    // Create time objects for range
    const rangeStartTime = ICAL.Time.fromJSDate(rangeStart, true);
    const rangeEndTime = ICAL.Time.fromJSDate(rangeEnd, true);

    // Get the iterator for recurring events
    const iterator = event.iterator();
    let next;

    // Limit to prevent infinite loops
    let count = 0;
    const maxOccurrences = 750;

    while ((next = iterator.next()) && count < maxOccurrences) {
      // Check if we're past the end date
      if (next.compare(rangeEndTime) > 0) {
        break;
      }

      // Only include if within range
      if (next.compare(rangeStartTime) >= 0) {
        occurrences.push(event.getOccurrenceDetails(next));
      }

      count++;
    }

    return occurrences;
  } catch (error) {
    console.error('Error expanding recurring event:', error);
    return [];
  }
}

/**
 * Fetches all calendar events from multiple feeds
 * @param {Array} calendarUrls - Array of { url, feedId } objects
 * @returns {Promise<Array>} Combined array of all events
 */
export async function fetchCalendarEvents(calendarUrls) {
  try {
    // Fetch all calendars in parallel
    const feedPromises = calendarUrls.map(({ url, feedId }) =>
      fetchCalendarFeed(url, feedId)
    );
    
    const feedResults = await Promise.all(feedPromises);
    
    // Combine all events
    const allEvents = feedResults.flat();
    
    // Sort by start date
    allEvents.sort((a, b) => {
      if (!a.start || !b.start) return 0;
      return a.start.getTime() - b.start.getTime();
    });
    
    return allEvents;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
}

