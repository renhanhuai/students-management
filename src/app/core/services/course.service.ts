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
  private coursesRequest$: Observable<Course[]> = this.createCoursesRequest();

  readonly courses$ = this.coursesSubject.asObservable();

  getCourses(): Observable<Course[]> {
    return this.coursesRequest$;
  }

  refreshCourses(): Observable<Course[]> {
    this.coursesRequest$ = this.createCoursesRequest();
    return this.coursesRequest$;
  }

  private createCoursesRequest(): Observable<Course[]> {
    return this.http.get<Course[]>(this.api.coursesUrl).pipe(
      tap((courses) => this.coursesSubject.next(courses)),
      shareReplay({ bufferSize: 1, refCount: false })
    );
  }
}
