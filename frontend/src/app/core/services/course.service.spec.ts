import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Course } from '../models/course.model';
import { ApiService } from './api.service';
import { CourseService } from './course.service';

describe('CourseService', () => {
  let service: CourseService;
  let http: HttpTestingController;
  const course: Course = {
    id: 'course-1', name: 'Biology', code: 'BIO101',
    description: 'Introductory biology', instructor: 'Dr. Lee'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(CourseService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('caches the course request and publishes the result', () => {
    const emissions: Course[][] = [];
    service.courses$.subscribe((courses) => emissions.push(courses));
    service.getCourses().subscribe();
    service.getCourses().subscribe();

    const request = http.expectOne(TestBed.inject(ApiService).coursesUrl);
    expect(request.request.method).toBe('GET');
    request.flush([course]);
    expect(emissions.at(-1)).toEqual([course]);
  });

  it('creates a course and invalidates the cached list', () => {
    service.getCourses().subscribe();
    http.expectOne(TestBed.inject(ApiService).coursesUrl).flush([]);
    service.createCourse({ name: course.name, code: course.code, description: course.description, instructor: course.instructor }).subscribe();
    const request = http.expectOne(TestBed.inject(ApiService).coursesUrl);
    expect(request.request.method).toBe('POST');
    request.flush(course);

    service.getCourses().subscribe();
    http.expectOne(TestBed.inject(ApiService).coursesUrl).flush([course]);
  });

  it('gets a course by id', () => {
    service.getCourseById('course-1').subscribe();
    const request = http.expectOne(`${TestBed.inject(ApiService).coursesUrl}/course-1`);
    expect(request.request.method).toBe('GET');
    request.flush(course);
  });
});
