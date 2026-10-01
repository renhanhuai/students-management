import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CourseService } from '../../../core/services/course.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CourseListComponent } from './course-list.component';

describe('CourseListComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseListComponent],
      providers: [
        {
          provide: CourseService,
          useValue: { getCourses: () => of([]) }
        },
        {
          provide: NotificationService,
          useValue: { error: jasmine.createSpy('error') }
        }
      ]
    }).compileComponents();
  });

  it('creates the course list placeholder', () => {
    const fixture = TestBed.createComponent(CourseListComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });
});
