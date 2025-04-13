import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { type UUID } from 'crypto';
import { type Request } from 'express';
import { Strategy } from 'passport-jwt';

import { REFRESH_TOKEN_COOKIE } from '@Common/constants';
import { ExtractJwt } from '@Common/passport-jwt';
import { TokenWhitelistService } from '@Modules/authentication/token-whitelist.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(
		private readonly tokenWhitelist: TokenWhitelistService,
		config: ConfigService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				ExtractJwt.fromCookie(REFRESH_TOKEN_COOKIE),
				ExtractJwt.fromAuthHeaderAsBearerToken(),
			]),
			secretOrKey: config.get('JWT_REFRESH_SECRET'),
			passReqToCallback: true,
		});
	}

	async validate(@Req() request: Request, payload: JwtPayload) {
		let refreshToken: Nullable<string> = ExtractJwt.fromCookie(REFRESH_TOKEN_COOKIE)(request);

		if (!refreshToken) {
			refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
		}

		const verified = await this.tokenWhitelist.verifyRefreshToken(<UUID>payload.sub, refreshToken);

		if (!verified) throw new UnauthorizedException();

		return {
			...payload,
			refreshToken,
		};
	}
}
