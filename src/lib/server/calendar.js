import ICAL from 'ical.js';

/**
 * Fetches and parses iCal feed from a URL
 * @param {string} url - The ICS feed URL
 * @param {string} color - The color to assign to events from this feed
 * @returns {Promise<Array>} Array of parsed event objects
 */
export async function fetchCalendarFeed(url, color) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch calendar from ${url}: ${response.status}`);
      return [];
    }

    const icsData = await response.text();
    const events = parseICalData(icsData, color);
    
    return events;
  } catch (error) {
    console.error(`Error fetching calendar from ${url}:`, error);
    return [];
  }
}

/**
 * Parses iCal data string into event objects
 * @param {string} icsData - Raw ICS data
 * @param {string} color - Color to assign to events
 * @returns {Array} Array of event objects
 */
function parseICalData(icsData, color) {
  try {
    const jcalData = ICAL.parse(icsData);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents('vevent');

    const events = vevents.map(vevent => {
      const event = new ICAL.Event(vevent);
      
      // Get basic event data
      const title = event.summary || 'Untitled Event';
      const description = event.description || '';
      const location = event.location || '';
      
      // Parse dates
      let startDate = null;
      let endDate = null;
      
      if (event.startDate) {
        startDate = event.startDate.toJSDate();
      }
      
      if (event.endDate) {
        endDate = event.endDate.toJSDate();
      }

      // Handle recurring events
      const isRecurring = !!event.recurrenceId || vevent.hasProperty('rrule');
      
      return {
        title,
        description,
        location,
        start: startDate,
        end: endDate,
        color,
        isRecurring,
        uid: event.uid
      };
    });

    // Filter out events without valid dates
    return events.filter(e => e.start !== null);
  } catch (error) {
    console.error('Error parsing iCal data:', error);
    return [];
  }
}

/**
 * Expands recurring events into individual occurrences
 * @param {Array} events - Array of event objects
 * @param {Date} rangeStart - Start of date range
 * @param {Date} rangeEnd - End of date range
 * @returns {Array} Array of expanded event objects
 */
function expandRecurringEvents(events, rangeStart, rangeEnd) {
  const expanded = [];
  
  for (const event of events) {
    if (!event.isRecurring) {
      expanded.push(event);
    } else {
      // For now, just include the base event
      // TODO: Implement proper recurrence expansion if needed
      expanded.push(event);
    }
  }
  
  return expanded;
}

/**
 * Fetches all calendar events from multiple feeds
 * @param {Array} calendarUrls - Array of {url, color} objects
 * @returns {Promise<Array>} Combined array of all events
 */
export async function fetchCalendarEvents(calendarUrls) {
  try {
    // Fetch all calendars in parallel
    const feedPromises = calendarUrls.map(({ url, color }) => 
      fetchCalendarFeed(url, color)
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

