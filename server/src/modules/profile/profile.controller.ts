import { Get, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';

import { Controller, User as RequestUser } from '@Common/decorators';
import { omit, promiseToObervable } from '@Common/utils';
import { User } from '@Entities/user';
import { AccessTokenGuard } from '@Guards/access-token.guard';
import { UserService } from '@Modules/user/user.service';
import { CRUDControllerMixin, EXCLUDE_ALL_ENDPOINTS } from '@Modules/crud-mixin.controller';

@Controller(() => User, {
	path: 'profile',
	version: '1',
})
@UseGuards(AccessTokenGuard)
export class ProfileController extends CRUDControllerMixin(User, ...EXCLUDE_ALL_ENDPOINTS) {
	constructor(private readonly users: UserService) {
		super(users);
	}

	@Get()
	getProfile(@RequestUser() user: Express.User): Observable<Omit<User, 'password'>> {
		return promiseToObervable(this.users.readOne(user['sub']), (user) => {
			return omit(user, 'password');
		});
	}
}
