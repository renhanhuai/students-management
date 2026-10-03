import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    service = TestBed.inject(ApiService);
  });

  it('provides the student collection URL', () => {
    expect(service.studentsUrl).toBe('http://localhost:3000/students');
  });

  it('provides the course collection URL', () => {
    expect(service.coursesUrl).toBe('http://localhost:3000/courses');
  });
});
