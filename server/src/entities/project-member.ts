import { Column, Entity, ManyToOne } from 'typeorm';

import { CommonEntityFields } from './common-entity-fields';
import { Project } from './project';
import { User } from './user';

export enum ProjectRole {
	Contributor = 'contributor',
	Tutor = 'tutor',
}

@Entity('project_members')
export class ProjectMember extends CommonEntityFields {
	@Column({ type: 'enum', enum: ProjectRole })
	role: ProjectRole;

	@Column({
		name: 'invite_pending',
		type: 'boolean',
		default: true,
	})
	invitePending: boolean;

	@ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
	user: User;

	@ManyToOne(() => Project, (project) => project.members, { onDelete: 'CASCADE' })
	project: Project;
}
