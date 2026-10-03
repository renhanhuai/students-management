import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NotificationType = 'success' | 'warning' | 'error';

export interface AppNotification {
  id: number;
  type: NotificationType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly dismissalDelay = 5_000;
  private readonly notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  private readonly dismissalTimers = new Map<number, ReturnType<typeof setTimeout>>();

  readonly notifications$ = this.notificationsSubject.asObservable();
  private nextId = 1;

  success(message: string): void {
    this.addNotification('success', message);
  }

  warning(message: string): void {
    this.addNotification('warning', message);
  }

  error(message: string): void {
    this.addNotification('error', message);
  }

  dismiss(id: number): void {
    const timer = this.dismissalTimers.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      this.dismissalTimers.delete(id);
    }

    const notifications = this.notificationsSubject.value.filter(
      (notification) => notification.id !== id
    );
    this.notificationsSubject.next(notifications);
  }

  private addNotification(type: NotificationType, message: string): void {
    const notification: AppNotification = {
      id: this.nextId,
      type,
      message
    };
    this.nextId += 1;
    this.dismissalTimers.set(
      notification.id,
      setTimeout(() => this.dismiss(notification.id), this.dismissalDelay)
    );

    this.notificationsSubject.next([
      ...this.notificationsSubject.value,
      notification
    ]);
  }
}
