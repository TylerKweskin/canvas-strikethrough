import { Todo } from "./types";

// Get all checked todos
export function getCheckedTodos(courseList?: number[]): Todo[] {

  let checkedTodo: Todo[] = JSON.parse(localStorage.getItem('checkedTodo') || '[]');

  console.log('getting checked todos', checkedTodo);

  // Filter out todos when looking at specific courses
  if (courseList !== undefined) {
    // Filter checked todos by course list
    checkedTodo = checkedTodo.filter((todo: Todo) => {
      return courseList.includes(todo.courseId);
    });
  }

  return checkedTodo;
}

// Get specific checked todo
export function isTodoChecked(courseId: number, todoId: number): boolean {

  // Get checked todos
  const checkedTodos: Todo[] = getCheckedTodos([courseId]);

  // Find todo
  const todo = checkedTodos.find((todo: Todo) => todo.id === todoId);

  // If todo is found, return true
  if (todo) {
    return true;
  }

  return false;
}

// Add checked todo
export function addCheckedTodo(todo: Todo) {

  // Get checked todos
  const checkedTodos: Todo[] = getCheckedTodos();

  // Add todo
  checkedTodos.push(todo);

  // Save checked todos
  localStorage.setItem('checkedTodo', JSON.stringify(checkedTodos));
}

// Remove checked todo
export function removeCheckedTodo(id: number) {

  // Get checked todos
  const checkedTodos: Todo[] = getCheckedTodos();

  // Remove todo
  const index = checkedTodos.findIndex((todo: Todo) => todo.id === id);
  checkedTodos.splice(index, 1);

  // Save checked todos
  localStorage.setItem('checkedTodo', JSON.stringify(checkedTodos));
}