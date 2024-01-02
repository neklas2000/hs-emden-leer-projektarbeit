import { Nullable } from '../types/nullable';
import { Project } from './project';
import { currentDate } from '../utils/current-date';
import { ApiRoutes, BaseModel } from './base-model';

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
