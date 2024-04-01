import { JwtService } from '@nestjs/jwt';
import { ForbiddenException, Injectable } from '@nestjs/common';

import * as crypto from 'crypto-js';
import { Observable, of, switchMap, take } from 'rxjs';
import { DeepPartial } from 'typeorm';

import { IncorrectCredentialsException } from 'src/exceptions/incorrect-credentials.exception';
import { UserService } from './user.service';
import { UserAlreadyExistsException } from 'src/exceptions/user-already-exists.exception';
import { User } from 'src/entities/user';
import { RefreshTokenService } from './refresh-token.service';
import { promiseToObservable } from 'src/utils/promise-to-oberservable';

export type TokensResponse = {
  accessToken: string;
  refreshToken: string;
};

export type TokensWithUserResponse = TokensResponse & {
  user: DeepPartial<User>;
};

export type DeleteResult = {
  success: boolean;
};

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async register(
    email: string,
    password: string,
  ): Promise<TokensWithUserResponse> {
    const user = await this.userService.findByEmail(email);

    if (user !== null) {
      throw new UserAlreadyExistsException(email, null);
    }

    const registeredUser = await this.userService.register(email, password);
    delete registeredUser.password;

    const tokens = await this.generateTokens(
      registeredUser.id,
      registeredUser.email,
    );
    await this.updateRefreshToken(registeredUser.id, tokens.refreshToken);

    return {
      ...tokens,
      user: registeredUser,
    };
  }

  async login(
    email: string,
    password: string,
  ): Promise<TokensWithUserResponse> {
    const user = await this.userService.findByEmail(email);

    if (!user || user.password !== password) {
      throw new IncorrectCredentialsException(null);
    }

    const userWithoutPassword: DeepPartial<User> = user;
    delete userWithoutPassword.password;

    const tokens = await this.generateTokens(
      userWithoutPassword.id,
      userWithoutPassword.email,
    );
    await this.updateRefreshToken(userWithoutPassword.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userWithoutPassword,
    };
  }

  logout(userId: string): Observable<DeleteResult> {
    return promiseToObservable(this.refreshTokenService.delete(userId)).pipe(
      take(1),
      switchMap((result) => {
        let success = false;

        if (result.affected && result.affected === 1) success = true;

        return of({
          success,
        });
      }),
    );
  }

  async refreshTokens(
    email: string,
    refreshToken: string,
  ): Promise<TokensResponse> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenEntry = await this.refreshTokenService.findById(user.id);

    if (!refreshTokenEntry) {
      throw new ForbiddenException('Access Denied');
    }

    const hashedRefreshedToken = crypto
      .SHA256(refreshToken)
      .toString(crypto.enc.Hex);

    if (hashedRefreshedToken !== refreshTokenEntry.token) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshedToken = crypto
      .SHA256(refreshToken)
      .toString(crypto.enc.Hex);

    await this.refreshTokenService.update(userId, hashedRefreshedToken);
  }

  async generateTokens(userId: string, email: string): Promise<TokensResponse> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '30m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
