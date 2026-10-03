import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../../../core/models/course.model';
import { Student } from '../../../core/models/student.model';
import { CourseService } from '../../../core/services/course.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { NotificationService } from '../../../core/services/notification.service';
import { StudentService } from '../../../core/services/student.service';
import { EnrolledCoursesComponent } from '../../../shared/components/enrolled-courses/enrolled-courses.component';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [AsyncPipe, RouterLink, EnrolledCoursesComponent],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit {
  private readonly studentService = inject(StudentService);
  private readonly courseService = inject(CourseService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly notificationService = inject(NotificationService);
  readonly students$ = this.studentService.students$;
  readonly courses$ = this.courseService.courses$;
  expandedStudentId: string | null = null;

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

  getStudentCourses(student: Student, courses: Course[]): Course[] {
    return courses.filter((course) =>
      student.courseIds.includes(course.id)
    );
  }

  deleteStudent(student: Student): void {
    const studentId = student.id;
    this.confirmationService.confirm({
      title: 'Confirmation',
      message: `Delete ${student.firstName} ${student.lastName}? This action cannot be undone.`,
      confirmLabel: 'Delete student',
      destructive: true
    }).subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.studentService.deleteStudent(studentId)
        .subscribe({
          next: () => {
            if (this.expandedStudentId === studentId) {
              this.expandedStudentId = null;
            }
            this.notificationService.success('Student deleted successfully.');
          },
          error: () => {
            this.notificationService.error('Unable to delete student. Please try again.');
          }
        });
      });
  }

  private requestStudents(refresh: boolean): void {
    this.courseService.getCourses().subscribe({
      error: () => {
        this.notificationService.error('Unable to load courses. Please try again later.');
      }
    })

    const studentsRequest = refresh ? this.studentService.refreshStudents() : this.studentService.getStudents();

    studentsRequest.subscribe({
        error: () => {
          this.notificationService.error('Unable to load students. Please try again later.');
        }
      });
  }
}
