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
 * Gets the start of the week for a given date (Monday)
 * @param {Date} date - The reference date
 * @returns {Date} Start of the week
 */
export function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

/**
 * Gets the end of the week for a given date (Sunday)
 * @param {Date} date - The reference date
 * @returns {Date} End of the week
 */
export function getWeekEnd(date) {
  const d = getWeekStart(date);
  return new Date(d.setDate(d.getDate() + 6));
}

/**
 * Filters events that fall within a specific week
 * @param {Array} events - Array of event objects
 * @param {Date} weekStart - Start of the week
 * @returns {Array} Filtered events
 */
export function filterEventsByWeek(events, weekStart) {
  const weekEnd = getWeekEnd(weekStart);
  
  return events.filter(event => {
    if (!event.start) return false;
    
    const eventStart = new Date(event.start);
    const eventEnd = event.end ? new Date(event.end) : eventStart;
    
    // Event overlaps with the week if:
    // - Event starts before week ends AND
    // - Event ends after week starts
    return eventStart <= weekEnd && eventEnd >= weekStart;
  });
}

/** Local calendar YYYY-MM-DD (avoids UTC shift from toISOString) */
export function toLocalDateKey(date) {
  const d = date instanceof Date ? date : new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Groups events by day
 * @param {Array} events - Array of event objects
 * @returns {Object} Events grouped by day key (YYYY-MM-DD)
 */
export function groupEventsByDay(events) {
  const grouped = {};
  
  for (const event of events) {
    if (!event.start) continue;
    
    const date = new Date(event.start);
    const dateKey = toLocalDateKey(date);
    
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
 * Formats a date for display
 * @param {Date|string} date - The date to format
 * @param {string} locale - The locale code (e.g., 'de', 'en')
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDate(date, locale = 'de', options = {}) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, options);
}

/**
 * Formats a time for display
 * @param {Date|string} date - The date to format
 * @param {string} locale - The locale code (e.g., 'de', 'en')
 * @returns {string} Formatted time string
 */
export function formatTime(date, locale = 'de') {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
}

/**
 * Formats a date range for display
 * @param {Date|string} start - Start date
 * @param {Date|string} end - End date
 * @param {string} locale - The locale code
 * @returns {string} Formatted date range
 */
export function formatDateRange(start, end, locale = 'de') {
  const startDate = typeof start === 'string' ? new Date(start) : start;
  const endDate = end ? (typeof end === 'string' ? new Date(end) : end) : null;
  
  if (!endDate || startDate.toDateString() === endDate.toDateString()) {
    // Same day or no end date
    return formatDate(startDate, locale, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } else {
    // Different days
    return `${formatDate(startDate, locale, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })} - ${formatDate(endDate, locale, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })}`;
  }
}

/**
 * Gets the week range display text in numeric format
 * @param {Date} weekStart - Start of the week
 * @param {string} locale - The locale code
 * @returns {string} Week range text (e.g., "08.12.2025 - 14.12.2025")
 */
export function getWeekRangeText(weekStart, locale = 'de') {
  const weekEnd = getWeekEnd(weekStart);
  
  const formatNumericDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };
  
  return `${formatNumericDate(weekStart)} - ${formatNumericDate(weekEnd)}`;
}

/** Start of local calendar day as timestamp */
export function startOfLocalDay(date) {
  const d = date instanceof Date ? date : new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export function isSameLocalCalendarDay(a, b) {
  return startOfLocalDay(a) === startOfLocalDay(b);
}

/** True if `date` is strictly before today (local). */
export function isLocalDateBeforeToday(date) {
  return startOfLocalDay(date) < startOfLocalDay(new Date());
}

/**
 * Dates to show: only days that have events. When `landingFromToday`, range starts at
 * today (local) through Sunday of `weekStart`'s week (not earlier in the week).
 */
export function getVisibleCalendarDates(weekStart, groupedByDay, options = {}) {
  const { landingFromToday = false } = options;
  const weekEnd = getWeekEnd(new Date(weekStart.getTime()));

  let d = new Date(weekStart);
  d.setHours(0, 0, 0, 0);

  if (landingFromToday) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (todayStart.getTime() > d.getTime()) {
      d = todayStart;
    }
  }

  const end = new Date(weekEnd);
  end.setHours(23, 59, 59, 999);

  const out = [];
  const cursor = new Date(d);
  while (cursor.getTime() <= end.getTime()) {
    const key = toLocalDateKey(cursor);
    const ev = groupedByDay[key];
    if (ev?.length > 0) {
      out.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}

