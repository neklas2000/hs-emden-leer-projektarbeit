import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { type UUID } from 'crypto';
import { type Request } from 'express';
import { Strategy } from 'passport-jwt';

import { ACCESS_TOKEN_COOKIE } from '@Common/constants';
import { ExtractJwt } from '@Common/passport-jwt';
import { TokenWhitelistService } from '@Modules/authentication/token-whitelist.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-access') {
	constructor(
		private readonly tokenWhitelist: TokenWhitelistService,
		config: ConfigService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				ExtractJwt.fromCookie(ACCESS_TOKEN_COOKIE),
				ExtractJwt.fromAuthHeaderAsBearerToken(),
			]),
			secretOrKey: config.get('JWT_ACCESS_SECRET'),
			passReqToCallback: true,
		});
	}

	async validate(@Req() request: Request, payload: JwtPayload) {
		let accessToken: Nullable<string> = ExtractJwt.fromCookie(ACCESS_TOKEN_COOKIE)(request);

		if (!accessToken) {
			accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
		}

		const verified = await this.tokenWhitelist.verifyAccessToken(<UUID>payload.sub, accessToken);

		if (!verified) throw new UnauthorizedException();

		return {
			...payload,
			accessToken,
		};
	}
}
