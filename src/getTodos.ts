import { Todo } from "./types";

export async function getAssignment(courseId: number, assignmentId: number) {

  if (!courseId || !assignmentId) {
    return null;
  }

  // Get assignment data
  const assignmentReq = await fetch(`/api/v1/courses/${courseId}/assignments/${assignmentId}`);
  // Get submission data
  const submissionReq = await fetch(`/api/v1/courses/${courseId}/students/submissions?assignment_ids[]=${assignmentId}`);

  // Parse json
  const assignmentData = await assignmentReq.json();
  const submissionData = await submissionReq.json();

  // Check if assignment is submitted
  const isSubmitted = submissionData[0].workflow_state !== 'unsubmitted';

  // Create todo object
  const assignment: Todo = {
    type: 'assignment',
    courseId,
    id: assignmentId,
    name: assignmentData.name
  };

  return {
    todo: assignment,
    isSubmitted
  };
}

export async function getPage(courseId: number, pageId: number | string) {

  if (!courseId || !pageId) {
    return null;
  }

  // Check if pageId is a number or a string
  const pageIdType = typeof pageId === 'number' ? 'pageId' : 'pageUrl';

  // Get page data
  const pageReq = await fetch(`/api/v1/courses/${courseId}/pages/${pageId}`);
  const pageData = await pageReq.json();

  console.log(pageData);

  // Create todo object
  const page: Todo = {
    type: 'page',
    courseId,
    id: typeof pageId === 'number' ? pageId : pageData.page_id,
    name: pageData.title
  };

  return {
    todo: page,
    isSubmitted: false
  }
}