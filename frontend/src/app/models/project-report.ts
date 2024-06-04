import { Project } from './project';
import { Nullable } from '@Types';

export class ProjectReport {
  id: Nullable<string> = null;
  sequenceNumber: number = 0;
  reportDate: Nullable<string> = null;
  deliverables: string = '';
  hazards: string = '';
  objectives: string = '';
  other: Nullable<string> = null;
  project: Nullable<Project> = null;
}
