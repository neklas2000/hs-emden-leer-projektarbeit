import { ProjectMilestone } from './project-milestone';
import { Nullable } from '@Types';

export class MilestoneEstimate {
  id: Nullable<string> = null;
  reportDate: Nullable<string> = null;
  estimationDate: Nullable<string> = null;
  milestoneReached: boolean = false;
  milestone: Nullable<ProjectMilestone> = null;
}
