import { getCalendarEvents } from "./getCalendarEvents";
import { addCheckedTodo, isTodoChecked, removeCheckedTodo } from "./storage";
import { CalendarEvent, Todo } from "./types";
import { checkEvent, uncheckEvent } from "./updateCalendarEvent";

function checkButtonHtml(courseId: number, todo: Todo, isChecked: boolean, isSubmitted: boolean): HTMLButtonElement {
  const checkButton: HTMLButtonElement = document.createElement('button');
  checkButton.innerHTML = isChecked ? 'Mark as incomplete' : 'Mark as complete';
  checkButton.id = 'canvas-strikethrough-check-button';
  checkButton.classList.add('Button', 'Button--primary');

  // Grey out button if assignment is already submitted
  // if (isSubmitted) {
  //   checkButton.classList.add('Button--disabled');
  //   checkButton.disabled = true;
  // }

  if (isChecked) {
    checkButton.onclick = () => {
      markIncompleteOnclick(courseId, todo, checkButton, true);
    };
  } else {
    checkButton.onclick = () => {
      markCompleteOnclick(courseId, todo, checkButton, true);
    };
  }

  return checkButton;
}

function assignmentDisclaimer(): HTMLSpanElement {
  const disclaimer: HTMLSpanElement = document.createElement('span');
  disclaimer.innerHTML = 'Note: Marking an assignment as complete is only for your own reference. It does not affect your submission/grade, nor does it notify your instructor.';
  disclaimer.style.fontStyle = 'italic';

  return disclaimer;
}

function gradedDisclaimer(): HTMLSpanElement {
  const disclaimer: HTMLSpanElement = document.createElement('span');
  disclaimer.innerHTML = 'Note: This assignment has already been graded.';
  disclaimer.style.fontStyle = 'italic';

  return disclaimer;

}

function markIncompleteOnclick(courseId: number, todo: Todo, checkButton: HTMLButtonElement, updateCalendar: boolean = false) {
  // Remove checked assignment
  removeCheckedTodo(todo.id);
  checkButton.innerHTML = 'Mark as complete';

  // Uncheck event on calendar if updateCalendar is true
  if (updateCalendar) {
    const calendarEvents: CalendarEvent[] = getCalendarEvents();

    calendarEvents.forEach((event: CalendarEvent) => {
      const { name, element } = event;

      // If assignment is checked
      if (name === todo.name) {
        uncheckEvent(element);
      }
    });
  }

  checkButton.onclick = () => { markCompleteOnclick(courseId, todo, checkButton, updateCalendar) };
}

function markCompleteOnclick(courseId: number, todo: Todo, checkButton: HTMLButtonElement, updateCalendar: boolean = false) {
  // Add checked assignment
  addCheckedTodo(todo)
  checkButton.innerHTML = 'Mark as incomplete';

  // Check event on calendar if updateCalendar is true
  if (updateCalendar) {
    const calendarEvents: CalendarEvent[] = getCalendarEvents();

    calendarEvents.forEach((event: CalendarEvent) => {
      const { name, element } = event;

      // If assignment is checked
      if (name === todo.name) {
        checkEvent(element);
      }
    });
  }

  checkButton.onclick = () => { markIncompleteOnclick(courseId, todo, checkButton, updateCalendar) };
}

async function handleAssignment(courseId: number, assignmentId: number) {

  const rightSide = document.querySelector('#right-side');
  const buttonDiv = document.createElement('div');

  if (!buttonDiv) {
    return;
  }

  // Get assignment name
  const assignmentReq = await fetch(`../../../api/v1/courses/${courseId}/assignments/${assignmentId}`);
  const assignmentData = await assignmentReq.json();

  const assignmentName = assignmentData.name;
  const isSubmitted = assignmentData.graded_submissions_exist;

  // Create todo object
  const todo: Todo = {
    type: 'assignment',
    courseId,
    id: assignmentId,
    name: assignmentName
  };

  // Get check status
  const isChecked = isTodoChecked(courseId, assignmentId);

  // Create header for button
  const header = document.createElement('h2');
  header.innerHTML = 'Canvas Strikethrough';

  // Create check button
  const checkButton = checkButtonHtml(courseId, todo, isChecked, isSubmitted);
 
  buttonDiv.appendChild(header);
  buttonDiv.appendChild(checkButton);
  buttonDiv.appendChild(document.createElement('br'));
  buttonDiv.appendChild(assignmentDisclaimer());

  if (isSubmitted) {
    buttonDiv.appendChild(document.createElement('br'));
    buttonDiv.appendChild(gradedDisclaimer());
  }

  rightSide?.prepend(buttonDiv);
}

