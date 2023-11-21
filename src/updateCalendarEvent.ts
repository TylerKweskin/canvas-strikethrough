// Check an event
export async function checkEvent(event: Element) {
  event.classList.add('calendar__event--completed');
}

// Uncheck an event
export async function uncheckEvent(event: Element) {
  event.classList.remove('calendar__event--completed');
}
