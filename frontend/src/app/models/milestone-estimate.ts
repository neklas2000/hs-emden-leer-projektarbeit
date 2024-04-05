import { ApiRoutes, BaseModel } from './base-model';
import { ProjectMilestone } from './project-milestone';
import { Nullable } from '@Types';
import { currentDate } from '@Utils/current-date';

export class MilestoneEstimate extends BaseModel {
  public static override ROUTES: ApiRoutes = {
    LOAD_ALL: 'milestone/estimates',
    LOAD: 'milestone/estimates/:id',
    ADD: 'milestone/estimates',
  };

  id: Nullable<string> = null;
  reportDate: string = currentDate();
  estimationDate: Nullable<string> = null;
  milestoneReached: boolean = false;
  milestone: Nullable<ProjectMilestone> = null;
}
