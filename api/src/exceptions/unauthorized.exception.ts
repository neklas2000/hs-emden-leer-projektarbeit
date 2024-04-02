import { HttpStatus } from '@nestjs/common';

import { BaseException } from './base.exception';

export class UnauthorizedException extends BaseException {
  constructor(cause: any) {
    super(HttpStatus.UNAUTHORIZED, 1, {
      message: 'Unauthorized',
      description:
        'This request requires authorization provided by an access token.',
      cause,
    });
  }
}
