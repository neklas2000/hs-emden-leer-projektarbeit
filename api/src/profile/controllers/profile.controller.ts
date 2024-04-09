import { Controller, Get, UseGuards } from '@nestjs/common';

import { User } from '@Decorators/user.decorator';
import { AccessTokenGuard } from '@Guards/access-token.guard';

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
