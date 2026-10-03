import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';
import { Course } from '../models/course.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiService);
  private readonly coursesSubject = new BehaviorSubject<Course[]>([]);
  private coursesRequest$: Observable<Course[]> | null = null;

  readonly courses$ = this.coursesSubject.asObservable();

  getCourses(): Observable<Course[]> {
    if (!this.coursesRequest$) {
      this.coursesRequest$ = this.getCoursesRequest();
    }
    return this.coursesRequest$;
  }

  refreshCourses(): Observable<Course[]> {
    this.coursesRequest$ = this.getCoursesRequest();
    return this.coursesRequest$;
  }

  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.api.coursesUrl}/${id}`);
  }

  createCourse(course: Omit<Course, 'id'>): Observable<Course> {
    return this.http.post<Course>(this.api.coursesUrl, course).pipe(
      tap(() => {
        this.coursesRequest$ = null;
      })
    );
  }

  updateCourse(id: string, course: Omit<Course, 'id'>): Observable<Course> {
    return this.http.put<Course>(`${this.api.coursesUrl}/${id}`, course).pipe(
      tap(() => {
        this.coursesRequest$ = null;
      })
    );
  }

  deleteCourse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api.coursesUrl}/${id}`).pipe(
      tap(() => {
        this.coursesSubject.next(
          this.coursesSubject.value.filter((course) => course.id !== id)
        );
        this.coursesRequest$ = null;
      })
    );
  }

  private getCoursesRequest(): Observable<Course[]> {
    return this.http.get<Course[]>(this.api.coursesUrl).pipe(
      tap((courses) => this.coursesSubject.next(courses)),
      shareReplay({ bufferSize: 1, refCount: false })
    );
  }
}
