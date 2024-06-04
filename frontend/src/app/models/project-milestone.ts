import { MilestoneEstimate } from './milestone-estimate';
import { Project } from './project';
import { Nullable } from '@Types';

export class ProjectMilestone {
  id: Nullable<string> = null;
  name: string = '';
  project: Nullable<Project> = null;
  estimates: MilestoneEstimate[] = [];
}
