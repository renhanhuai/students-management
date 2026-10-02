import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from '../../../core/models/course.model';
import { Student } from '../../../core/models/student.model';
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
  isEdit = false;
  studentId: string | null = null;
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
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id');
    this.isEdit = this.studentId !== null;

    if (this.studentId) {
      this.loadStudent(this.studentId);
    }

    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
      },
      error: () => {
        this.notificationService.error('Unable to load courses. Please try again.');
      }
    });
  }

  private loadStudent(id: string): void {
    this.studentService.getStudentById(id).subscribe({
      next: (student: Student) => {
        this.form.patchValue({
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          phone: student.phone,
          courseIds: student.courseIds
        });
        this.form.markAsPristine();
        this.form.markAsUntouched();
      },
      error: () => {
        this.notificationService.error('Unable to load this student. Please try again.');
        void this.router.navigate(['/students']);
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

  saveStudent(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const studentRequest = this.isEdit && this.studentId
      ? this.studentService.updateStudent(this.studentId, this.form.getRawValue())
      : this.studentService.createStudent(this.form.getRawValue());

    studentRequest
      .subscribe({
        next: () => {
          this.form.markAsUntouched();
          this.notificationService.success(`Student ${this.isEdit ? 'updated' : 'created'} successfully.`);
          void this.router.navigate(['/students']);
        },
        error: () => {
          this.notificationService.error(`Unable to ${this.isEdit ? 'update' : 'create'} student. Please try again.`);
        }
      });
  }

  cancel(): void {
    void this.router.navigate(['/students']);
  }

}
