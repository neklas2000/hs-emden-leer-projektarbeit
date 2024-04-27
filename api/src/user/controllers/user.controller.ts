import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';
import { FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from 'typeorm';

import { Filters, Includes, SparseFieldsets } from '@Decorators/index';
import { AccessTokenGuard } from '@Guards/access-token.guard';
import { User } from '@Routes/User/entities';
import { UserService } from '@Routes/User/services';
import { promiseToObservable } from '@Utils/promise-to-oberservable';

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
		return promiseToObservable(this.userService.findAll(where, select, relations));
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
