import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from 'typeorm';

import { User } from 'src/entities/user';
import { UserService } from 'src/services/user.service';
import { promiseToObservable } from 'src/utils/promise-to-oberservable';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Filters, Includes, SparseFieldsets } from 'src/decorators';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Filters(User)
    where: FindOptionsWhere<User>,
    @SparseFieldsets(User)
    select: FindOptionsSelect<User>,
    @Includes(User)
    relations: FindOptionsRelations<User>,
  ): Observable<User[]> {
    return promiseToObservable(
      this.userService.findAll(where, select, relations),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':matriculationNumber')
  findOne(
    @Param('matriculationNumber')
    matriculationNumber: number,
    @Filters(User)
    where: FindOptionsWhere<User>,
    @SparseFieldsets(User)
    select: FindOptionsSelect<User>,
    @Includes(User)
    relations: FindOptionsRelations<User>,
  ): Observable<User> {
    return promiseToObservable(
      this.userService.findOne(matriculationNumber, where, select, relations),
    );
  }
}
