import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TokenPair } from '@Entities/token-pair';
import { User } from '@Entities/user';
import { UserModule } from '@Modules/user/user.module';
import { AuthenticationService } from './authentication.service';
import { TokenWhitelistService } from './token-whitelist.service';
import { AuthenticationController } from './authentication.controller';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from '@Strategies/access-token';
import { RefreshTokenStrategy } from '@Strategies/refresh-token';

@Module({
	imports: [
		UserModule,
		JwtModule.register({}),
		TypeOrmModule.forFeature([User, TokenPair]),
		PassportModule,
	],
	providers: [
		AuthenticationService,
		TokenWhitelistService,
		AccessTokenStrategy,
		RefreshTokenStrategy,
	],
	controllers: [AuthenticationController],
})
export class AuthenticationModule {}
