import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { CommonEntityFields } from './common-entity-fields';
import { Project } from './project';
import { ProjectReportAppendix } from './project-report-appendix';

@Entity('project_reports')
export class ProjectReport extends CommonEntityFields {
	@Column({
		name: 'sequence_number',
		type: 'int',
	})
	sequenceNumber: number;

	@Column({
		name: 'report_date',
		default: () => 'CURRENT_DATE',
		type: 'date',
	})
	reportDate: string;

	@Column({ type: 'longtext' })
	deliverables: string;

	@Column({ type: 'longtext' })
	hazards: string;

	@Column({ type: 'longtext' })
	objectives: string;

	@Column({
		type: 'longtext',
		nullable: true,
	})
	other: string;

	@ManyToOne(() => Project, (project) => project.reports, { onDelete: 'CASCADE' })
	project: Project;

	@OneToMany(() => ProjectReportAppendix, (appendix) => appendix.report)
	appendices: ProjectReportAppendix[];
}
