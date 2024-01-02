import { Column, Entity, OneToMany } from 'typeorm';

import { Nullable } from 'src/types/nullable';
import { Project } from './project';
import { PrimaryGeneratedUUID } from 'src/decorators/primary-generated-uuid.decorator';
import { BaseEntityWithExtras, RelationTypes } from './base-entity-with-extras';

@Entity('user')
export class User extends BaseEntityWithExtras {
  static getRelationTypes(): RelationTypes {
    return {
      projects: Project,
    };
  }

  static getRelations(): string[] {
    return ['projects'];
  }

  static getColumns(): string[] {
    return [
      'id',
      'matriculationNumber',
      'firstName',
      'lastName',
      'email',
      'password',
      'phoneNumber',
    ];
  }

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
