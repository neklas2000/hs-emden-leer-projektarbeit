import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthenticationController } from '@Controllers/authentication.controller';
import { TokenWhitelist } from '@Entities/token-whitelist';
import { UserModule } from '@Modules/user.module';
import { AuthenticationService } from '@Services/authentication.service';
import { CookieService } from '@Services/cookie.service';
import { CryptoService } from '@Services/crypto.service';
import { DateService } from '@Services/date.service';
import { TokenWhitelistService } from '@Services/token-whitelist.service';
import { AccessTokenStrategy } from '@Strategies/access-token.strategy';
import { RefreshTokenStrategy } from '@Strategies/refresh-token.strategy';

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
		CryptoService,
		DateService,
		AccessTokenStrategy,
		RefreshTokenStrategy,
		CookieService,
	],
	exports: [AuthenticationService],
	controllers: [AuthenticationController],
})
export class AuthenticationModule {}
