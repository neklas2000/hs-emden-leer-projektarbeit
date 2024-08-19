import { MilestoneEstimate } from '@Models/milestone-estimate';
import { Project } from '@Models/project';

/**
 * @description
 * This model type represents the entity `ProjectMilestone`.
 */
export type ProjectMilestone = {
  id: string;
  name: string;
  milestoneReached: boolean;
  project: Project;
  estimates: MilestoneEstimate[];
}
