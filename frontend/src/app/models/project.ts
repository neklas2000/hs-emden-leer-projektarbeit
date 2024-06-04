import { ProjectReport } from './project-report';
import { ProjectMember } from './project-member';
import { ProjectMilestone } from './project-milestone';
import { Nullable } from '@Types';
import { User } from './user';

export class Project {
  id!: string;
  name!: string;
  officialStart: Nullable<string> = null;
  officialEnd: Nullable<string> = null;
  reportInterval: number = 7;
  type!: string;
  owner!: User;
  members: ProjectMember[] = [];
  reports: ProjectReport[] = [];
  milestones: ProjectMilestone[] = [];
}
