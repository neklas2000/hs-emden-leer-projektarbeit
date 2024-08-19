import { ProjectMember } from '@Models/project-member';
import { ProjectMilestone } from '@Models/project-milestone';
import { ProjectReport } from '@Models/project-report';
import { User } from '@Models/user';
import { Nullable } from '@Types';

/**
 * @description
 * This model type represents the entity `Project`.
 */
export type Project = {
  id: string;
  name: string;
  officialStart: string;
  officialEnd: Nullable<string>;
  reportInterval: number;
  type: Nullable<string>;
  owner: User;
  members: ProjectMember[];
  reports: ProjectReport[];
  milestones: ProjectMilestone[];
}
