import { TestBed } from '@angular/core/testing';
import { CourseListComponent } from './course-list.component';

describe('CourseListComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseListComponent]
    }).compileComponents();
  });

  it('creates the course list placeholder', () => {
    const fixture = TestBed.createComponent(CourseListComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });
});
