import { Project } from './project';
import { User } from './user';

export enum ProjectRole {
  Contributor = 'contributor',
  Viewer = 'viewer',
}

export class ProjectMember {
  id!: string;
  role!: ProjectRole;
  invitePending!: boolean;
  user!: User;
  project!: Project;
}
