import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TokenPair } from '@Entities/token-pair';
import { User } from '@Entities/user';
import { AppSettingsModule } from '@Modules/app-settings/app-settings.module';
import { UserModule } from '@Modules/user/user.module';
import { AccessTokenStrategy } from '@Strategies/access-token';
import { RefreshTokenStrategy } from '@Strategies/refresh-token';
import { AuthenticationService } from './authentication.service';
import { TokenWhitelistService } from './token-whitelist.service';
import { AuthenticationController } from './authentication.controller';

@Module({
	imports: [
		UserModule,
		JwtModule.register({}),
		TypeOrmModule.forFeature([User, TokenPair]),
		PassportModule,
		AppSettingsModule,
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
