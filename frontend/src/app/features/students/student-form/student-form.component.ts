import { Component, HostListener, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { Course } from '../../../core/models/course.model';
import { CourseService } from '../../../core/services/course.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
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
  private readonly courseService = inject(CourseService);
  private readonly studentService = inject(StudentService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  courses: Course[] = [];
  isEdit = false;
  studentId: string | null = null;
  readonly form = this.formBuilder.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.pattern(/^\d{10}$/), Validators.maxLength(10)]],
    courseIds: this.formBuilder.nonNullable.control<string[]>([]),
  });

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id');
    this.isEdit = this.studentId !== null;

    if (this.studentId !== null) {
      this.loadStudentAndCourses(this.studentId);
      return;
    }

    this.loadCourses();
  }

  private loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
      },
      error: () => {
        this.notificationService.error('Unable to load courses. Please try again.');
      }
    });
  }

  private loadStudentAndCourses(id: string): void {
    forkJoin({
      student: this.studentService.getStudentById(id),
      courses: this.courseService.getCourses()
    }).subscribe({
      next: ({ student, courses }) => {
        this.courses = courses;
        this.form.patchValue({
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          phone: student.phone,
          courseIds: this.getValidCourseIds(student.courseIds)
        });
      },
      error: () => {
        this.notificationService.error('Unable to load this student and its courses. Please try again.');
        void this.router.navigate(['/students']);
      }
    });
  }

  isCourseSelected(courseId: string): boolean {
    return this.form.controls.courseIds.value.includes(courseId);
  }

  get selectedCourseCount(): number {
    return this.getValidCourseIds(this.form.controls.courseIds.value).length;
  }

  private getValidCourseIds(courseIds: string[]): string[] {
    const availableCourseIds = new Set(this.courses.map((course) => course.id));
    return courseIds.filter((courseId) => availableCourseIds.has(courseId));
  }

  toggleCourse(course: Course, event: Event): void {
    const selectedCourseIds = this.form.controls.courseIds.value;
    const isSelected = (event.target as HTMLInputElement).checked;
    const courseId = course.id;
    const updatedCourseIds = isSelected
      ? [...selectedCourseIds, courseId]
      : selectedCourseIds.filter((selectedId) => selectedId !== courseId);

    this.form.controls.courseIds.setValue(updatedCourseIds);
  }

  saveStudent(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const studentData = this.form.getRawValue();
    const studentRequestData = {
      ...studentData,
      courseIds: this.getValidCourseIds(studentData.courseIds)
    };
    const studentRequest = this.isEdit && this.studentId
      ? this.studentService.updateStudent(this.studentId, studentRequestData)
      : this.studentService.createStudent(studentRequestData);

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

  canLeavePage(): Observable<boolean> {
    if (!this.form.touched) {
      return of(true);
    }

    return this.confirmationService.confirm({
      title: 'Confirmation',
      message: `Discard this student ${this.isEdit ? 'edit' : 'create'} form and leave?`,
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
