import { Project } from './project';
import { MilestoneEstimate } from './milestone-estimate';
import { Nullable } from '../types/nullable';
import { ApiRoutes, BaseModel } from './base-model';

export class ProjectMilestone extends BaseModel {
  public static override ROUTES: ApiRoutes = {
    LOAD_ALL: 'project/milestones',
    LOAD: 'project/milestones/:id',
    ADD: 'project/milestones',
  };

  id: Nullable<string> = null;
  name: string = '';
  project: Nullable<Project> = null;
  estimates: MilestoneEstimate[] = [];
}
