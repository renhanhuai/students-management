import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly jsonUrl = 'http://localhost:3000';
  private readonly javaUrl = 'http://localhost:8080';
  private readonly baseUrl = this.jsonUrl;
  
  readonly studentsUrl = `${this.baseUrl}/students`;
  readonly coursesUrl = `${this.baseUrl}/courses`;
}
