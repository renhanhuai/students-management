import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
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

  beforeEach(async () => {
    getStudents = vi.fn().mockReturnValue(of([student]));
    refreshStudents = vi.fn().mockReturnValue(of([student]));
    deleteStudent = vi.fn().mockReturnValue(of(void 0));
    getCourses = vi.fn().mockReturnValue(of([course]));
    showError = vi.fn();
    showSuccess = vi.fn();
    confirm = vi.fn().mockReturnValue(of(false));

    await TestBed.configureTestingModule({
      imports: [StudentListComponent],
      providers: [
        provideRouter([]),
        { provide: StudentService, useValue: { getStudents, refreshStudents, deleteStudent } },
        { provide: CourseService, useValue: { getCourses } },
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

  it('shows an empty state when there are no students', () => {
    getStudents.mockReturnValue(of([]));
    const fixture = TestBed.createComponent(StudentListComponent);
    fixture.detectChanges();

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
