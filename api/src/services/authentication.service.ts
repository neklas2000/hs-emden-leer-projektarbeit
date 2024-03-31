import { JwtService } from '@nestjs/jwt';
import { ForbiddenException, Injectable } from '@nestjs/common';

import * as crypto from 'crypto-js';
import { DeepPartial } from 'typeorm';

import { IncorrectCredentialsException } from 'src/exceptions/incorrect-credentials.exception';
import { UserService } from './user.service';
import { UserAlreadyExistsException } from 'src/exceptions/user-already-exists.exception';
import { User } from 'src/entities/user';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshToken } from 'src/entities/refresh-token';

export type TokensResponse = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async register(email: string, password: string): Promise<TokensResponse> {
    const user = await this.userService.findByEmail(email);

    if (user !== null) {
      throw new UserAlreadyExistsException(email, null);
    }

    const registeredUser = await this.userService.register(email, password);

    const tokens = await this.generateTokens(
      registeredUser.id,
      registeredUser.email,
    );
    await this.updateRefreshToken(registeredUser.id, tokens.refreshToken);

    return tokens;
  }

  async login(email: string, password: string): Promise<TokensResponse> {
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

    return tokens;
  }

  async logout(userId: string): Promise<RefreshToken> {
    return this.refreshTokenService.delete(userId);
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
