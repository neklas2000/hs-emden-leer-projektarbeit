import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from 'typeorm';

import { User } from '../entities';
import { UserService } from '../services';
import { promiseToObservable } from '../../utils';
import { AccessTokenGuard } from '../../guards';
import { Filters, Includes, SparseFieldsets } from '../../decorators';

@UseGuards(AccessTokenGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
