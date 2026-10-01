/** Student record used by the student management features and mock API. */
export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  courseIds: number[];
}
