import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthenticationController } from './controllers';
import { TokenWhitelist } from './entities';
import { UserModule } from '@Routes/User/user.module';
import { AuthenticationService, TokenWhitelistService } from './services';
import { AccessTokenStrategy, RefreshTokenStrategy } from '@Strategies/index';
import { CryptoService } from '@Services/crypto.service';
import { DateService } from '@Services/date.service';

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
	],
	exports: [AuthenticationService],
	controllers: [AuthenticationController],
})
export class AuthenticationModule {}
