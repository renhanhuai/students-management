import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { AppNotification, NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let currentNotifications: AppNotification[];

  beforeEach(() => {
    service = TestBed.inject(NotificationService);
    currentNotifications = [];
    service.notifications$.subscribe((notifications) => {
      currentNotifications = notifications;
    });
  });

  afterEach(() => {
    for (const notification of [...currentNotifications]) {
      service.dismiss(notification.id);
    }
  });

  it('publishes success, warning, and error notifications', () => {
    service.success('Saved');
    service.warning('Check this');
    service.error('Could not save');

    expect(currentNotifications.map(({ type }) => type)).toEqual([
      'success',
      'warning',
      'error'
    ]);
  });

  it('dismisses a notification by id', () => {
    service.success('Saved');
    const notificationId = currentNotifications[0].id;

    service.dismiss(notificationId);

    expect(currentNotifications).toEqual([]);
  });

  it('automatically dismisses notifications after five seconds', () => {
    vi.useFakeTimers();
    try {
      service.success('Saved');

      vi.advanceTimersByTime(4_999);
      expect(currentNotifications.length).toBe(1);

      vi.advanceTimersByTime(1);
      expect(currentNotifications).toEqual([]);
    } finally {
      vi.useRealTimers();
    }
  });
});
