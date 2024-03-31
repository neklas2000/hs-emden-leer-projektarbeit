import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { Request } from 'express';
import { Observable } from 'rxjs';

import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { RefreshTokenGuard } from 'src/guards/refresh-token.guard';
import {
  AuthenticationService,
  TokensResponse,
} from 'src/services/authentication.service';
import { promiseToObservable } from 'src/utils/promise-to-oberservable';

type AuthenticationPayload = {
  email: string;
  password: string;
};

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  register(
    @Body()
    payload: AuthenticationPayload,
  ): Observable<TokensResponse> {
    return promiseToObservable(
      this.authenticationService.register(payload.email, payload.password),
    );
  }

  @Post('login')
  login(
    @Body()
    payload: AuthenticationPayload,
  ): Observable<TokensResponse> {
    return promiseToObservable(
      this.authenticationService.login(payload.email, payload.password),
    );
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  logout(@Req() req: Request) {
    this.authenticationService.logout(req.user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refreshTokens(@Req() req: Request) {
    const userEmail = req.user['email'];
    const refreshToken = req.user['refreshToken'];

    return promiseToObservable(
      this.authenticationService.refreshTokens(userEmail, refreshToken),
    );
  }
}
