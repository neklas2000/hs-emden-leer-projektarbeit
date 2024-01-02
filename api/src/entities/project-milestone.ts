import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { Project } from './project';
import { MilestoneEstimate } from './milestone-estimate';
import { PrimaryGeneratedUUID } from 'src/decorators/primary-generated-uuid.decorator';
import { BaseEntityWithExtras, RelationTypes } from './base-entity-with-extras';

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
