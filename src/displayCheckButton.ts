import { getAssignment, getPage } from "./getTodos";
import { markCompleteOnclick, markIncompleteOnclick } from "./markTodos";
import { isTodoChecked } from "./storage";
import { Todo } from "./types";

function checkButtonHtml(courseId: number, todo: Todo, isChecked: boolean, isSubmitted: boolean): HTMLButtonElement {
  const checkButton: HTMLButtonElement = document.createElement('button');
  checkButton.innerHTML = isChecked ? 'Mark as incomplete' : 'Mark as complete';
  checkButton.id = 'canvas-strikethrough-check-button';
  checkButton.classList.add('Button', 'Button--primary');

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

// Add general disclaimer
function assignmentDisclaimer(): HTMLSpanElement {
  const disclaimer: HTMLSpanElement = document.createElement('span');
  disclaimer.innerHTML = 'Note: Marking an assignment as complete is only for your own reference. It does not affect your submission/grade, nor does it notify your instructor.';
  disclaimer.style.fontStyle = 'italic';

  return disclaimer;
}

// Add disclaimer if assignment is already submitted
function gradedDisclaimer(): HTMLSpanElement {
  const disclaimer: HTMLSpanElement = document.createElement('span');
  disclaimer.innerHTML = 'Note: This assignment has already been submitted.';
  disclaimer.style.fontStyle = 'italic';
  disclaimer.style.color = 'var(--ic-link-color)';

  return disclaimer;
}

async function handleAssignment(courseId: number, assignmentId: number) {

  // Get right side of page
  const rightSide = document.querySelector('#right-side');
  const buttonDiv = document.createElement('div');

  if (!buttonDiv) {
    return;
  }

  // Get assignment
  const assignmentData = await getAssignment(courseId, assignmentId);

  if (!assignmentData) {
    return;
  }

  const { todo, isSubmitted } = assignmentData;

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

  // Add disclaimer if assignment is already submitted
  if (isSubmitted) {
    buttonDiv.appendChild(gradedDisclaimer());
    buttonDiv.appendChild(document.createElement('br'));
  }

  // Add disclaimer
  buttonDiv.appendChild(assignmentDisclaimer());

  rightSide?.prepend(buttonDiv);
}

async function handlePage(courseId: number, pageUrl: string) {

  const buttonDiv = document.querySelector('#content .page-toolbar-start');

  if (!buttonDiv) {
    return;
  }

  // Get page name
  const pageData = await getPage(courseId, pageUrl);
  
  if (!pageData) {
    return;
  }

  const { todo } = pageData;

  // Get check status
  const isChecked = isTodoChecked(courseId, todo.id);

  // Create check button
  const checkButton = checkButtonHtml(courseId, todo, isChecked, false);

  buttonDiv.appendChild(document.createElement('br'));
  buttonDiv.appendChild(checkButton);
}

async function handleEvent(courseId: number, todoId: number | string, eventType: 'assignment' | 'page') {

  let isChecked = false;
  let todo: Todo | undefined = undefined;
  let isSubmitted = false;

  if (typeof todoId === 'string') {

    const pageData = await getPage(courseId, todoId);

    todo = pageData.todo;

    // Get check status
    isChecked = isTodoChecked(courseId, todo.id);
  } else if (typeof todoId === 'number') {

    const assignmentData = await getAssignment(courseId, todoId);

    isSubmitted = assignmentData.isSubmitted
    todo = assignmentData.todo;

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

    // Add disclaimer if assignment is already submitted
    if (isSubmitted) {
      header.appendChild(gradedDisclaimer());
      header.appendChild(document.createElement('br'));
    }

    // Add disclaimer
    header.appendChild(assignmentDisclaimer());
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