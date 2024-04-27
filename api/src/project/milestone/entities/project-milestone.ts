import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntityWithExtras, RelationTypes } from '@Common/index';
import { PrimaryGeneratedUUID } from '@Decorators/primary-generated-uuid.decorator';
import { MilestoneEstimate } from '@Routes/MilestoneEstimate/entities';
import { Project } from '@Routes/Project/entities';

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
