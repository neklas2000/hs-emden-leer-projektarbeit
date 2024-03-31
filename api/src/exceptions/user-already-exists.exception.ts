import { HttpStatus } from '@nestjs/common';

import { BaseException } from './base.exception';

export class UserAlreadyExistsException extends BaseException {
  constructor(email: string, cause: any) {
    super(HttpStatus.BAD_REQUEST, 2, {
      message: 'User already exists',
      description: `The provided email address (${email}) is already registered.`,
      cause,
    });
  }
}
