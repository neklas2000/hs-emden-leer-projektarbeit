import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { CommonEntityFields } from './common-entity-fields';
import { User } from './user';
import { ProjectReportAppendix } from './project-report-appendix';

@Entity('files')
export class File extends CommonEntityFields {
	@Column({ type: 'varchar' })
	name: string;

	@Column({
		name: 'mime_type',
		type: 'varchar',
	})
	mimeType: string;

	@Column({ type: 'varchar' })
	uri: string;

	@ManyToOne(() => User, (user) => user.files, { onDelete: 'CASCADE' })
	uploadedBy: User;

	@OneToMany(() => ProjectReportAppendix, (appendix) => appendix.file)
	reportAppendices: ProjectReportAppendix[];
}
