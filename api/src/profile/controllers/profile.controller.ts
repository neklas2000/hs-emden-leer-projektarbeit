import { Controller, Get, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';

import { User } from '@Decorators/user.decorator';
import { AccessTokenGuard } from '@Guards/access-token.guard';
import { UserService } from '@Routes/User/services';
import { promiseToObservable } from '@Utils/promise-to-oberservable';
import { Nullable } from '@Types/index';
import { User as UserEntity } from '@Routes/User/entities';

@UseGuards(AccessTokenGuard)
@Controller('profile')
export class ProfileController {
	constructor(private readonly userService: UserService) {}

	@Get()
	getProfile(
		@User()
		user: Express.User,
	): Observable<Nullable<UserEntity>> {
		return promiseToObservable(this.userService.findById(user['sub']), (user) => {
			if (user) {
				delete user.password;
			}

			return user;
		});
	}
}
