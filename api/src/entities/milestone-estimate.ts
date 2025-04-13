import { BeforeInsert, Column, Entity, ManyToOne } from 'typeorm';

import { RelationTypes } from '@Common/base-entity-with-extras';
import { PrimaryGeneratedUUID } from '@Decorators/primary-generated-uuid.decorator';
import { ProjectMilestone } from '@Entities/project-milestone';
import { JsonSchema } from 'json-schema';

@JsonSchema.Resource({ name: 'milestone-estimates' })
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
		format: 'date',
		defaultValue: 'TODAY',
		title: 'The report date of this estimation',
	})
	@Column({ name: 'report_date', default: () => 'CURRENT_DATE', type: 'date' })
	reportDate: string;

	@JsonSchema.Property({
		type: 'string',
		format: 'date',
		title: 'The estimated completion date of this estimation',
	})
	@Column({ name: 'estimation_date', type: 'date' })
	estimationDate: string;

	@JsonSchema.Relationship({
		type: 'ProjectMilestone',
		title: 'The milestone this estimation belongs too',
	})
	@ManyToOne(() => ProjectMilestone, (m) => m.estimates, { onDelete: 'CASCADE' })
	milestone: ProjectMilestone;

	@BeforeInsert()
	async beforeInsert(): Promise<void> {
		if (this.id === null) {
			this.id = undefined;
		}
	}
}
