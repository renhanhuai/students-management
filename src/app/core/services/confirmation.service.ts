import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, finalize, take } from 'rxjs';

export interface ConfirmationOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  private readonly confirmationSubject = new BehaviorSubject<ConfirmationOptions | null>(null);
  private pendingResult: Subject<boolean> | null = null;

  readonly confirmation$ = this.confirmationSubject.asObservable();

  confirm(options: ConfirmationOptions): Observable<boolean> {
    if (this.pendingResult) {
      this.close(false);
    }

    const result = new Subject<boolean>();
    this.pendingResult = result;
    this.confirmationSubject.next(options);

    return result.asObservable().pipe(
      finalize(() => {
        if (this.pendingResult === result) {
          this.close(false);
        }
      })
    );
  }

  close(confirmed: boolean): void {
    const result = this.pendingResult;
    if (!result) {
      return;
    }

    this.pendingResult = null;
    this.confirmationSubject.next(null);
    result.next(confirmed);
    result.complete();
  }
}
