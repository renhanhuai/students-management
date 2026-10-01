import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiService);

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.api.studentsUrl);
  }
}
