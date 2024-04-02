import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Project } from '../../entities';
import { MilestoneEstimate } from '../estimate/entities';
import { PrimaryGeneratedUUID } from '../../../decorators';
import { BaseEntityWithExtras, RelationTypes } from '../../../common';

@Entity('project_milestone')
export class ProjectMilestone extends BaseEntityWithExtras {
  static getRelationTypes(): RelationTypes {
    return {
      project: Project,
      estimates: MilestoneEstimate,
    };
  }

  static getRelations(): string[] {
    return ['project', 'estimates'];
  }

  static getColumns(): string[] {
    return ['id', 'name'];
  }

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
