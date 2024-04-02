import { Controller, Get, UseGuards } from '@nestjs/common';

import { User } from '../../decorators';
import { AccessTokenGuard } from '../../guards';

@UseGuards(AccessTokenGuard)
@Controller('profile')
export class ProfileController {
  @Get()
  getProfile(
    @User()
    user: Express.User,
  ) {
    return user;
  }
}
