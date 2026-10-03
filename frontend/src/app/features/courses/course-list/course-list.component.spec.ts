import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { vi } from 'vitest';
import { Course } from '../../../core/models/course.model';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { CourseService } from '../../../core/services/course.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CourseListComponent } from './course-list.component';

describe('CourseListComponent', () => {
  const course = {
    id: 'course-1',
    name: 'Biology',
    code: 'BIO101',
    description: 'Introductory biology',
    instructor: 'Dr. Lee'
  };
  let getCourses: ReturnType<typeof vi.fn>;
  let refreshCourses: ReturnType<typeof vi.fn>;
  let deleteCourse: ReturnType<typeof vi.fn>;
  let showError: ReturnType<typeof vi.fn>;
  let showSuccess: ReturnType<typeof vi.fn>;
  let confirm: ReturnType<typeof vi.fn>;
  let courseState: BehaviorSubject<Course[]>;

  beforeEach(async () => {
    courseState = new BehaviorSubject<Course[]>([course]);
    getCourses = vi.fn(() => of([course]));
    refreshCourses = vi.fn(() => of([course]));
    deleteCourse = vi.fn().mockImplementation((courseId: string) => {
      courseState.next(courseState.value.filter((item) => item.id !== courseId));
      return of(void 0);
    });
    showError = vi.fn();
    showSuccess = vi.fn();
    confirm = vi.fn(() => of(false));

    await TestBed.configureTestingModule({
      imports: [CourseListComponent],
      providers: [
        provideRouter([]),
        {
          provide: CourseService,
          useValue: { courses$: courseState.asObservable(), getCourses, refreshCourses, deleteCourse }
        },
        { provide: NotificationService, useValue: { error: showError, success: showSuccess } },
        { provide: ConfirmationService, useValue: { confirm } }
      ]
    }).compileComponents();
  });

  it('loads and displays courses', () => {
    const fixture = TestBed.createComponent(CourseListComponent);
    fixture.detectChanges();

    expect(getCourses).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('BIO101');
    expect(fixture.nativeElement.textContent).toContain('Biology');
  });

  it('refreshes the course list on request', () => {
    const fixture = TestBed.createComponent(CourseListComponent);
    fixture.detectChanges();

    fixture.componentInstance.refreshCourses();

    expect(refreshCourses).toHaveBeenCalled();
  });

  it('updates the rendered list when the service state changes', () => {
    const fixture = TestBed.createComponent(CourseListComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Biology');

    courseState.next([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No courses are available.');
  });

  it('deletes a course after confirmation', () => {
    confirm.mockReturnValue(of(true));
    const fixture = TestBed.createComponent(CourseListComponent);
    fixture.detectChanges();

    fixture.componentInstance.deleteCourse(course);
    fixture.detectChanges();

    expect(deleteCourse).toHaveBeenCalledWith('course-1');
    expect(showSuccess).toHaveBeenCalledWith('Course deleted successfully.');
    expect(fixture.nativeElement.textContent).toContain('No courses are available.');
  });
});
