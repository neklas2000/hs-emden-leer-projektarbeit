import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';

import { map, Observable, take } from 'rxjs';
import { FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from 'typeorm';

import { Filters } from '@Decorators/filters.decorator';
import { Includes } from '@Decorators/includes.decorator';
import { SparseFieldsets } from '@Decorators/sparse-fieldsets.decorator';
import { User as UserFromRequest } from '@Decorators/user.decorator';
import { User } from '@Entities/user';
import { AccessTokenGuard } from '@Guards/access-token.guard';
import { UserService } from '@Services/user.service';
import { promiseToObservable } from '@Utils/promise-to-oberservable';
import { Success } from '@Types/success';

type SearchBody = {
	searchTerm: string;
};

@UseGuards(AccessTokenGuard)
@Controller({
	path: 'users',
	version: '1',
})
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

	@Post('search')
	searchAll(
		@Body()
		payload: SearchBody,
	): Observable<User[]> {
		return promiseToObservable(this.userService.searchAll(payload.searchTerm)).pipe(
			take(1),
			map((users) => {
				for (const user of users) {
					delete user.email;
					delete user.password;
					delete user.phoneNumber;
				}

				return users;
			}),
		);
	}

	@Delete()
	deleteOne(
		@UserFromRequest()
		user: Express.User,
	): Observable<Success> {
		return promiseToObservable(this.userService.delete(user['sub']), (result) => {
			return {
				success: result,
			};
		}) as Observable<Success>;
	}
}
