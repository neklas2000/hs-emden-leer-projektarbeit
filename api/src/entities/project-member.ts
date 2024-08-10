import { BeforeInsert, Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntityWithExtras, RelationTypes } from '@Common/base-entity-with-extras';
import { PrimaryGeneratedUUID } from '@Decorators/primary-generated-uuid.decorator';
import { Project } from '@Entities/project';
import { User } from '@Entities/user';

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
		return ['id', 'role'];
	}

	@PrimaryGeneratedUUID()
	id: string;

	@Column({ type: 'enum', enum: ProjectRole })
	role: ProjectRole;

	@ManyToOne(() => User, (user) => user.matriculationNumber, { onDelete: 'CASCADE' })
	user: User;

	@ManyToOne(() => Project, (project) => project.members, { onDelete: 'CASCADE' })
	project: Project;

	@BeforeInsert()
	async beforeInsert(): Promise<void> {
		if (this.id === null) {
			this.id = undefined;
		}
	}
}
