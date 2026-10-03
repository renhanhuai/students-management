import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingService } from '../../../core/services/loading.service';
import { LoadingOverlayComponent } from './loading-overlay.component';

describe('LoadingOverlayComponent', () => {
  let fixture: ComponentFixture<LoadingOverlayComponent>;
  let loadingService: LoadingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [LoadingOverlayComponent] }).compileComponents();
    fixture = TestBed.createComponent(LoadingOverlayComponent);
    loadingService = TestBed.inject(LoadingService);
  });

  it('shows the progress indicator while a request is active', () => {
    loadingService.requestStarted();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-progress-spinner')).not.toBeNull();
  });

  it('hides the overlay when no requests are active', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('mat-progress-spinner')).toBeNull();
  });
});
