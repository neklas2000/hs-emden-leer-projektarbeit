import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CommonEntityFields } from './common-entity-fields';
import { ProjectMilestone } from './project-milestone';

@Entity('milestone_estimates')
export class MilestoneEstimate extends CommonEntityFields {
	@Column({
		name: 'report_date',
		type: 'date',
		default: () => 'CURRENT_DATE',
	})
	reportDate: string;

	@Column({
		name: 'estimated_date',
		type: 'date',
	})
	estimatedDate: string;

	@ManyToOne(() => ProjectMilestone, (milestone) => milestone.estimates, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'milestone_id' })
	milestone: ProjectMilestone;
}
