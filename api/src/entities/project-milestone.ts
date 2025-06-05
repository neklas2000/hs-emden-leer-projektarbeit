import { BeforeInsert, Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { RelationTypes } from '@Common/base-entity-with-extras';
import { PrimaryGeneratedUUID } from '@Decorators/primary-generated-uuid.decorator';
import { MilestoneEstimate } from '@Entities/milestone-estimate';
import { Project } from '@Entities/project';

@Entity('project_milestone')
export class ProjectMilestone {
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
		return ['id', 'name', 'milestoneReached'];
	}

	@PrimaryGeneratedUUID()
	id: string;

	@Column()
	name: string;

	@Column({ name: 'milestone_reached', type: 'boolean', default: () => false })
	milestoneReached: boolean;

	@ManyToOne(() => Project, (project) => project.milestones, { onDelete: 'CASCADE' })
	project: Project;

	@OneToMany(() => MilestoneEstimate, (estimate) => estimate.milestone)
	estimates: MilestoneEstimate[];

	@BeforeInsert()
	async beforeInsert(): Promise<void> {
		if (this.id === null) {
			this.id = undefined;
		}
	}
}
