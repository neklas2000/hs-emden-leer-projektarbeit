import { BeforeInsert, Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntityWithExtras, RelationTypes } from '@Common/index';
import { PrimaryGeneratedUUID } from '@Decorators/primary-generated-uuid.decorator';
import { ProjectMilestone } from '@Routes/ProjectMilestone/entities';

@Entity('milestone_estimate')
export class MilestoneEstimate extends BaseEntityWithExtras {
	static getRelationTypes(): RelationTypes {
		return {
			milestone: ProjectMilestone,
		};
	}

	static getRelations(): string[] {
		return ['milestone'];
	}

	static getColumns(): string[] {
		return ['id', 'reportDate', 'estimationDate', 'milestoneReached'];
	}

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

	@BeforeInsert()
	async beforeInsert(): Promise<void> {
		if (this.id === null) {
			this.id = undefined;
		}
	}
}
