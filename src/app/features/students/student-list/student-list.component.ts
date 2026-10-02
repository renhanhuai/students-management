import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Student } from '../../../core/models/student.model';
import { NotificationService } from '../../../core/services/notification.service';
import { StudentService } from '../../../core/services/student.service';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  isLoading = true;
  hasError = false;

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
