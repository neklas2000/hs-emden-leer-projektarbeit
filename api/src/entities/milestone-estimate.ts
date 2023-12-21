import { BaseEntity, Column, Entity, ManyToOne } from 'typeorm';

import { ProjectMilestone } from './project-milestone';
import { PrimaryGeneratedUUID } from 'src/decorators/primary-generated-uuid.decorator';

@Entity('milestone_estimate')
export class MilestoneEstimate extends BaseEntity {
  @PrimaryGeneratedUUID()
  id: string;

  @Column({ name: 'report_date', default: () => 'CURRENT_DATE', type: 'date' })
  reportDate: string;

  @Column({ name: 'estimation_date', type: 'date' })
  estimationDate: string;

  @Column({ name: 'milestone_reached', type: 'boolean' })
  milestoneReached: boolean;

  @ManyToOne(() => ProjectMilestone, (m) => m.estimates)
  milestone: ProjectMilestone;
}
