import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Course } from '../../../core/models/course.model';
import { Student } from '../../../core/models/student.model';
import { CourseService } from '../../../core/services/course.service';
import { NotificationService } from '../../../core/services/notification.service';
import { StudentService } from '../../../core/services/student.service';
import { EnrolledCoursesComponent } from '../../../shared/components/enrolled-courses/enrolled-courses.component';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [RouterLink, EnrolledCoursesComponent],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  courses: Course[] = [];
  isLoading = true;
  hasError = false;
  expandedStudentId: number | string | null = null;

  constructor(
    private readonly studentService: StudentService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.requestStudents(false);
  }

  loadStudents(): void {
    this.requestStudents(true);
  }

  formatPhoneNumber(phone: string): string {
    const digits = phone.replace(/\D/g, '');

    if (digits.length !== 10) {
      return phone;
    }

    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  toggleCourses(student: Student): void {
    if (this.isExpanded(student)) {
      this.expandedStudentId = null;
      return;
    }

    this.expandedStudentId = student.id;
  }

  isExpanded(student: Student): boolean {
    return this.expandedStudentId === student.id;
  }

  getStudentCourses(student: Student): Course[] {
    return this.courses.filter((course) =>
      student.courseIds.some((courseId) => String(courseId) === String(course.id))
    );
  }

  private requestStudents(refresh: boolean): void {
    this.isLoading = true;
    this.hasError = false;

    const studentsRequest = refresh ? this.studentService.refreshStudents() : this.studentService.getStudents();

    studentsRequest
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe({
        next: (students : Student[]) => {
          this.students = students;
        },
        error: () => {
          this.hasError = true;
          this.notificationService.error('Unable to load students. Please try again later.');
        }
      });
  }
}
