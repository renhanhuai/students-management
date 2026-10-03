import { CanDeactivateFn } from '@angular/router';
import { StudentFormComponent } from './student-form.component';

export const studentFormCanDeactivate: CanDeactivateFn<StudentFormComponent> = (component) =>
  component.canLeavePage();
