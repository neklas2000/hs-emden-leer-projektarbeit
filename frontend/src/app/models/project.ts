import { ProjectMember } from './project-member';
import { ProjectMilestone } from './project-milestone';
import { ProjectReport } from './project-report';
import { Nullable } from '@Types';
import { User } from './user';

/**
 * @description
 * This model represents the entity `Project`.
 */
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
