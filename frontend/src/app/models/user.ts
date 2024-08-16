import { Project } from '@Models/project';
import { Nullable } from '@Types';

/**
 * @description
 * This model represents the entity `User`.
 */
export class User {
  id: Nullable<string> = null;
  academicTitle: Nullable<string> = null;
  matriculationNumber: Nullable<number> = 0;
  firstName: Nullable<string> = '';
  lastName: Nullable<string> = '';
  email: string = '';
  password: Nullable<string> = null;
  phoneNumber: Nullable<string> = null;
  projects: Project[] = [];
}
