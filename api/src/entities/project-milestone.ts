import { BeforeInsert, Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { RelationTypes } from '@Common/base-entity-with-extras';
import { PrimaryGeneratedUUID } from '@Decorators/primary-generated-uuid.decorator';
import { MilestoneEstimate } from '@Entities/milestone-estimate';
import { Project } from '@Entities/project';
import { JsonSchema } from 'json-schema';

@JsonSchema.Resource({ name: 'project-milestones' })
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

	@JsonSchema.Property({
		type: 'string',
		format: 'uuid',
		pattern:
			'/^([A-Fa-f0-9]){8}-([A-Fa-f0-9]){4}-([A-Fa-f0-9]){4}-([A-Fa-f0-9]){4}-([A-Fa-f0-9]){12}$/',
		title: 'The unique generated id',
	})
	@PrimaryGeneratedUUID()
	id: string;

	@JsonSchema.Property({
		type: 'string',
		title: 'The name of this milestone',
	})
	@Column()
	name: string;

	@JsonSchema.Property({
		type: 'boolean',
		defaultValue: false,
		title: 'A boolean flag indicating if this milestone is completed',
	})
	@Column({ name: 'milestone_reached', type: 'boolean', default: () => false })
	milestoneReached: boolean;

	@JsonSchema.Relationship({
		type: 'Project',
		title: 'The project this milestone belongs too',
	})
	@ManyToOne(() => Project, (project) => project.milestones, { onDelete: 'CASCADE' })
	project: Project;

	@JsonSchema.Relationship({
		type: 'MilestoneEstimate',
		hasMany: true,
		title: 'The estimation this milestone has received',
	})
	@OneToMany(() => MilestoneEstimate, (estimate) => estimate.milestone)
	estimates: MilestoneEstimate[];

	@BeforeInsert()
	async beforeInsert(): Promise<void> {
		if (this.id === null) {
			this.id = undefined;
		}
	}
}
