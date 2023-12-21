import { BaseEntity, Column, Entity, ManyToOne } from 'typeorm';

import { User } from './user';
import { Project } from './project';
import { PrimaryGeneratedUUID } from 'src/decorators/primary-generated-uuid.decorator';

export enum ProjectRole {
  Contributor = 'contributor',
  Viewer = 'viewer',
}

@Entity('project_member')
export class ProjectMember extends BaseEntity {
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
