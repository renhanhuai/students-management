import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { Course } from '../../../core/models/course.model';
import { Student } from '../../../core/models/student.model';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { CourseService } from '../../../core/services/course.service';
import { NotificationService } from '../../../core/services/notification.service';
import { StudentService } from '../../../core/services/student.service';
import { StudentListComponent } from './student-list.component';

describe('StudentListComponent', () => {
  const student: Student = {
    id: 'student-1', firstName: 'Alex', lastName: 'Morgan',
    email: 'alex.morgan@example.com', phone: '5550100123', courseIds: ['course-1']
  };
  const course: Course = {
    id: 'course-1', name: 'Biology', code: 'BIO101',
    description: 'Introductory biology', instructor: 'Dr. Lee'
  };
  let getStudents: ReturnType<typeof vi.fn>;
  let refreshStudents: ReturnType<typeof vi.fn>;
  let deleteStudent: ReturnType<typeof vi.fn>;
  let getCourses: ReturnType<typeof vi.fn>;
  let showError: ReturnType<typeof vi.fn>;
  let showSuccess: ReturnType<typeof vi.fn>;
  let confirm: ReturnType<typeof vi.fn>;
  let studentState: BehaviorSubject<Student[]>;
  let courseState: BehaviorSubject<Course[]>;

  beforeEach(async () => {
    studentState = new BehaviorSubject<Student[]>([student]);
    courseState = new BehaviorSubject<Course[]>([course]);
    getStudents = vi.fn().mockReturnValue(of([student]));
    refreshStudents = vi.fn().mockReturnValue(of([student]));
    deleteStudent = vi.fn().mockImplementation((studentId: string) => {
      studentState.next(studentState.value.filter((item) => item.id !== studentId));
      return of(void 0);
    });
    getCourses = vi.fn().mockReturnValue(of([course]));
    showError = vi.fn();
    showSuccess = vi.fn();
    confirm = vi.fn().mockReturnValue(of(false));

    await TestBed.configureTestingModule({
      imports: [StudentListComponent],
      providers: [
        provideRouter([]),
        {
          provide: StudentService,
          useValue: { students$: studentState.asObservable(), getStudents, refreshStudents, deleteStudent }
        },
        { provide: CourseService, useValue: { courses$: courseState.asObservable(), getCourses } },
        { provide: NotificationService, useValue: { error: showError, success: showSuccess } },
        { provide: ConfirmationService, useValue: { confirm } }
      ]
    }).compileComponents();
  });

  it('loads and displays students and formats phone numbers', () => {
    const fixture = TestBed.createComponent(StudentListComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Alex Morgan');
    expect(fixture.nativeElement.textContent).toContain('alex.morgan@example.com');
    expect(fixture.nativeElement.textContent).toContain('555-010-0123');
    expect(getStudents).toHaveBeenCalled();
    expect(getCourses).toHaveBeenCalled();
  });

  it('links each student edit action to its edit route', () => {
    const fixture = TestBed.createComponent(StudentListComponent);
    fixture.detectChanges();

    const editLink = fixture.nativeElement.querySelector(
      'a[aria-label="Edit Alex Morgan"]'
    ) as HTMLAnchorElement;
    expect(editLink.getAttribute('href')).toBe('/students/student-1/edit');
  });

  it('shows an empty state when there are no students', () => {
    studentState.next([]);
    const fixture = TestBed.createComponent(StudentListComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No students have been added yet.');
  });

  it('updates the rendered list when the service state changes', () => {
    const fixture = TestBed.createComponent(StudentListComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Alex Morgan');

    studentState.next([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No students have been added yet.');
  });

  it('shows deletion from the service state without manually changing component state', () => {
    confirm.mockReturnValue(of(true));
    const fixture = TestBed.createComponent(StudentListComponent);
    fixture.detectChanges();

    fixture.componentInstance.deleteStudent(student);
    fixture.detectChanges();

    expect(deleteStudent).toHaveBeenCalledWith('student-1');
    expect(fixture.nativeElement.textContent).toContain('No students have been added yet.');
  });

  it('expands a student row to show enrolled courses', () => {
    const fixture = TestBed.createComponent(StudentListComponent);
    fixture.detectChanges();
    fixture.componentInstance.toggleCourses(student);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('BIO101');
    expect(fixture.componentInstance.isExpanded(student)).toBe(true);
  });

  it('refreshes the student list', () => {
    const fixture = TestBed.createComponent(StudentListComponent);
    fixture.detectChanges();
    fixture.componentInstance.loadStudents();

    expect(refreshStudents).toHaveBeenCalled();
  });

  it('reports a failed student request', () => {
    getStudents.mockReturnValue(throwError(() => new Error('Request failed')));
    const fixture = TestBed.createComponent(StudentListComponent);
    fixture.detectChanges();

    expect(showError).toHaveBeenCalledWith(
      'Unable to load students. Please try again later.'
    );
  });
});
