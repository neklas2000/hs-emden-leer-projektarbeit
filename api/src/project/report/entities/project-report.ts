import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntityWithExtras, RelationTypes } from '@Common/index';
import { PrimaryGeneratedUUID } from '@Decorators/index';
import { Project } from '@Routes/Project/entities';
import { Nullable } from '@Types/index';

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

	@ManyToOne(() => Project, (project) => project.reports)
	project: Project;
}
