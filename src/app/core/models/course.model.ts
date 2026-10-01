/** Course record used by the course management features and mock API. */
export interface Course {
  id: number | string;
  name: string;
  code: string;
  description: string;
  instructor: string;
}
