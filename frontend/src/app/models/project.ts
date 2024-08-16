import { ProjectMember } from '@Models/project-member';
import { ProjectMilestone } from '@Models/project-milestone';
import { ProjectReport } from '@Models/project-report';
import { User } from '@Models/user';
import { Nullable } from '@Types';

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
  type!: Nullable<string>;
  owner!: User;
  members: ProjectMember[] = [];
  reports: ProjectReport[] = [];
  milestones: ProjectMilestone[] = [];
}
