import { BaseEntity, Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { User } from './user';
import { PrimaryGeneratedUUID } from 'src/decorators/primary-generated-uuid.decorator';

@Entity('refresh_token')
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedUUID()
  id: string;

  @JoinColumn()
  @OneToOne(() => User, (user) => user.refreshToken)
  user: User;

  @Column()
  token: string;
}
