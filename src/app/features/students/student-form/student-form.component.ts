import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Course } from '../../../core/models/course.model';
import { CourseService } from '../../../core/services/course.service';
import { NotificationService } from '../../../core/services/notification.service';
import { StudentService } from '../../../core/services/student.service';
import { NumbersOnlyDirective } from '../../../shared/directives/numbers-only.directive';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [ReactiveFormsModule, NumbersOnlyDirective],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.css',
})
export class StudentFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  courses: Course[] = [];
  enrolledCourses: Course[] = [];
  isSaving = false;
  readonly form = this.formBuilder.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.pattern(/^\d{10}$/), Validators.maxLength(10)]],
    courseIds: this.formBuilder.nonNullable.control<Array<number | string>>([]),
  });

  constructor(
    private readonly courseService: CourseService,
    private readonly studentService: StudentService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
      },
      error: () => {
        this.notificationService.error('Unable to load courses. Please try again.');
      }
    });
  }

  toggleCourse(courseId: number | string, event: Event): void {
    const selectedCourseIds = this.form.controls.courseIds.value;
    const isSelected = (event.target as HTMLInputElement).checked;
    const updatedCourseIds = isSelected
      ? [...selectedCourseIds, courseId]
      : selectedCourseIds.filter((selectedId) => String(selectedId) !== String(courseId));

    this.form.controls.courseIds.setValue(updatedCourseIds);
  }

  createStudent(): void {
    if (this.isSaving) {
      return;
    }

    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.isSaving = true;
    this.studentService.createStudent(this.form.getRawValue())
      .pipe(finalize(() => {
        this.isSaving = false;
      }))
      .subscribe({
        next: () => {
          this.form.markAsUntouched();
          this.notificationService.success('Student created successfully.');
          void this.router.navigate(['/students']);
        },
        error: () => {
          this.notificationService.error('Unable to create student. Please try again.');
        }
      });
  }

  cancel(): void {
    void this.router.navigate(['/students']);
  }

}
