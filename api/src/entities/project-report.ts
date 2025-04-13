import { BeforeInsert, Column, Entity, ManyToOne } from 'typeorm';

import { RelationTypes } from '@Common/base-entity-with-extras';
import { PrimaryGeneratedUUID } from '@Decorators/primary-generated-uuid.decorator';
import { Project } from '@Entities/project';
import { Nullable } from '@Types/nullable';
import { JsonSchema } from 'json-schema';

@JsonSchema.Resource({ name: 'project-reports' })
@Entity('project_report')
export class ProjectReport {
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
		type: 'number',
		format: 'uint',
		minimum: 1,
		title: 'The sequence number of the report',
	})
	@Column({ name: 'sequence_number' })
	sequenceNumber: number;

	@JsonSchema.Property({
		type: 'string',
		format: 'date',
		defaultValue: 'TODAY',
		title: 'The date the report was created',
	})
	@Column({ name: 'report_date', default: () => 'CURRENT_DATE', type: 'date' })
	reportDate: string;

	@JsonSchema.Property({
		type: 'string',
		title: 'The deliverables since the last report',
	})
	@Column({ type: 'mediumtext' })
	deliverables: string;

	@JsonSchema.Property({
		type: 'string',
		title: 'The hazards for the new report period',
	})
	@Column({ type: 'mediumtext' })
	hazards: string;

	@JsonSchema.Property({
		type: 'string',
		title: 'The objectives for the new report period',
	})
	@Column({ type: 'mediumtext' })
	objectives: string;

	@JsonSchema.Property({
		type: 'string',
		title: 'Other information for the new report period',
	})
	@Column({ type: 'mediumtext', nullable: true })
	other: Nullable<string>;

	@JsonSchema.Relationship({
		type: 'Project',
		title: 'The project this report belongs too',
	})
	@ManyToOne(() => Project, (project) => project.reports, { onDelete: 'CASCADE' })
	project: Project;

	@BeforeInsert()
	async beforeInsert(): Promise<void> {
		if (this.id === null) {
			this.id = undefined;
		}
	}
}
