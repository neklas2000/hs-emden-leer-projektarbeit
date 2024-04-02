import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { AccessTokenStrategy, RefreshTokenStrategy } from '../strategies';
import { AuthenticationController } from './controllers';
import { TokenWhitelist } from './entities';
import { AuthenticationService, TokenWhitelistService } from './services';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([TokenWhitelist]),
  ],
  providers: [
    AuthenticationService,
    TokenWhitelistService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [AuthenticationService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
