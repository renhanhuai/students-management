import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Course } from '../../../core/models/course.model';
import { EnrolledCoursesComponent } from './enrolled-courses.component';

describe('EnrolledCoursesComponent', () => {
  let fixture: ComponentFixture<EnrolledCoursesComponent>;
  const course: Course = {
    id: 'course-1', name: 'Biology', code: 'BIO101',
    description: 'Introductory biology', instructor: 'Dr. Lee'
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [EnrolledCoursesComponent] }).compileComponents();
    fixture = TestBed.createComponent(EnrolledCoursesComponent);
  });

  it('shows enrolled course names and codes', () => {
    fixture.componentInstance.courses = [course];
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Biology (BIO101)');
  });

  it('shows an empty state when there are no courses', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('not enrolled in any courses');
  });
});
