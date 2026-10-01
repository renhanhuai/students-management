import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { Course } from '../../../core/models/course.model';
import { CourseService } from '../../../core/services/course.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css'
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  isLoading = true;
  hasError = false;

  constructor(
    private readonly courseService: CourseService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCourses(false);
  }

  refreshCourses(): void {
    this.loadCourses(true);
  }

  private loadCourses(refresh: boolean): void {
    this.isLoading = true;
    this.hasError = false;

    const coursesRequest = refresh ? this.courseService.refreshCourses() : this.courseService.getCourses();

    coursesRequest
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe({
        next: (courses : Course[]) => {
          this.courses = courses;
        },
        error: () => {
          this.hasError = true;
          this.notificationService.error('Unable to load courses. Please try again later.');
        }
      });
  }
}
