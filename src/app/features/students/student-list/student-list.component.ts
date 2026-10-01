import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { Student } from '../../../core/models/student.model';
import { NotificationService } from '../../../core/services/notification.service';
import { StudentService } from '../../../core/services/student.service';

@Component({
  selector: 'app-student-list',
  standalone: true,
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
    this.loadStudents();
  }

  loadStudents(): void {
    this.isLoading = true;
    this.hasError = false;

    this.studentService
      .getStudents()
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
