import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Student } from '../models/student.model';
import { ApiService } from './api.service';
import { StudentService } from './student.service';

describe('StudentService', () => {
  let service: StudentService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(StudentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('requests and returns the student collection', () => {
    const expectedStudents: Student[] = [
      {
        id: 'student-1',
        firstName: 'Alex',
        lastName: 'Morgan',
        email: 'alex.morgan@example.com',
        phone: '555-0100',
        courseIds: []
      }
    ];
    let actualStudents: Student[] | undefined;

    service.getStudents().subscribe((students) => {
      actualStudents = students;
    });

    const request = httpTestingController.expectOne(TestBed.inject(ApiService).studentsUrl);
    expect(request.request.method).toBe('GET');
    request.flush(expectedStudents);

    expect(actualStudents).toEqual(expectedStudents);
  });
});
