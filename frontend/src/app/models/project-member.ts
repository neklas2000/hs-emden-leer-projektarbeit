import { Project } from '@Models/project';
import { User } from '@Models/user';

/**
 * @description
 * This enumeration represents both roles which can be assigned to a project member.
 */
export enum ProjectRole {
  Contributor = 'contributor',
  Viewer = 'viewer',
}

/**
 * @description
 * This model type represents the entity `ProjectMember`.
 */
export type ProjectMember = {
  id: string;
  role: ProjectRole;
  user: User;
  project: Project;
}
