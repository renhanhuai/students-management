import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LoadingService } from '../services/loading.service';
import { loadingInterceptor } from './loading.interceptor';

describe('loadingInterceptor', () => {
  let http: HttpTestingController;
  let loading: LoadingService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [
      provideHttpClient(withInterceptors([loadingInterceptor])),
      provideHttpClientTesting()
    ] });
    http = TestBed.inject(HttpTestingController);
    loading = TestBed.inject(LoadingService);
  });
  afterEach(() => http.verify());

  it('tracks a request until it completes', () => {
    let isLoading = false;
    loading.isLoading$.subscribe((value) => isLoading = value);
    TestBed.inject(HttpClient).get('/api/data').subscribe();
    expect(isLoading).toBe(true);
    http.expectOne('/api/data').flush({});
    expect(isLoading).toBe(false);
  });
});
