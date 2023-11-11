export type Todo = {
  type: "assignment" | "page";
  id: number;
  courseId: number;
  name: string;
};

export type CalendarEvent = {
  name: string;
  element: Element;
};