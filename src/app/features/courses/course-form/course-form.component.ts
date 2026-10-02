import { Component, HostListener, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Course } from '../../../core/models/course.model';
import { CourseService } from '../../../core/services/course.service';
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

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    code: ['', Validators.required],
    description: ['', Validators.required],
    instructor: ['', Validators.required]
  });
  courseId: string | null = null;
  isEdit: boolean = false;

  constructor(
    private readonly courseService: CourseService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id');
    if (this.courseId) {
      this.isEdit = true;
      this.loadCourse(this.courseId);
    }
  }

  private loadCourse(id: string): void {
    this.courseService
      .getCourseById(id)
      .subscribe({
        next: (course: Course) => {
          this.form.patchValue({
            name: course.name,
            code: course.code,
            description: course.description,
            instructor: course.instructor
          });
        },
        error: () => {
          this.notificationService.error('Unable to load this course. Please try again.');
          void this.router.navigate(['/courses']);
        }
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

  canLeavePage(): boolean {
    if (!this.form.touched) {
      return true;
    }
    return window.confirm(`Discard this course ${this.isEdit ? 'edit' : 'create'} form and leave?`);
  }

  @HostListener('window:beforeunload', ['$event'])
  confirmBrowserExit(event: BeforeUnloadEvent): void {
    if (this.form.touched) {
      event.preventDefault();
      event.returnValue = '';
    }
  }
}
