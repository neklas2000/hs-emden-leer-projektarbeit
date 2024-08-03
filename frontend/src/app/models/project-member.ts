import { Project } from './project';
import { User } from './user';

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
 * This model represents the entity `ProjectMember`.
 */
export class ProjectMember {
  id!: string;
  role!: ProjectRole;
  user!: User;
  project!: Project;
}
