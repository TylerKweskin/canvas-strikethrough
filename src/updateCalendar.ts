import { displayCheckedTodos } from "./displayCheckedTodos";
import { getCalendarView, getEvents } from "./getCalendarEvents";
import { getCheckedCourses } from "./getCheckedCourses";
import { getCheckedTodos } from "./storage";
import { Todo, CalendarEvent } from "./types";
import { checkEvent } from "./updateCalendarEvent";

export async function calendar() {

  // Get checked courses
  const courseList: number[] = getCheckedCourses();

  // Get all checked assignments
  const checkedTodos: Todo[] = getCheckedTodos(courseList);

  // Display checked todos list
  displayCheckedTodos();

  // Get all calendar events
  const calendarView = getCalendarView();
  const calendarEvents: CalendarEvent[] = getEvents(calendarView);

  calendarEvents.forEach((event: CalendarEvent) => {
    const { name, element } = event;

    // If assignment is checked
    if (checkedTodos.find((todo: Todo) => todo.name.trim() === name.trim())) {
      checkEvent(element);
    }
  });
}
