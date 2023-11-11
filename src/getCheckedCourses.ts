
// Get the course ID for the current grade page
export function getCheckedCourses(): number[] {

  let checkedCourses: number[] = [];
  
  // Get the course list
  const courseList = document.querySelector('#calendars-context-list');
  
  if (!courseList) {
    return checkedCourses;
  }

  // Get each course
  const courses = Array.from(courseList.querySelectorAll('li'));
  
  courses.forEach(course => {
    // Get course id
    const dataContext = course.getAttribute('data-context');
    const isChecked = course.classList.contains('checked');

    // If it is a course and it is checked, add it to the list
    if (isChecked && dataContext?.includes('course_')) {

      const courseId = parseInt(dataContext.split('_')[1]);
      checkedCourses.push(courseId);
    }
  })

  return checkedCourses;
}