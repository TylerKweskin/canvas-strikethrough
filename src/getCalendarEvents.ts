import { CalendarEvent } from "./types";

function decodeEntities(input: string) {
  const doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

// Get all checked assignments
export function getCalendarEvents(): CalendarEvent[] {

  const eventElements = Array.from(document.querySelectorAll('.fc-event-container'));

  const events = eventElements.map((eventElement: any) => {

    let eventTitle = eventElement.children[0].getAttribute('title');
    // Convert encoded characters to normal characters
    eventTitle = decodeEntities(eventTitle);

    return {
      name: eventTitle,
      element: eventElement
    };
  });

  return events;
}