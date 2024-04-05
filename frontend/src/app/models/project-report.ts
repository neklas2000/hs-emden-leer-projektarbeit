import { ApiRoutes, BaseModel } from './base-model';
import { Project } from './project';
import { Nullable } from '@Types';
import { currentDate } from '@Utils/current-date';

export class ProjectReport extends BaseModel {
  public static override ROUTES: ApiRoutes = {
    LOAD_ALL: 'project/reports',
    LOAD: 'project/reports/:id',
    ADD: 'project/reports',
  };

  id: Nullable<string> = null;
  sequenceNumber: number = 0;
  reportDate: string = currentDate();
  deliverables: string = '';
  hazards: string = '';
  objectives: string = '';
  other: Nullable<string> = null;
  project: Nullable<Project> = null;
}
