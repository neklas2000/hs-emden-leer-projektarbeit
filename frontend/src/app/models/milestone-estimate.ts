import { ProjectMilestone } from '@Models/project-milestone';

/**
 * @description
 * This model type represents the entity `MilestoneEstimate`.
 */
export type MilestoneEstimate = {
  id: string;
  reportDate: string;
  estimationDate: string;
  milestone: ProjectMilestone;
}
