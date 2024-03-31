import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

import { DeepPartial } from 'typeorm';

import { IncorrectCredentialsException } from 'src/exceptions/incorrect-credentials.exception';
import { UserService } from './user.service';
import { UserAlreadyExistsException } from 'src/exceptions/user-already-exists.exception';
import { User } from 'src/entities/user';

export type AccessTokenResponse = {
  access_token: string;
};

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (user !== null) {
      throw new UserAlreadyExistsException(email, null);
    }

    return this.userService.register(email, password);
  }

  async login(email: string, password: string): Promise<AccessTokenResponse> {
    const user = await this.userService.findByEmail(email);

    if (!user || user.password !== password) {
      throw new IncorrectCredentialsException(null);
    }

    const userWithoutPassword: DeepPartial<User> = user;
    delete userWithoutPassword.password;

    return {
      access_token: this.jwtService.sign({
        email: userWithoutPassword.email,
        sub: userWithoutPassword.id,
      }),
    };
  }
}
