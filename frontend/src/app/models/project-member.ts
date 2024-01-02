import { User } from './user';
import { Project } from './project';
import { ApiRoutes, BaseModel } from './base-model';

export enum ProjectRole {
  Contributor = 'contributor',
  Viewer = 'viewer',
}

export class ProjectMember extends BaseModel {
  public static override ROUTES: ApiRoutes = {
    LOAD_ALL: '',
    LOAD: '',
    ADD: '',
  };

  id!: string;
  role!: ProjectRole;
  invitePending!: boolean;
  user!: User;
  project!: Project;
}
