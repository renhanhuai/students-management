import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;
  beforeEach(() => { service = TestBed.inject(LoadingService); });

  it('stays active until all concurrent requests finish', () => {
    const values: boolean[] = [];
    service.isLoading$.subscribe((value) => values.push(value));
    service.requestStarted();
    service.requestStarted();
    service.requestFinished();
    expect(values.at(-1)).toBe(true);
    service.requestFinished();
    expect(values.at(-1)).toBe(false);
  });

  it('does not go below zero when a request finishes more than once', () => {
    service.requestFinished();
    let isLoading: boolean | undefined;
    service.isLoading$.subscribe((value) => isLoading = value);
    expect(isLoading).toBe(false);
  });
});
