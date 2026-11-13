/**
 * Validates if a string is a valid HTTP/HTTPS URL
 * @param {string} string - The string to validate
 * @returns {boolean} True if valid URL, false otherwise
 */
export function isValidHttpUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

/**
 * If the first line of the event description is an http(s) URL, returns it (same rule as row click → new tab).
 * @param {{ description?: string } | null | undefined} event
 * @returns {string | null}
 */
export function getCalendarEventExternalUrl(event) {
  const firstLine = (event?.description ?? '').split('\n')[0].trim();
  if (!isValidHttpUrl(firstLine)) return null;
  return firstLine;
}

/**
 * First line controls cancellation (Nextcloud description): if trimmed first line
 * contains "cancel" (case-insensitive), the event is shown as cancelled in the UI.
 * @param {string | null | undefined} description
 * @returns {{ cancelled: boolean, descriptionBody: string }}
 */
export function splitCalendarCancellation(description) {
  const normalized = String(description ?? '').replace(/\r\n/g, '\n');
  const lines = normalized.split('\n');
  const firstLine = (lines[0] ?? '').trim();
  const cancelled =
    firstLine !== '' && firstLine.toLowerCase().includes('cancel');
  const descriptionBody = lines.slice(1).join('\n');
  return { cancelled, descriptionBody };
}

/*
 * Time zone handling
 * ------------------
 * The calendar always displays Berlin time, independent of the visitor's device
 * time zone (and of the build host's zone during prerendering).
 *
 * Two kinds of values are used:
 * - Instants (event.start / event.end): real points in time. They are formatted
 *   and bucketed into days with timeZone: CALENDAR_TIME_ZONE.
 * - Calendar days (week strip, day headers, navigation): a Date at 00:00 UTC that
 *   represents a Berlin calendar date. All arithmetic uses UTC getters/setters and
 *   formatting uses timeZone: 'UTC', so neither DST nor the device zone matter.
 */

export const CALENDAR_TIME_ZONE = 'Europe/Berlin';

const berlinDatePartsFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: CALENDAR_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/**
 * Berlin calendar date (YYYY-MM-DD) of an instant.
 * @param {Date|string} instant
 * @returns {string}
 */
export function toBerlinDateKey(instant) {
  const d = instant instanceof Date ? instant : new Date(instant);
  const parts = {};
  for (const { type, value } of berlinDatePartsFormatter.formatToParts(d)) {
    parts[type] = value;
  }
  return `${parts.year}-${parts.month}-${parts.day}`;
}

/**
 * Calendar day value for a YYYY-MM-DD key.
 * @param {string} key
 * @returns {Date}
 */
export function dayFromKey(key) {
  return new Date(`${key}T00:00:00Z`);
}

/**
 * YYYY-MM-DD key of a calendar day value.
 * @param {Date} day
 * @returns {string}
 */
export function dayKey(day) {
  return day.toISOString().slice(0, 10);
}

/** Today's date in Berlin, as a calendar day value. */
export function berlinToday() {
  return dayFromKey(toBerlinDateKey(new Date()));
}

/**
 * @param {Date} day - Calendar day value
 * @param {number} n - Number of days to add (may be negative)
 * @returns {Date} New calendar day value
 */
export function addDays(day, n) {
  const d = new Date(day.getTime());
  d.setUTCDate(d.getUTCDate() + n);
  return d;
}

/** True if both calendar day values denote the same date. */
export function isSameDay(a, b) {
  return dayKey(a) === dayKey(b);
}

/** True if the calendar day value is strictly before today (Berlin). */
export function isBeforeBerlinToday(day) {
  return dayKey(day) < dayKey(berlinToday());
}

/**
 * Gets the start of the week (Monday) for a calendar day value
 * @param {Date} day - Calendar day value
 * @returns {Date} Monday of that week, as a calendar day value
 */
export function getWeekStart(day) {
  const weekday = day.getUTCDay();
  return addDays(day, weekday === 0 ? -6 : 1 - weekday);
}

/**
 * Gets the end of the week (Sunday) for a calendar day value
 * @param {Date} day - Calendar day value
 * @returns {Date} Sunday of that week, as a calendar day value
 */
export function getWeekEnd(day) {
  return addDays(getWeekStart(day), 6);
}

/**
 * Filters events that overlap the given week (by Berlin calendar date)
 * @param {Array} events - Array of event objects
 * @param {Date} weekStart - Monday of the week, as a calendar day value
 * @returns {Array} Filtered events
 */
export function filterEventsByWeek(events, weekStart) {
  const startKey = dayKey(weekStart);
  const endKey = dayKey(getWeekEnd(weekStart));

  return events.filter(event => {
    if (!event.start) return false;

    const eventStartKey = toBerlinDateKey(event.start);
    const eventEndKey = toBerlinDateKey(event.end ?? event.start);

    return eventStartKey <= endKey && eventEndKey >= startKey;
  });
}

/**
 * Groups events by Berlin calendar day
 * @param {Array} events - Array of event objects
 * @returns {Object} Events grouped by day key (YYYY-MM-DD)
 */
export function groupEventsByDay(events) {
  const grouped = {};

  for (const event of events) {
    if (!event.start) continue;

    const dateKey = toBerlinDateKey(event.start);

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }

    grouped[dateKey].push(event);
  }

  // Sort events within each day by start time
  for (const dateKey in grouped) {
    grouped[dateKey].sort((a, b) => {
      return new Date(a.start).getTime() - new Date(b.start).getTime();
    });
  }

  return grouped;
}

/**
 * Formats a calendar day value for display
 * @param {Date} day - Calendar day value
 * @param {string} locale - The locale code (e.g., 'de', 'en')
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDate(day, locale = 'de', options = {}) {
  return day.toLocaleDateString(locale, { ...options, timeZone: 'UTC' });
}

/**
 * Formats the Berlin clock time of an instant
 * @param {Date|string} date - The instant to format
 * @param {string} locale - The locale code (e.g., 'de', 'en')
 * @returns {string} Formatted time string
 */
export function formatTime(date, locale = 'de') {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: CALENDAR_TIME_ZONE,
  });
}

/**
 * Dates to show: only days that have events. When `landingFromToday`, range starts at
 * today (Berlin) through Sunday of `weekStart`'s week (not earlier in the week).
 * @param {Date} weekStart - Monday of the week, as a calendar day value
 * @returns {Date[]} Calendar day values
 */
export function getVisibleCalendarDates(weekStart, groupedByDay, options = {}) {
  const { landingFromToday = false } = options;
  const endKey = dayKey(getWeekEnd(weekStart));

  let cursor = weekStart;
  if (landingFromToday) {
    const today = berlinToday();
    if (dayKey(today) > dayKey(cursor)) {
      cursor = today;
    }
  }

  const out = [];
  while (dayKey(cursor) <= endKey) {
    if (groupedByDay[dayKey(cursor)]?.length > 0) {
      out.push(cursor);
    }
    cursor = addDays(cursor, 1);
  }
  return out;
}
