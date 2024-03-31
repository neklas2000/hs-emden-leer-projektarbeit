import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from './user.module';
import { AuthenticationService } from 'src/services/authentication.service';
import { AccessTokenStrategy } from 'src/strategies/access-token.strategy';
import { AuthenticationController } from 'src/controllers/authentication.controller';
import { RefreshTokenStrategy } from 'src/strategies/refresh-token.strategy';
import { RefreshTokenService } from 'src/services/refresh-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from 'src/entities/refresh-token';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([RefreshToken]),
  ],
  providers: [
    AuthenticationService,
    RefreshTokenService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [AuthenticationService],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
