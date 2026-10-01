import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = 'http://localhost:3000';

  readonly studentsUrl = `${this.baseUrl}/students`;
  readonly coursesUrl = `${this.baseUrl}/courses`;
}
