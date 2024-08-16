import { MilestoneEstimate } from '@Models/milestone-estimate';
import { Project } from '@Models/project';
import { Nullable } from '@Types';

/**
 * @description
 * This model represents the entity `ProjectMilestone`.
 */
export class ProjectMilestone {
  id: Nullable<string> = null;
  name: string = '';
  milestoneReached: boolean = false;
  project: Nullable<Project> = null;
  estimates: MilestoneEstimate[] = [];
}
