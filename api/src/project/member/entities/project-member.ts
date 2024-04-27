import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntityWithExtras, RelationTypes } from '@Common/index';
import { PrimaryGeneratedUUID } from '@Decorators/primary-generated-uuid.decorator';
import { Project } from '@Routes/Project/entities';
import { User } from '@Routes/User/entities';

export enum ProjectRole {
	Contributor = 'contributor',
	Viewer = 'viewer',
}

@Entity('project_member')
export class ProjectMember extends BaseEntityWithExtras {
	static getRelationTypes(): RelationTypes {
		return {
			user: User,
			project: Project,
		};
	}

	static getRelations(): string[] {
		return ['user', 'project'];
	}

	static getColumns(): string[] {
		return ['id', 'role', 'invitePending'];
	}

	@PrimaryGeneratedUUID()
	id: string;

	@Column({ type: 'enum', enum: ProjectRole })
	role: ProjectRole;

	@Column({ name: 'invite_pending', type: 'boolean' })
	invitePending: boolean;

	@ManyToOne(() => User, (user) => user.matriculationNumber)
	user: User;

	@ManyToOne(() => Project, (project) => project.members)
	project: Project;
}
