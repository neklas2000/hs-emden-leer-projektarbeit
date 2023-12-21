import { BaseEntity, Column, Entity, ManyToOne } from 'typeorm';

import { Nullable } from 'src/types/nullable';
import { Project } from './project';
import { PrimaryGeneratedUUID } from 'src/decorators/primary-generated-uuid.decorator';

@Entity('project_report')
export class ProjectReport extends BaseEntity {
  @PrimaryGeneratedUUID()
  id: string;

  @Column({ name: 'sequence_number' })
  sequenceNumber: number;

  @Column({ name: 'report_date', default: () => 'CURRENT_DATE', type: 'date' })
  reportDate: string;

  @Column({ type: 'mediumtext' })
  deliverables: string;

  @Column({ type: 'mediumtext' })
  hazards: string;

  @Column({ type: 'mediumtext' })
  objectives: string;

  @Column({ type: 'mediumtext', nullable: true })
  other: Nullable<string>;

  @ManyToOne(() => Project, (project) => project.reports)
  project: Project;
}
