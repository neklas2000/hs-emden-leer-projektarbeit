import { Project } from '@Models/project';
import { Nullable } from '@Types';

/**
 * @description
 * This model type represents the entity `User`.
 */
export type User = {
  id: string;
  academicTitle: Nullable<string>;
  matriculationNumber: Nullable<number>;
  firstName: Nullable<string>;
  lastName: Nullable<string>;
  email: string;
  password?: string;
  phoneNumber: Nullable<string>;
  projects: Project[];
}
