import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenWhitelistService } from '../authentication/services';
import { REFRESH_TOKEN_COOKIE } from '../tokens';

type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  private static fromCookie() {
    return (req: Request): string | null => {
      if (req.cookies && Object.hasOwn(req.cookies, REFRESH_TOKEN_COOKIE)) {
        return req.cookies[REFRESH_TOKEN_COOKIE];
      }

      return null;
    };
  }

  constructor(private readonly tokenWhitelistService: TokenWhitelistService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.fromCookie(),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(@Req() request: Express.Request, payload: JwtPayload) {
    const refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    const verified = await this.tokenWhitelistService.verifyRefreshToken(
      payload.sub,
      refreshToken,
    );

    if (!verified) {
      throw new UnauthorizedException();
    }

    return {
      ...payload,
      refreshToken,
    };
  }
}
