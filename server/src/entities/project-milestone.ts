import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { CommonEntityFields } from './common-entity-fields';
import { MilestoneEstimate } from './milestone-estimate';
import { Project } from './project';

@Entity('project_milestones')
export class ProjectMilestone extends CommonEntityFields {
	@Column({ type: 'varchar', length: 50 })
	name: string;

	@Column({
		name: 'is_reached',
		type: 'boolean',
		default: false,
	})
	isReached: boolean;

	@ManyToOne(() => Project, (project) => project.milestones, { onDelete: 'CASCADE' })
	project: Project;

	@OneToMany(() => MilestoneEstimate, (estimate) => estimate.milestone)
	estimates: MilestoneEstimate[];
}
