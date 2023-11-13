// Check an event
export async function checkEvent(event: Element) {
  event.querySelector('.fc-title')?.classList.add('calendar__event--completed');
}

// Uncheck an event
export async function uncheckEvent(event: Element) {
  event.querySelector('.fc-title')?.classList.remove('calendar__event--completed');
}
