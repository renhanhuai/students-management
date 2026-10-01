import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'students',
    loadComponent: () =>
      import('./features/students/student-list/student-list.component').then(
        (component) => component.StudentListComponent
      )
  },
  {
    path: 'courses/new',
    loadComponent: () =>
      import('./features/courses/course-form/course-form.component').then(
        (component) => component.CourseFormComponent
      )
  },
  {
    path: 'courses',
    loadComponent: () =>
      import('./features/courses/course-list/course-list.component').then(
        (component) => component.CourseListComponent
      )
  },
  { path: '', pathMatch: 'full', redirectTo: 'students' },
  { path: '**', redirectTo: 'students' }
];
