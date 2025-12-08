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

    // Define date range for recurring events (1 year from now)
    const rangeStart = new Date();
    const rangeEnd = new Date();
    rangeEnd.setFullYear(rangeEnd.getFullYear() + 1);

    const allEvents = [];

    vevents.forEach(vevent => {
      const event = new ICAL.Event(vevent);
      
      // Get basic event data
      const title = event.summary || 'Untitled Event';
      const description = event.description || '';
      const location = event.location || '';
      
      // Get duration for recurring events
      const duration = event.duration;
      
      // Check if event is recurring
      if (event.isRecurring()) {
        // Expand recurring event into multiple occurrences
        const occurrences = expandRecurringEvent(vevent, rangeStart, rangeEnd);
        
        occurrences.forEach((startDate, index) => {
          // Calculate end date based on duration
          let endDate = new Date(startDate);
          if (duration) {
            endDate = new Date(startDate.getTime() + duration.toSeconds() * 1000);
          } else if (event.endDate) {
            // Use original duration
            const originalDuration = event.endDate.toJSDate().getTime() - event.startDate.toJSDate().getTime();
            endDate = new Date(startDate.getTime() + originalDuration);
          }
          
          allEvents.push({
            title,
            description,
            location,
            start: startDate,
            end: endDate,
            color,
            isRecurring: true,
            uid: `${event.uid}-${index}`
          });
        });
      } else {
        // Single event
        let startDate = null;
        let endDate = null;
        
        if (event.startDate) {
          startDate = event.startDate.toJSDate();
        }
        
        if (event.endDate) {
          endDate = event.endDate.toJSDate();
        }
        
        allEvents.push({
          title,
          description,
          location,
          start: startDate,
          end: endDate,
          color,
          isRecurring: false,
          uid: event.uid
        });
      }
    });

    // Filter out events without valid dates
    return allEvents.filter(e => e.start !== null);
  } catch (error) {
    console.error('Error parsing iCal data:', error);
    return [];
  }
}

/**
 * Expands recurring events into individual occurrences
 * @param {ICAL.Component} vevent - The VEVENT component
 * @param {Date} rangeStart - Start of date range
 * @param {Date} rangeEnd - End of date range
 * @returns {Array} Array of event dates
 */
function expandRecurringEvent(vevent, rangeStart, rangeEnd) {
  const occurrences = [];
  
  try {
    const event = new ICAL.Event(vevent);
    
    if (!event.isRecurring()) {
      // Not recurring, just return the original date
      return [event.startDate.toJSDate()];
    }
    
    // Create time objects for range
    const rangeStartTime = ICAL.Time.fromJSDate(rangeStart, true);
    const rangeEndTime = ICAL.Time.fromJSDate(rangeEnd, true);
    
    // Get the iterator for recurring events
    const iterator = event.iterator();
    let next;
    
    // Limit to prevent infinite loops
    let count = 0;
    const maxOccurrences = 500;
    
    while ((next = iterator.next()) && count < maxOccurrences) {
      // Check if we're past the end date
      if (next.compare(rangeEndTime) > 0) {
        break;
      }
      
      // Only include if within range
      if (next.compare(rangeStartTime) >= 0) {
        occurrences.push(next.toJSDate());
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

