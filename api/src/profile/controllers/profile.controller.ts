import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';
import { DeepPartial, FindOptionsWhere } from 'typeorm';

import { User } from '@Decorators/user.decorator';
import { AccessTokenGuard } from '@Guards/access-token.guard';
import { UserService } from '@Routes/User/services';
import { promiseToObservable } from '@Utils/promise-to-oberservable';
import { Nullable, Success } from '@Types/index';
import { User as UserEntity } from '@Routes/User/entities';
import { Filters } from '@Decorators/filters.decorator';
import { IncorrectCredentialsException } from '@Exceptions/incorrect-credentials.exception';
import { ProjectMemberService } from '@Routes/Project/member/services';

@UseGuards(AccessTokenGuard)
@Controller()
export class ProfileController {
	constructor(
		private readonly userService: UserService,
		private readonly projectMemberService: ProjectMemberService,
	) {}

	@Get('profile')
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

	@Get('profile/invites')
	getPendingInvites(
		@User()
		user: Express.User,
	): Observable<number> {
		return promiseToObservable(this.projectMemberService.countInvites(user['sub']));
	}

	@Get('profile/:id')
	getProfileById(
		@Param('id')
		id: string,
		@Filters(UserEntity)
		where: FindOptionsWhere<UserEntity>,
	): Observable<Nullable<UserEntity>> {
		return promiseToObservable(this.userService.findByIdAndCredentials(id, where), (user) => {
			if (!user) {
				throw new IncorrectCredentialsException(null);
			}

			delete user.password;

			return user;
		});
	}

	@Patch('profile/:id')
	updateProfile(
		@Param('id')
		id: string,
		@Body()
		payload: DeepPartial<UserEntity>,
	): Observable<Success> {
		return promiseToObservable(this.userService.update(id, payload), (user) => {
			if (user) {
				return {
					success: true,
				};
			}

			return {
				success: false,
			};
		}) as Observable<Success>;
	}
}
