import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CommonEntityFields } from './common-entity-fields';
import { File } from './file';
import { ProjectReport } from './project-report';

@Entity('project_report_appendices')
export class ProjectReportAppendix extends CommonEntityFields {
	@ManyToOne(() => File, (file) => file.reportAppendices, { onDelete: 'SET NULL' })
	@JoinColumn({ name: 'file_id' })
	file: File;

	@ManyToOne(() => ProjectReport, (report) => report.appendices, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'report_id' })
	report: ProjectReport;
}
