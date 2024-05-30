import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import env from '@Environment';
import { TokenWhitelistService } from '@Routes/Authentication/services';
import { ACCESS_TOKEN_COOKIE } from '@Tokens/index';

type JwtPayload = {
	sub: string;
	email: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
	public static fromCookie() {
		return (req: Request): string | null => {
			if (req.cookies && Object.hasOwn(req.cookies, ACCESS_TOKEN_COOKIE)) {
				return req.cookies[ACCESS_TOKEN_COOKIE];
			}

			return null;
		};
	}

	constructor(private readonly tokenWhitelistService: TokenWhitelistService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				AccessTokenStrategy.fromCookie(),
				ExtractJwt.fromAuthHeaderAsBearerToken(),
			]),
			secretOrKey: env.JWT_ACCESS_SECRET,
			passReqToCallback: true,
		});
	}

	async validate(@Req() request: Express.Request, payload: JwtPayload) {
		const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

		const verified = await this.tokenWhitelistService.verifyAccessToken(payload.sub, accessToken);

		if (!verified) {
			throw new UnauthorizedException();
		}

		return payload;
	}
}
