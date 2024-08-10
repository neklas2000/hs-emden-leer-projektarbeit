import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';
import { DeepPartial, FindOptionsWhere } from 'typeorm';

import { Filters } from '@Decorators/filters.decorator';
import { User } from '@Decorators/user.decorator';
import { User as UserEntity } from '@Entities/user';
import { IncorrectCredentialsException } from '@Exceptions/incorrect-credentials.exception';
import { AccessTokenGuard } from '@Guards/access-token.guard';
import { ValidUUIDPipe } from '@Pipes/valid-uuid.pipe';
import { UserService } from '@Services/user.service';
import { Nullable } from '@Types/nullable';
import { Success } from '@Types/success';
import { promiseToObservable } from '@Utils/promise-to-oberservable';

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

	@Get(':id')
	getProfileById(
		@Param('id', ValidUUIDPipe)
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

	@Patch(':id')
	updateProfile(
		@Param('id', ValidUUIDPipe)
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
