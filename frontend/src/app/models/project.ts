import { ApiRoutes, BaseModel } from './base-model';
import { ProjectReport } from './project-report';
import { ProjectMember } from './project-member';
import { ProjectMilestone } from './project-milestone';
import { Nullable } from '@Types';
import { User } from './user';
import { currentDate } from '@Utils/current-date';

export class Project extends BaseModel {
  public static override ROUTES: ApiRoutes = {
    LOAD_ALL: 'projects',
    LOAD: 'projects/:id',
    ADD: 'projects',
  };

  id!: string;
  name!: string;
  officialStart: string = currentDate();
  officialEnd: Nullable<string> = null;
  reportInterval: number = 7;
  type!: string;
  owner!: User;
  members: ProjectMember[] = [];
  reports: ProjectReport[] = [];
  milestones: ProjectMilestone[] = [];
}
