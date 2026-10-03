import { Routes } from '@angular/router';
import { courseFormCanDeactivate } from './features/courses/course-form/course-form.guard';
import { studentFormCanDeactivate } from './features/students/student-form/student-form.guard';

export const routes: Routes = [
  {
    path: 'students',
    loadComponent: () =>
      import('./features/students/student-list/student-list.component').then(
        (component) => component.StudentListComponent
      )
  },
  {
    path: 'students/new',
    canDeactivate: [studentFormCanDeactivate],
    loadComponent: () =>
      import('./features/students/student-form/student-form.component').then(
        (component) => component.StudentFormComponent
    )
  },
  {
    path: 'students/:id/edit',
    canDeactivate: [studentFormCanDeactivate],
    loadComponent: () =>
      import('./features/students/student-form/student-form.component').then(
        (component) => component.StudentFormComponent
      )
  },
  {
    path: 'courses/:id/edit',
    canDeactivate: [courseFormCanDeactivate],
    loadComponent: () =>
      import('./features/courses/course-form/course-form.component').then(
        (component) => component.CourseFormComponent
      )
  },
  {
    path: 'courses/new',
    canDeactivate: [courseFormCanDeactivate],
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
