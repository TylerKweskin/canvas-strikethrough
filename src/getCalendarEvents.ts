import { CalendarEvent } from "./types";

export function getCalendarView(): 'month' | 'week' | 'agenda' | null { 
  const calendarViewUrl = window.location.hash.replace('#', '').split('&')[0].split('=')[1];

  // If calendar view is not month, week, or agenda, default to month
  if (!['month', 'week', 'agenda'].includes(calendarViewUrl)) {
    return null;
  }

  return calendarViewUrl as 'month' | 'week' | 'agenda';
}

function decodeEntities(input: string) {
  const doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

function getCalendarEvents(): CalendarEvent[] {

  const eventElements = Array.from(document.querySelectorAll('.fc-title'));

  const events = eventElements.map((eventElement: any) => {

    // Remove any .screenreader-only spans
    Array.from(eventElement.querySelectorAll('.screenreader-only')).forEach((element: any) => {
      element.remove();
    });

    let eventTitle = eventElement.textContent;
    // Convert encoded characters to normal characters
    eventTitle = decodeEntities(eventTitle)?.trim();

    return {
      name: eventTitle,
      element: eventElement
    };
  });

  return events;
}

function getAgendaEvents(): CalendarEvent[] {

  const eventElements = Array.from(document.querySelectorAll('.agenda-event__title'));

  const events = eventElements.map((eventElement: any) => {

    let eventTitle = eventElement.textContent;
    // Convert encoded characters to normal characters
    eventTitle = decodeEntities(eventTitle)?.trim();

    return {
      name: eventTitle,
      element: eventElement
    };
  });

  return events;
}

// Get all checked assignments
export function getEvents(calendarView: 'month' | 'week' | 'agenda' | null): CalendarEvent[] {

  // Get calendar events based on view type
  switch (calendarView) {
    case 'month':
      return getCalendarEvents();
    case 'week':
      return getCalendarEvents();
    case 'agenda':
      return getAgendaEvents();
    default:
      return [];
  }
}