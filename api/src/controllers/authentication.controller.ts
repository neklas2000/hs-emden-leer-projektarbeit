import { Body, Controller, Post } from '@nestjs/common';

import { Observable } from 'rxjs';

import { User } from 'src/entities/user';
import {
  AccessTokenResponse,
  AuthenticationService,
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
  ): Observable<User> {
    return promiseToObservable(
      this.authenticationService.register(payload.email, payload.password),
    );
  }

  @Post('login')
  login(
    @Body()
    payload: AuthenticationPayload,
  ): Observable<AccessTokenResponse> {
    return promiseToObservable(
      this.authenticationService.login(payload.email, payload.password),
    );
  }
}
