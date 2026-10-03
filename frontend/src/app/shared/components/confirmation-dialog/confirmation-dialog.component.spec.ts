import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

describe('ConfirmationDialogComponent', () => {
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let confirmationService: ConfirmationService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ConfirmationDialogComponent] }).compileComponents();
    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    confirmationService = TestBed.inject(ConfirmationService);
  });

  it('renders a prompt and returns the confirm choice', () => {
    let result: boolean | undefined;
    confirmationService.confirm({ title: 'Delete record?', message: 'This cannot be undone.', confirmLabel: 'Delete' })
      .subscribe((confirmed) => result = confirmed);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('This cannot be undone.');
    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    buttons[1].click();
    expect(result).toBe(true);
  });

  it('returns false when the prompt is canceled', () => {
    let result: boolean | undefined;
    confirmationService.confirm({ title: 'Leave?', message: 'Discard changes?' })
      .subscribe((confirmed) => result = confirmed);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('.cancel-button') as HTMLButtonElement).click();
    expect(result).toBe(false);
  });
});
