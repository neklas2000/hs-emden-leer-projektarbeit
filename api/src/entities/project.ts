import { BeforeInsert, Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntityWithExtras, RelationTypes } from '@Common/base-entity-with-extras';
import { PrimaryGeneratedUUID } from '@Decorators/primary-generated-uuid.decorator';
import { ProjectMember } from '@Entities/project-member';
import { ProjectMilestone } from '@Entities/project-milestone';
import { ProjectReport } from '@Entities/project-report';
import { User } from '@Entities/user';
import { Nullable } from '@Types/nullable';

@Entity('project')
export class Project extends BaseEntityWithExtras {
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

	@PrimaryGeneratedUUID()
	id: string;

	@Column()
	name: string;

	@Column({
		name: 'official_start',
		type: 'date',
		default: () => 'CURRENT_DATE',
	})
	officialStart: string;

	@Column({ name: 'official_end', nullable: true, type: 'date' })
	officialEnd: Nullable<string>;

	@Column({ name: 'report_interval', default: 7 })
	reportInterval: number;

	@Column({ nullable: true })
	type: string;

	@ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
	owner: User;

	@OneToMany(() => ProjectMember, (member) => member.project)
	members: ProjectMember[];

	@OneToMany(() => ProjectReport, (report) => report.project)
	reports: ProjectReport[];

	@OneToMany(() => ProjectMilestone, (milestone) => milestone.project)
	milestones: ProjectMilestone[];

	@BeforeInsert()
	async beforeInsert(): Promise<void> {
		if (this.id === null) {
			this.id = undefined;
		}
	}
}
