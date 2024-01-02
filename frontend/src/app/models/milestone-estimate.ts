import { ProjectMilestone } from './project-milestone';
import { currentDate } from '../utils/current-date';
import { Nullable } from '../types/nullable';
import { ApiRoutes, BaseModel } from './base-model';

export class MilestoneEstimate extends BaseModel {
  public static override ROUTES: ApiRoutes = {
    LOAD_ALL: '',
    LOAD: '',
    ADD: '',
  };

  id: Nullable<string> = null;
  reportDate: string = currentDate();
  estimationDate: Nullable<string> = null;
  milestoneReached: boolean = false;
  milestone: Nullable<ProjectMilestone> = null;
}
