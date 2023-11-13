import { getCheckedCourses } from "./getCheckedCourses";
import { markIncompleteOnclick } from "./markTodos";
import { getCheckedTodos } from "./storage";
import { Todo } from "./types";

export async function displayCheckedTodos() {

  // Get checked courses
  const courseList: number[] = getCheckedCourses();

  // Get all checked assignments
  const checkedTodos: Todo[] = getCheckedTodos(courseList);
  checkedTodos.reverse();

  // Remove existing checked todos section if it exists
  const existingSection = document.querySelector('#checked-todos-section');
  existingSection?.remove();

  // Main div for checked todos
  const rsSection = document.createElement('div');
  rsSection.classList.add('rs-section');
  rsSection.id = 'checked-todos-section';

  // Header
  const h2 = document.createElement('h2');
  h2.tabIndex = -1;

  // Header button
  const span = document.createElement('span');
  span.role = 'button';
  span.id = 'checked-todos-button';
  span.classList.add('element_toggler');
  span.setAttribute('aria-controls', 'checked-todos');
  span.setAttribute('aria-expanded', 'true');
  span.setAttribute('aria-label', 'Undated items toggle list visibility');
  span.tabIndex = 0;

  // Header button icon
  const i = document.createElement('i');
  i.classList.add('auto_rotate');
  i.classList.add('icon-mini-arrow-down');

  span.appendChild(i);
  span.appendChild(document.createTextNode(' Canvas Strikethrough Checked'));

  h2.appendChild(span);

  // List of checked todos
  const div = document.createElement('div');
  div.id = 'checked-todos';
  div.style.display = 'block';
  div.style.opacity = '1';

  const ul = document.createElement('ul');
  ul.style.listStyleType = 'none';
  ul.style.padding = '0';
  ul.style.margin = '0';
  ul.id = 'checked-todos-list';

  checkedTodos.forEach((todo, index) => {

    const event = document.createElement('div');
    event.classList.add('checked-todo');
    event.classList.add('event');
    event.classList.add(`group_course_${todo.courseId}`);
    event.id = `checked-todo-${index}`;
    event.style.borderRadius = '3px';
    event.style.marginBottom = '3px';
    event.style.padding = '3px';
    event.style.color = 'white';
    event.setAttribute('data-course-id', `${todo.courseId}`);
    event.setAttribute('data-todo-id', `${todo.id}`);

    const spanInner = document.createElement('a');
    spanInner.innerHTML = todo.name.length > 25 ? todo.name.substring(0, 25) + '...' : todo.name;
    spanInner.classList.add('icon-calendar-month');
    spanInner.style.color = 'white';
    spanInner.style.textDecoration = 'none';
    spanInner.style.cursor = 'pointer';

    const markAsIncompleteButton = document.createElement('button');
    markAsIncompleteButton.classList.add('Button');
    markAsIncompleteButton.classList.add('Button--link');
    markAsIncompleteButton.innerText = 'Mark as incomplete';
    markAsIncompleteButton.style.padding = '3px';
    markAsIncompleteButton.style.margin = '3px';
    markAsIncompleteButton.style.backgroundColor = 'white';
    markAsIncompleteButton.style.color = 'black';
    markAsIncompleteButton.style.borderRadius = '3px';
    markAsIncompleteButton.style.cursor = 'pointer';
    markAsIncompleteButton.style.border = '1px solid black';

    markAsIncompleteButton.onclick = () => {
      markIncompleteOnclick(todo.courseId, todo, markAsIncompleteButton, true);

      // Remove checked todo from list
      const checkedTodo = document.querySelector(`#checked-todo-${index}`);
      checkedTodo?.remove();
    };

    event.appendChild(spanInner);
    event.appendChild(document.createElement('br'));
    event.appendChild(markAsIncompleteButton);
    ul.appendChild(event);
  });

  div.appendChild(ul);

  rsSection.appendChild(h2);
  rsSection.appendChild(div);

  const main = document.querySelector('#right-side');
  main?.appendChild(rsSection);
}
