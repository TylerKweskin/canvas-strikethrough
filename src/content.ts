import { displayCheckButton } from "./displayCheckButton";
import { injectCss } from "./injectCss";
import { calendar } from "./updateCalendar";

// Inject CSS
injectCss();

// Get path
const path = window.location.pathname;

if (path.includes('calendar')) {

  // Keep track of last time DOM was modified
  let domLastModified = new Date().getTime();
  let lastPopupUrl = '';

  // Select the target node to observe
  const calendarElement = document.querySelector('#content');
  const body = document.body;

  // Handle calendar view changes
  if (calendarElement) {
    // Options for the observer (specify which changes to observe)
    const config = { childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function (mutationsList: any) {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {

          const now = new Date().getTime();
          // Only allow calendar to update once every 100ms
          if (now - domLastModified > 100) {
            calendar();
            domLastModified = now;
          }
        }
      }
    };

    // Create an observer instance
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(calendarElement, config);
  }

  // Handle calendar event popups
  if (body) {
    // Options for the observer (specify which changes to observe)
    const config = { childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function (mutationsList: any) {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {

          const eventLinkElement = document.querySelector('#event-details-trap-focus > div.event-details-header > h2 > a');
          if (!eventLinkElement) {
            lastPopupUrl = '';
          } else {
            if (lastPopupUrl !== eventLinkElement.getAttribute('href')) {
              displayCheckButton();
            }
            lastPopupUrl = eventLinkElement.getAttribute('href') || '';
          }
        }
      }
    };

    // Create an observer instance
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(body, config);
  }

} else if (path.includes('courses') && (path.includes('assignments') || path.includes('pages'))) {
  setTimeout(() => {
    displayCheckButton();
  }, 1000);
}