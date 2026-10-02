import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Course } from '../../../core/models/course.model';
import { CourseService } from '../../../core/services/course.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css'
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  deletingCourseId: string | null = null;

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
    const coursesRequest = refresh ? this.courseService.refreshCourses() : this.courseService.getCourses();

    coursesRequest
      .subscribe({
        next: (courses : Course[]) => {
          this.courses = courses;
        },
        error: () => {
          this.notificationService.error('Unable to load courses. Please try again later.');
        }
      });
  }

  deleteCourse(course: Course): void {
    const courseId = String(course.id);
    const confirmed = window.confirm(`Delete the course "${course.name}"?`);
    if (!confirmed) {
      return;
    }

    this.deletingCourseId = courseId;
    this.courseService
      .deleteCourse(courseId)
      .pipe(finalize(() => {
        this.deletingCourseId = null;
      }))
      .subscribe({
        next: () => {
          this.courses = this.courses.filter((item) => String(item.id) !== courseId);
          this.notificationService.success('Course deleted successfully.');
        },
        error: () => {
          this.notificationService.error('Unable to delete course. Please try again.');
        }
      });
  }
}
