import { TestBed } from '@angular/core/testing';
import { StudentListComponent } from './student-list.component';

describe('StudentListComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentListComponent]
    }).compileComponents();
  });

  it('creates the student list placeholder', () => {
    const fixture = TestBed.createComponent(StudentListComponent);

    expect(fixture.componentInstance).toBeTruthy();
  });
});
