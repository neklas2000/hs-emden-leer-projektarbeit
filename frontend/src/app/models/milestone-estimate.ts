import { ProjectMilestone } from '@Models/project-milestone';
import { Nullable } from '@Types';

/**
 * @description
 * This model represents the entity `MilestoneEstimate`.
 */
export class MilestoneEstimate {
  id: Nullable<string> = null;
  reportDate: Nullable<string> = null;
  estimationDate: Nullable<string> = null;
  milestone: Nullable<ProjectMilestone> = null;
}
