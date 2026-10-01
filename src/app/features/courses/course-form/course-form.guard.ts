import { CanDeactivateFn } from '@angular/router';
import { CourseFormComponent } from './course-form.component';

export const courseFormCanDeactivate: CanDeactivateFn<CourseFormComponent> = (component) =>
  component.canLeavePage();
