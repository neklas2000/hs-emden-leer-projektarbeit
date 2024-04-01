import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user.module';
import { AuthenticationService } from 'src/services/authentication.service';
import { AccessTokenStrategy } from 'src/strategies/access-token.strategy';
import { AuthenticationController } from 'src/controllers/authentication.controller';
import { RefreshTokenStrategy } from 'src/strategies/refresh-token.strategy';
import { TokenWhitelist } from 'src/entities/token-whitelist';
import { TokenWhitelistService } from 'src/services/token-whitelist.service';

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
