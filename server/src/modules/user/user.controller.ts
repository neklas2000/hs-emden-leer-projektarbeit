import { Delete, Get } from '@nestjs/common';

import { Observable } from 'rxjs';

import { Controller, User as RequestUser } from '@Common/decorators';
import { omit, promiseToObervable } from '@Common/utils';
import { User } from '@Entities/user';
import { JsonApi } from '@JsonApi/lib';
import type { Filters } from '@JsonApi/lib';
import { CRUDControllerMixin } from '../crud-mixin.controller';
import { UserService } from './user.service';

@Controller(() => User, {
	path: 'users',
	version: '1',
})
export class UserController extends CRUDControllerMixin(User, 'delete') {
	constructor(private readonly users: UserService) {
		super(users);
	}

	@Delete()
	delete(@RequestUser() user: Express.User) {
		return promiseToObervable(this.users.deleteOne(user['sub']));
	}

	@Get('search')
	queryAll(
		@JsonApi.Filters() filters: Filters<User>,
	): Observable<Omit<User, 'emailAddress' | 'password' | 'phoneNumber'>[]> {
		return promiseToObervable(this.users.queryAll(filters), (users) => {
			return users.map((user) => omit(user, 'emailAddress', 'password', 'phoneNumber'));
		});
	}
}