async function handlePage(courseId: number, pageUrl: string) {

  const buttonDiv = document.querySelector('#content .page-toolbar-start');

  if (!buttonDiv) {
    return;
  }

  // Get page name
  const pageReq = await fetch(`../../../api/v1/courses/${courseId}/pages/${pageUrl}`);
  const pageData = await pageReq.json();

  const pageName = pageData.title;
  const pageId = pageData.page_id;

  // Create todo object
  const todo: Todo = {
    type: 'page',
    courseId,
    id: pageId,
    name: pageName
  }

  // Get check status
  const isChecked = isTodoChecked(courseId, pageId);

  // Create check button
  const checkButton = checkButtonHtml(courseId, todo, isChecked, false);

  buttonDiv.appendChild(document.createElement('br'));
  buttonDiv.appendChild(checkButton);
}

async function handleEvent(courseId: number, todoId: number | string, eventType: 'assignment' | 'page') {

  console.log('handling event', courseId, todoId);

  let isChecked = false;
  let todo: Todo | undefined = undefined;
  let isSubmitted = false;

  if (typeof todoId === 'string') {

    const pageReq = await fetch(`../../api/v1/courses/${courseId}/pages/${todoId}`);
    const pageData = await pageReq.json();

    const pageName = pageData.title;
    const pageId = pageData.page_id;

    // Create todo object
    todo = {
      type: 'page',
      courseId,
      id: pageId,
      name: pageName
    }

    // Get check status
    isChecked = isTodoChecked(courseId, pageId);
  } else if (typeof todoId === 'number') {

    const assignmentReq = await fetch(`../../api/v1/courses/${courseId}/assignments/${todoId}`);
    const assignmentData = await assignmentReq.json();

    const assignmentName = assignmentData.name;
    isSubmitted = assignmentData.graded_submissions_exist;

    // Create todo object
    todo = {
      type: 'assignment',
      courseId,
      id: todoId,
      name: assignmentName
    };

    // Get check status
    isChecked = isTodoChecked(courseId, todoId);
  }

  const header = document.querySelector('#event-details-trap-focus > div.event-details-header');

  if (!header || !todo) {
    return;
  }

  const checkButton = checkButtonHtml(courseId, todo, isChecked, isSubmitted)

  header.appendChild(checkButton);

  // Add disclaimer if assignment
  if (eventType === 'assignment') {
    header.appendChild(document.createElement('br'));
    header.appendChild(assignmentDisclaimer());
    if (isSubmitted) {
      header.appendChild(document.createElement('br'));
      header.appendChild(gradedDisclaimer());
    }
  }
}

export async function displayCheckButton() {

  const path = window.location.pathname;

  if (path.includes('assignments')) {
    const courseId = parseInt(path.split('/')[2]);
    const assignmentId = parseInt(path.split('/')[4]);

    handleAssignment(courseId, assignmentId);
    return;
  }

  if (path.includes('pages')) {
    const courseId = parseInt(path.split('/')[2]);
    const pageUrl = path.split('/')[4];
    handlePage(courseId, pageUrl);
    return;
  }

  if (path.includes('calendar')) {
    const eventLinkElement = document.querySelector('#event-details-trap-focus > div.event-details-header > h2 > a');

    if (!eventLinkElement) {
      return;
    }

    const eventUrl = eventLinkElement.getAttribute('href');

    if (!eventUrl) {
      return;
    }

    const url = eventUrl.split('/courses/')[1];

    const courseId = parseInt(url.split('/')[0]);
    const eventType: 'assignment' | 'page' = url.split('/')[1] === 'assignments' ? 'assignment' : 'page';
    let todoId: string | number = url.split('/')[2];

    if (!Number.isNaN(parseInt(todoId))) {
      todoId = parseInt(todoId);
    }

    handleEvent(courseId, todoId, eventType);
  }
}