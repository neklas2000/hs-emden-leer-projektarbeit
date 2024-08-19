import { Project } from '@Models/project';
import { Nullable } from '@Types';

/**
 * @description
 * This model type represents the entity `ProjectReport`.
 */
export type ProjectReport = {
  id: string;
  sequenceNumber: number;
  reportDate: string;
  deliverables: string;
  hazards: string;
  objectives: string;
  other: Nullable<string>;
  project: Project;
}
