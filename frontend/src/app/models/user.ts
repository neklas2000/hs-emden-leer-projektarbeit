import { Project } from './project';
import { Nullable } from '@Types';

/**
 * @description
 * This model represents the entity `User`.
 */
export class User {
  id: Nullable<string> = null;
  academicTitle: Nullable<string> = null;
  matriculationNumber: number = 0;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: Nullable<string> = null;
  phoneNumber: Nullable<string> = null;
  projects: Project[] = [];
}
