import { BaseEntity, Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Project } from './project';
import { MilestoneEstimate } from './milestone-estimate';
import { PrimaryGeneratedUUID } from 'src/decorators/primary-generated-uuid.decorator';

@Entity('project_milestone')
export class ProjectMilestone extends BaseEntity {
  @PrimaryGeneratedUUID()
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Project, (project) => project.milestones)
  project: Project;

  @OneToMany(() => MilestoneEstimate, (estimate) => estimate.milestone, {
    onDelete: 'CASCADE',
  })
  estimates: MilestoneEstimate[];
}
