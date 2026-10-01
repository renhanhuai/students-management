import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';
import { Student } from '../models/student.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiService);
  private readonly studentsSubject = new BehaviorSubject<Student[]>([]);
  private studentsRequest$: Observable<Student[]> = this.createStudentsRequest();

  readonly students$ = this.studentsSubject.asObservable();

  getStudents(): Observable<Student[]> {
    return this.studentsRequest$;
  }

  refreshStudents(): Observable<Student[]> {
    this.studentsRequest$ = this.createStudentsRequest();
    return this.studentsRequest$;
  }

  private createStudentsRequest(): Observable<Student[]> {
    return this.http.get<Student[]>(this.api.studentsUrl).pipe(
      tap((students) => this.studentsSubject.next(students)),
      shareReplay({ bufferSize: 1, refCount: false })
    );
  }
}
