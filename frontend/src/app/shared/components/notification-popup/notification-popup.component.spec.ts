import { TestBed } from '@angular/core/testing';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationPopupComponent } from './notification-popup.component';

describe('NotificationPopupComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationPopupComponent]
    }).compileComponents();
  });

  it('displays and dismisses a notification', () => {
    const fixture = TestBed.createComponent(NotificationPopupComponent);
    const notificationService = TestBed.inject(NotificationService);
    fixture.detectChanges();

    notificationService.success('Student saved.');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Student saved.');
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Student saved.');
  });
});
