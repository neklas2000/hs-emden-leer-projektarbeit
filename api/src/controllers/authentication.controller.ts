import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';

import { User } from 'src/decorators/user.decorator';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { RefreshTokenGuard } from 'src/guards/refresh-token.guard';
import {
  AuthenticationService,
  DeleteResult,
  TokensResponse,
  TokensWithUserResponse,
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
  ): Observable<TokensWithUserResponse> {
    return promiseToObservable(
      this.authenticationService.register(payload.email, payload.password),
    );
  }

  @Post('login')
  login(
    @Body()
    payload: AuthenticationPayload,
  ): Observable<TokensWithUserResponse> {
    return promiseToObservable(
      this.authenticationService.login(payload.email, payload.password),
    );
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  logout(@User() user: Express.User): Observable<DeleteResult> {
    return this.authenticationService.logout(user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refreshTokens(@User() user: Express.User): Observable<TokensResponse> {
    const userEmail = user['email'];
    const refreshToken = user['refreshToken'];

    return promiseToObservable(
      this.authenticationService.refreshTokens(userEmail, refreshToken),
    );
  }
}
