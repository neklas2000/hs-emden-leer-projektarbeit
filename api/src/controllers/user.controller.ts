import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';

import { User } from 'src/entities/user';
import { UserService } from 'src/services/user.service';
import { promiseToObservable } from 'src/utils/promise-to-oberservable';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  findAll(): Observable<User[]> {
    return promiseToObservable(this.userService.findAll());
  }

  @UseGuards(AuthGuard)
  @Get(':matriculationNumber')
  findOne(
    @Param('matriculationNumber') matriculationNumber: number,
  ): Observable<User> {
    return promiseToObservable(this.userService.findOne(matriculationNumber));
  }
}
