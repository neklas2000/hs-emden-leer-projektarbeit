import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntityWithExtras, RelationTypes } from '@Common/index';
import { PrimaryGeneratedUUID } from '@Decorators/primary-generated-uuid.decorator';
import { User } from '@Routes/User/entities';
import { ProjectMember } from '@Routes/ProjectMember/entities';
import { ProjectReport } from '@Routes/ProjectReport/entities';
import { ProjectMilestone } from '@Routes/ProjectMilestone/entities';
import { Nullable } from '@Types/index';

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
    return [
      'id',
      'name',
      'officialStart',
      'officialEnd',
      'reportInterval',
      'type',
    ];
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

  @Column()
  type: string;

  @ManyToOne(() => User, (user) => user.projects)
  owner: User;

  @OneToMany(() => ProjectMember, (member) => member.project, {
    onDelete: 'CASCADE',
  })
  members: ProjectMember[];

  @OneToMany(() => ProjectReport, (report) => report.project, {
    onDelete: 'CASCADE',
  })
  reports: ProjectReport[];

  @OneToMany(() => ProjectMilestone, (milestone) => milestone.project, {
    onDelete: 'CASCADE',
  })
  milestones: ProjectMilestone[];
}
