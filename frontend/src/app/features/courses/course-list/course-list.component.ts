import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Course } from '../../../core/models/course.model';
import { CourseService } from '../../../core/services/course.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css'
})
export class CourseListComponent implements OnInit {
  private readonly courseService = inject(CourseService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly notificationService = inject(NotificationService);
  readonly courses$ = this.courseService.courses$;
  deletingCourseId: string | null = null;

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
        error: () => {
          this.notificationService.error('Unable to load courses. Please try again later.');
        }
      });
  }

  deleteCourse(course: Course): void {
    const courseId = course.id;
    this.confirmationService.confirm({
      title: 'Confirmation',
      message: `Delete "${course.name}"? This action cannot be undone.`,
      confirmLabel: 'Delete course',
      destructive: true
    }).subscribe((confirmed) => {
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
            this.notificationService.success('Course deleted successfully.');
          },
          error: () => {
            this.notificationService.error('Unable to delete course. Please try again.');
          }
        });
      });
  }
}
