import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
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

  beforeEach(async () => {
    getCourses = vi.fn(() => of([course]));
    refreshCourses = vi.fn(() => of([course]));
    deleteCourse = vi.fn(() => of(void 0));
    showError = vi.fn();
    showSuccess = vi.fn();
    confirm = vi.fn(() => of(false));

    await TestBed.configureTestingModule({
      imports: [CourseListComponent],
      providers: [
        provideRouter([]),
        { provide: CourseService, useValue: { getCourses, refreshCourses, deleteCourse } },
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

  it('deletes a course after confirmation', () => {
    confirm.mockReturnValue(of(true));
    const fixture = TestBed.createComponent(CourseListComponent);
    fixture.detectChanges();

    fixture.componentInstance.deleteCourse(course);

    expect(deleteCourse).toHaveBeenCalledWith('course-1');
    expect(showSuccess).toHaveBeenCalledWith('Course deleted successfully.');
    expect(fixture.componentInstance.courses).toEqual([]);
  });
});
