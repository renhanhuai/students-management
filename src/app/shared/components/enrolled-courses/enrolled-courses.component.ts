import { Component, Input } from '@angular/core';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-enrolled-courses',
  standalone: true,
  templateUrl: './enrolled-courses.component.html',
  styleUrl: './enrolled-courses.component.css'
})
export class EnrolledCoursesComponent {
  @Input() courses: Course[] = [];
}
