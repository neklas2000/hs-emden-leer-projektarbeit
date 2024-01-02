import { Project } from './project';
import { MilestoneEstimate } from './milestone-estimate';
import { Nullable } from '../types/nullable';
import { ApiRoutes, BaseModel } from './base-model';

export class ProjectMilestone extends BaseModel {
  public static override ROUTES: ApiRoutes = {
    LOAD_ALL: '',
    LOAD: '',
    ADD: '',
  };

  id: Nullable<string> = null;
  name: string = '';
  project: Nullable<Project> = null;
  estimates: MilestoneEstimate[] = [];
}
