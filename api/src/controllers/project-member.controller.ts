import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { Observable, switchMap } from 'rxjs';
import { DeepPartial } from 'typeorm';

import { ProjectMember } from '@Entities/project-member';
import { User } from '@Entities/user';
import { AccessTokenGuard } from '@Guards/access-token.guard';
import { ValidUUIDPipe } from '@Pipes/valid-uuid.pipe';
import { ProjectMemberService } from '@Services/project-member.service';
import { UserService } from '@Services/user.service';
import { Success } from '@Types/success';
import { promiseToObservable } from '@Utils/promise-to-oberservable';

@UseGuards(AccessTokenGuard)
@Controller({
	path: 'project/members',
	version: '1',
})
export class ProjectMemberController {
	constructor(
		private readonly projectMemberService: ProjectMemberService,
		private readonly userService: UserService,
	) {}

	@Post()
	create(
		@Body()
		payload: DeepPartial<ProjectMember>,
	): Observable<ProjectMember> {
		return promiseToObservable<ProjectMember, ProjectMember>(
			this.projectMemberService.create(payload),
		).pipe(
			switchMap((projectMember) => {
				return promiseToObservable<User, ProjectMember>(
					this.userService.findById(projectMember.user.id),
					(user) => {
						delete user.password;
						projectMember.user = user;

						return projectMember;
					},
				);
			}),
		) as Observable<ProjectMember>;
	}

	@Patch(':id')
	update(
		@Param('id', ValidUUIDPipe)
		id: string,
		@Body()
		payload: DeepPartial<ProjectMember>,
	): Observable<Success> {
		return promiseToObservable(this.projectMemberService.update(id, payload), (result) => {
			return {
				success: result,
			};
		}) as Observable<Success>;
	}

	@Delete(':id')
	delete(
		@Param('id', ValidUUIDPipe)
		id: string,
	): Observable<Success> {
		return promiseToObservable(this.projectMemberService.delete(id), (result) => {
			return {
				success: result,
			};
		}) as Observable<Success>;
	}
}
