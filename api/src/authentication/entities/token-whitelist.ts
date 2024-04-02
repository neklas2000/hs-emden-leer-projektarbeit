import { BaseEntity, Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { PrimaryGeneratedUUID } from '../../decorators';
import { User } from '../../user/entities/user';

@Entity('token_whitelist')
export class TokenWhitelist extends BaseEntity {
  @PrimaryGeneratedUUID()
  id: string;

  @Column({ name: 'access_token', nullable: true })
  accessToken: string;

  @Column({
    name: 'access_token_expiration_date',
    type: 'datetime',
  })
  accessTokenExpirationDate: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;

  @Column({
    name: 'refresh_token_expiration_date',
    type: 'datetime',
  })
  refreshTokenExpirationDate: string;

  @JoinColumn()
  @OneToOne(() => User, (user) => user.tokenPair)
  user: User;
}
