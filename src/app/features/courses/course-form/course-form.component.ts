import { Component, HostListener, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { CourseService } from '../../../core/services/course.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.css'
})
export class CourseFormComponent {
  private readonly formBuilder = inject(FormBuilder);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    code: ['', Validators.required],
    description: ['', Validators.required],
    instructor: ['', Validators.required]
  });
  isSaving = false;

  constructor(
    private readonly courseService: CourseService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) {}

  saveCourse(): void {
    if (this.isSaving) {
      return;
    }

    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.isSaving = true;
    this.courseService.createCourse(this.form.getRawValue())
      .pipe(finalize(() => {
        this.isSaving = false;
      }))
      .subscribe({
        next: () => {
          this.form.markAsUntouched();
          this.notificationService.success('Course created successfully.');
          void this.router.navigate(['/courses']);
        },
        error: () => {
          this.notificationService.error('Unable to create course. Please try again.');
        }
      });
  }

  cancel(): void {
    void this.router.navigate(['/courses']);
  }

  canLeavePage(): boolean {
    return !this.form.touched || window.confirm('Discard this course form and leave?');
  }

  @HostListener('window:beforeunload', ['$event'])
  confirmBrowserExit(event: BeforeUnloadEvent): void {
    if (this.form.touched) {
      event.preventDefault();
      event.returnValue = '';
    }
  }
}
