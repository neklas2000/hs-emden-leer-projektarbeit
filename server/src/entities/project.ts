import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { CommonEntityFields } from './common-entity-fields';
import { User } from './user';
import { ProjectMember } from './project-member';
import { ProjectReport } from './project-report';
import { ProjectMilestone } from './project-milestone';
import { ProjectActivity } from './project-activity';
import { JsonSchema } from '@JsonSchema/lib';
import { text } from '@Common/utils/text-node';

@JsonSchema.Resource({
	name: 'projects',
	title: 'A blueprint of projects',
	description: 'This resource represents the entity of projects',
})
@Entity('projects')
export class Project extends CommonEntityFields {
	@JsonSchema.Property({
		type: 'string',
		title: 'The name of a project',
		description: text`
			The name of the project should briefly describe the projects purpose.
		`,
		required: true,
	})
	@Column({ type: 'varchar' })
	name: string;

	@JsonSchema.Property({
		type: 'date',
		format: 'YYYY-MM-DD',
		title: 'The official date of starting the project',
		description: text`
			This date should provide the date at which the project has officially
			started.
		`,
		defaultValue: 'TODAY',
		required: true,
	})
	@Column({
		name: 'official_start',
		type: 'date',
		default: () => 'CURRENT_DATE',
	})
	officialStart: string;

	@JsonSchema.Property({
		type: 'date',
		format: 'YYYY-MM-DD',
		title: 'The official date of finishing the project',
		description: text`
			This date should provide the date at which the project has been officially
			finished.
		`,
		required: true,
	})
	@Column({
		name: 'official_end',
		nullable: true,
		type: 'date',
	})
	officialEnd: string;

	@JsonSchema.Property({
		type: 'number',
		format: 'int',
		title: 'The interval for the reporting',
		description: text`
			This interval describes in what interval of days reports should by
			created. By default every week a report is expected.
		`,
		defaultValue: 7,
		minimum: 1,
		required: true,
	})
	@Column({
		name: 'report_interval',
		type: 'int',
		default: 7,
	})
	reportInterval: number;

	@JsonSchema.Property({
		type: 'string',
		title: 'The type of the project',
		description: text`
			The type could for example categorize the project such as a software
			project or other types.
		`,
		required: false,
	})
	@Column({
		nullable: true,
		type: 'varchar',
	})
	type: string;

	@JsonSchema.Relationship({
		type: 'User',
		title: 'The owner of the project',
		description: text`
			This relationship defines who created the project and therefore can be
			considered the owner of the project.
		`,
	})
	@ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
	// @JoinColumn({ name: 'owner_id' })
	owner: User;

	@OneToMany(() => ProjectMember, (member) => member.project)
	members: ProjectMember[];

	@OneToMany(() => ProjectReport, (report) => report.project)
	reports: ProjectReport[];

	@OneToMany(() => ProjectMilestone, (milestone) => milestone.project)
	milestones: ProjectMilestone[];

	@OneToMany(() => ProjectActivity, (activity) => activity.project)
	activities: ProjectActivity[];
}
