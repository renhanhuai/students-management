import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private activeRequestCount = 0;
  private readonly loadingSubject = new BehaviorSubject(false);

  readonly isLoading$ = this.loadingSubject.asObservable();

  requestStarted(): void {
    this.activeRequestCount += 1;
    this.loadingSubject.next(true);
  }

  requestFinished(): void {
    this.activeRequestCount = Math.max(0, this.activeRequestCount - 1);
    this.loadingSubject.next(this.activeRequestCount > 0);
  }
}
