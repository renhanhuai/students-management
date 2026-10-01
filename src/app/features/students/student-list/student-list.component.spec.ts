import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { Student } from '../../../core/models/student.model';
import { NotificationService } from '../../../core/services/notification.service';
import { StudentService } from '../../../core/services/student.service';
import { StudentListComponent } from './student-list.component';

describe('StudentListComponent', () => {
  let studentsResponse: Subject<Student[]>;
  let getStudentsSpy: jasmine.Spy;
  let showErrorSpy: jasmine.Spy;

  beforeEach(async () => {
    studentsResponse = new Subject<Student[]>();
    getStudentsSpy = jasmine.createSpy('getStudents').and.returnValue(studentsResponse);
    showErrorSpy = jasmine.createSpy('error');

    await TestBed.configureTestingModule({
      imports: [StudentListComponent],
      providers: [
        {
          provide: StudentService,
          useValue: { getStudents: getStudentsSpy }
        },
        {
          provide: NotificationService,
          useValue: { error: showErrorSpy }
        }
      ]
    }).compileComponents();
  });

  it('shows a loading message while the request is pending', () => {
    const fixture = TestBed.createComponent(StudentListComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Loading students...');
  });

  it('shows an empty state when the response contains no students', () => {
    const fixture = TestBed.createComponent(StudentListComponent);
    fixture.detectChanges();
    studentsResponse.next([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No students have been added yet.');
  });

  it('requests the student list again when Refresh is clicked', () => {
    const fixture = TestBed.createComponent(StudentListComponent);
    fixture.detectChanges();
    studentsResponse.next([]);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    expect(getStudentsSpy).toHaveBeenCalledTimes(2);
    expect(fixture.nativeElement.textContent).toContain('Loading students...');
  });

  it('renders student data returned by the service', () => {
    const fixture = TestBed.createComponent(StudentListComponent);
    fixture.detectChanges();
    studentsResponse.next([
      {
        id: 1,
        firstName: 'Alex',
        lastName: 'Morgan',
        email: 'alex.morgan@example.com',
        phone: '555-0100',
        courseIds: []
      }
    ]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Alex Morgan');
    expect(fixture.nativeElement.textContent).toContain('alex.morgan@example.com');
  });

  it('shows an error message when the request fails', () => {
    const fixture = TestBed.createComponent(StudentListComponent);
    fixture.detectChanges();
    studentsResponse.error(new Error('Request failed'));
    fixture.detectChanges();

    expect(showErrorSpy).toHaveBeenCalledWith(
      'Unable to load students. Please try again later.'
    );
    expect(fixture.nativeElement.textContent).not.toContain('No students have been added yet.');
  });
});
