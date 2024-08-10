import { BeforeInsert, Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntityWithExtras, RelationTypes } from '@Common/base-entity-with-extras';
import { PrimaryGeneratedUUID } from '@Decorators/primary-generated-uuid.decorator';
import { Project } from '@Entities/project';
import { Nullable } from '@Types/nullable';

@Entity('project_report')
export class ProjectReport extends BaseEntityWithExtras {
	static getRelationTypes(): RelationTypes {
		return {
			project: Project,
		};
	}

	static getRelations(): string[] {
		return ['project'];
	}

	static getColumns(): string[] {
		return ['id', 'sequenceNumber', 'reportDate', 'deliverables', 'hazards', 'objectives', 'other'];
	}

	@PrimaryGeneratedUUID()
	id: string;

	@Column({ name: 'sequence_number' })
	sequenceNumber: number;

	@Column({ name: 'report_date', default: () => 'CURRENT_DATE', type: 'date' })
	reportDate: string;

	@Column({ type: 'mediumtext' })
	deliverables: string;

	@Column({ type: 'mediumtext' })
	hazards: string;

	@Column({ type: 'mediumtext' })
	objectives: string;

	@Column({ type: 'mediumtext', nullable: true })
	other: Nullable<string>;

	@ManyToOne(() => Project, (project) => project.reports, { onDelete: 'CASCADE' })
	project: Project;

	@BeforeInsert()
	async beforeInsert(): Promise<void> {
		if (this.id === null) {
			this.id = undefined;
		}
	}
}
