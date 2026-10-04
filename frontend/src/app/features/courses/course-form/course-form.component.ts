import { Component, HostListener, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, take } from 'rxjs';
import { CourseService } from '../../../core/services/course.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './course-form.component.html',
  styleUrl: './course-form.component.css'
})
export class CourseFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly courseService = inject(CourseService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    code: ['', Validators.required],
    description: ['', Validators.required],
    instructor: ['', Validators.required]
  });
  courseId: string | null = null;
  isEdit: boolean = false;

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id');
    if (this.courseId) {
      this.isEdit = true;
      this.loadCourseFromCache(this.courseId);
    }
  }

  private loadCourseFromCache(id: string): void {
    this.courseService
      .courses$
      .pipe(take(1))
      .subscribe({
        next: (courses) => {
          const course = courses.find((item) => item.id === id);
          if (!course) {
            void this.router.navigate(['/courses']);
            return;
          }
          this.form.patchValue({
            name: course.name,
            code: course.code,
            description: course.description,
            instructor: course.instructor
          });
        },
      });
  }

  saveCourse(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const courseRequest = this.isEdit && this.courseId
      ? this.courseService.updateCourse(this.courseId, this.form.getRawValue())
      : this.courseService.createCourse(this.form.getRawValue());

    courseRequest
      .subscribe({
        next: () => {
          this.form.markAsUntouched();
          const message = `Course ${this.isEdit ? 'updated' : 'created'} successfully.`;
          this.notificationService.success(message);
          void this.router.navigate(['/courses']);
        },
        error: () => {
          const message = `Unable to ${this.isEdit ? 'update' : 'create'} course. Please try again.`;
          this.notificationService.error(message);
        }
      });
  }

  cancel(): void {
    void this.router.navigate(['/courses']);
  }

  canLeavePage(): Observable<boolean> {
    if (!this.form.touched) {
      return of(true);
    }

    return this.confirmationService.confirm({
      title: 'Confirmation',
      message: `Discard this course ${this.isEdit ? 'edit' : 'create'} form and leave?`,
      confirmLabel: 'Leave page',
      cancelLabel: 'Continue editing',
      destructive: true
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  confirmBrowserExit(event: BeforeUnloadEvent): void {
    if (this.form.touched) {
      event.preventDefault();
      event.returnValue = '';
    }
  }
}
