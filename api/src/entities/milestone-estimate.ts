import { BeforeInsert, Column, Entity, ManyToOne } from 'typeorm';

import { RelationTypes } from '@Common/base-entity-with-extras';
import { PrimaryGeneratedUUID } from '@Decorators/primary-generated-uuid.decorator';
import { ProjectMilestone } from '@Entities/project-milestone';

@Entity('milestone_estimate')
export class MilestoneEstimate {
	static getRelationTypes(): RelationTypes {
		return {
			milestone: ProjectMilestone,
		};
	}

	static getRelations(): string[] {
		return ['milestone'];
	}

	static getColumns(): string[] {
		return ['id', 'reportDate', 'estimationDate'];
	}

	@PrimaryGeneratedUUID()
	id: string;

	@Column({ name: 'report_date', default: () => 'CURRENT_DATE', type: 'date' })
	reportDate: string;

	@Column({ name: 'estimation_date', type: 'date' })
	estimationDate: string;

	@ManyToOne(() => ProjectMilestone, (m) => m.estimates, { onDelete: 'CASCADE' })
	milestone: ProjectMilestone;

	@BeforeInsert()
	async beforeInsert(): Promise<void> {
		if (this.id === null) {
			this.id = undefined;
		}
	}
}
