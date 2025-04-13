import { BeforeInsert, Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { RelationTypes } from '@Common/base-entity-with-extras';
import { PrimaryGeneratedUUID } from '@Decorators/primary-generated-uuid.decorator';
import { ProjectMember } from '@Entities/project-member';
import { ProjectMilestone } from './project-milestone';
import { ProjectReport } from '@Entities/project-report';
import { User } from '@Entities/user';
import { Nullable } from '@Types/nullable';
import { JsonSchema } from 'json-schema';

@JsonSchema.Resource({
	name: 'projects',
	title: 'A managed project',
	description:
		'This entity represents a project which is used to create a milestone trend analysis for',
})
@Entity('project')
export class Project {
	static getRelationTypes(): RelationTypes {
		return {
			owner: User,
			members: ProjectMember,
			reports: ProjectReport,
			milestones: ProjectMilestone,
		};
	}

	static getRelations(): string[] {
		return ['owner', 'members', 'reports', 'milestones'];
	}

	static getColumns(): string[] {
		return ['id', 'name', 'officialStart', 'officialEnd', 'reportInterval', 'type'];
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
		title: 'The name of the project',
	})
	@Column()
	name: string;

	@JsonSchema.Property({
		type: 'string',
		format: 'date',
		defaultValue: 'TODAY',
		title: 'The start date of the project',
	})
	@Column({
		name: 'official_start',
		type: 'date',
		default: () => 'CURRENT_DATE',
	})
	officialStart: string;

	@JsonSchema.Property({
		type: 'string',
		format: 'date',
		required: false,
		title: 'The end date of the project',
	})
	@Column({ name: 'official_end', nullable: true, type: 'date' })
	officialEnd: Nullable<string>;

	@JsonSchema.Property({
		type: 'number',
		defaultValue: 7,
		title: 'The interval to create reports',
	})
	@Column({ name: 'report_interval', default: 7 })
	reportInterval: number;

	@JsonSchema.Property({
		type: 'string',
		required: false,
		title: 'The type of the project if specified',
	})
	@Column({ nullable: true })
	type: string;

	@JsonSchema.Relationship({
		type: 'User',
		title: 'This assigns a project to one specific owner',
	})
	@ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
	owner: User;

	@JsonSchema.Relationship({
		type: 'ProjectMember',
		hasMany: true,
		title: 'This field stores all members of a project',
	})
	@OneToMany(() => ProjectMember, (member) => member.project)
	members: ProjectMember[];

	@JsonSchema.Relationship({
		type: 'ProjectReport',
		hasMany: true,
		title: 'This field stores all reports of a project',
	})
	@OneToMany(() => ProjectReport, (report) => report.project)
	reports: ProjectReport[];

	@JsonSchema.Relationship({
		type: 'ProjectMilestone',
		hasMany: true,
		title: 'This field stores all milestones of a project',
	})
	@OneToMany(() => ProjectMilestone, (milestone) => milestone.project)
	milestones: ProjectMilestone[];

	@BeforeInsert()
	async beforeInsert(): Promise<void> {
		if (this.id === null) {
			this.id = undefined;
		}
	}
}
