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
  private studentsRequest$: Observable<Student[]> | null = null;

  readonly students$ = this.studentsSubject.asObservable();

  getStudents(): Observable<Student[]> {
    if (!this.studentsRequest$) {
      this.studentsRequest$ = this.createStudentsRequest();
    }
    return this.studentsRequest$;
  }

  refreshStudents(): Observable<Student[]> {
    this.studentsRequest$ = this.createStudentsRequest();
    return this.studentsRequest$;
  }

  getStudentById(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.api.studentsUrl}/${id}`);
  }

  createStudent(student: Omit<Student, 'id'>): Observable<Student> {
    return this.http.post<Student>(this.api.studentsUrl, student).pipe(
      tap(() => {
        this.studentsRequest$ = null;
      })
    );
  }

  updateStudent(id: string, student: Omit<Student, 'id'>): Observable<Student> {
    return this.http.put<Student>(`${this.api.studentsUrl}/${id}`, student).pipe(
      tap((updatedStudent) => {
        this.studentsSubject.next(
          this.studentsSubject.value.map((item) =>
            String(item.id) === id ? updatedStudent : item
          )
        );
        this.studentsRequest$ = null;
      })
    );
  }

  deleteStudent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api.studentsUrl}/${id}`).pipe(
      tap(() => {
        this.studentsSubject.next(
          this.studentsSubject.value.filter((student) => String(student.id) !== id)
        );
        this.studentsRequest$ = null;
      })
    );
  }

  private createStudentsRequest(): Observable<Student[]> {
    return this.http.get<Student[]>(this.api.studentsUrl).pipe(
      tap((students) => this.studentsSubject.next(students)),
      shareReplay({ bufferSize: 1, refCount: false })
    );
  }
}
