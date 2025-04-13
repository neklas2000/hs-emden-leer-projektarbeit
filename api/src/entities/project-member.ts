import { BeforeInsert, Column, Entity, ManyToOne } from 'typeorm';

import { RelationTypes } from '@Common/base-entity-with-extras';
import { PrimaryGeneratedUUID } from '@Decorators/primary-generated-uuid.decorator';
import { Project } from '@Entities/project';
import { User } from '@Entities/user';
import { JsonSchema } from 'json-schema';

export enum ProjectRole {
	Contributor = 'contributor',
	Viewer = 'viewer',
}

@JsonSchema.Resource({ name: 'project-members' })
@Entity('project_member')
export class ProjectMember {
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
		format: 'enum(contributor,viewer)',
		title: 'The role the user plays in this project',
	})
	@Column({ type: 'enum', enum: ProjectRole })
	role: ProjectRole;

	@JsonSchema.Relationship({
		type: 'User',
		title: 'The user who is the member of the defined project',
	})
	@ManyToOne(() => User, (user) => user.matriculationNumber, { onDelete: 'CASCADE' })
	user: User;

	@JsonSchema.Relationship({
		type: 'Project',
		title: 'The project this member belongs too',
	})
	@ManyToOne(() => Project, (project) => project.members, { onDelete: 'CASCADE' })
	project: Project;

	@BeforeInsert()
	async beforeInsert(): Promise<void> {
		if (this.id === null) {
			this.id = undefined;
		}
	}
}
