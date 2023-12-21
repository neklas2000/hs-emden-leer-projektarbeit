import { BaseEntity, Column, Entity, OneToMany } from 'typeorm';

import { Nullable } from 'src/types/nullable';
import { Project } from './project';
import { PrimaryGeneratedUUID } from 'src/decorators/primary-generated-uuid.decorator';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedUUID()
  id: string;

  @Column({ name: 'matriculation_number' })
  matriculationNumber: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: Nullable<string>;

  @Column({ name: 'phone_number', nullable: true, type: 'varchar' })
  phoneNumber: Nullable<string>;

  @OneToMany(() => Project, (project) => project.owner, { onDelete: 'CASCADE' })
  projects: Project[];
}
