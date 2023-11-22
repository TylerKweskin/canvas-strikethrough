import { getCheckedCourses } from "./getCheckedCourses";
import { markIncompleteOnclick } from "./updateTodos";
import { getCheckedTodos, getCheckedTodosListState, toggleCheckedTodosListState } from "./storage";
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

  // Get checked todos list state
  const checkedTodoListOpen = getCheckedTodosListState();

  // Header button
  const span = document.createElement('span');
  span.role = 'button';
  span.id = 'checked-todos-button';
  span.classList.add('element_toggler');
  span.setAttribute('aria-controls', 'checked-todos');
  span.setAttribute('aria-expanded', checkedTodoListOpen ? 'true' : 'false');
  span.setAttribute('aria-label', 'Undated items toggle list visibility');
  span.tabIndex = 0;
  span.onclick = () => { 
    toggleCheckedTodosListState();
  }

  // Header button icon
  const i = document.createElement('i');
  i.classList.add('auto_rotate');
  i.classList.add(checkedTodoListOpen ? 'icon-mini-arrow-down' : 'icon-mini-arrow-right');

  span.appendChild(i);
  span.appendChild(document.createTextNode(' Canvas Strikethrough Checked'));

  h2.appendChild(span);

  // List of checked todos
  const div = document.createElement('div');
  div.id = 'checked-todos';
  div.style.opacity = '1';
  // Hide list by default
  div.style.display = checkedTodoListOpen ? 'block' : 'none';

  const ul = document.createElement('ul');
  ul.id = 'checked-todos-list';

  checkedTodos.forEach((todo, index) => {

    const todoParent = document.createElement('div');
    todoParent.classList.add('checked-todo');
    todoParent.classList.add('event');
    todoParent.classList.add(`group_course_${todo.courseId}`);
    todoParent.id = `checked-todo-${index}`;
    todoParent.setAttribute('data-course-id', `${todo.courseId}`);
    todoParent.setAttribute('data-todo-id', `${todo.id}`);

    const aInner = document.createElement('a');
    aInner.innerHTML = todo.name;
    aInner.classList.add('icon-calendar-month');
    aInner.href = `/courses/${todo.courseId}/${todo.type}s/${todo.id}`;

    const markAsIncompleteButton = document.createElement('button');
    markAsIncompleteButton.classList.add('Button');
    markAsIncompleteButton.classList.add('Button--link');
    markAsIncompleteButton.innerText = 'Mark as incomplete';

    markAsIncompleteButton.onclick = () => {
      markIncompleteOnclick(todo, markAsIncompleteButton, true);

      // Remove checked todo from list
      const checkedTodo = document.querySelector(`#checked-todo-${index}`);
      checkedTodo?.remove();
    };

    todoParent.appendChild(aInner);
    // todoParent.appendChild(document.createElement('br'));
    todoParent.appendChild(markAsIncompleteButton);
    ul.appendChild(todoParent);
  });

  div.appendChild(ul);

  rsSection.appendChild(h2);
  rsSection.appendChild(div);

  const main = document.querySelector('#right-side');
  main?.appendChild(rsSection);
}
