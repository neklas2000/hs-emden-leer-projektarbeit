import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

import { Nullable } from '../../types';
import { Project } from '../../project/entities';
import { PrimaryGeneratedUUID } from '../../decorators';
import { BaseEntityWithExtras, RelationTypes } from '../../common';
import { TokenWhitelist } from '../../authentication/entities';

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

  @OneToOne(() => TokenWhitelist, (tokenWhitelist) => tokenWhitelist.user)
  tokenPair: TokenWhitelist;
}
