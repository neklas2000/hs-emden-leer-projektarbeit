import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { Observable, switchMap } from 'rxjs';
import { FindOptionsWhere, FindOptionsSelect, FindOptionsRelations, DeepPartial } from 'typeorm';

import { Filters, SparseFieldsets, Includes } from '@Decorators/index';
import { AccessTokenGuard } from '@Guards/access-token.guard';
import { ProjectMember } from '@Routes/ProjectMember/entities';
import { ProjectMemberService } from '@Routes/ProjectMember/services';
import { promiseToObservable } from '@Utils/promise-to-oberservable';
import { UserService } from '@Routes/User/services';
import { User } from '@Routes/User/entities';

@UseGuards(AccessTokenGuard)
@Controller('project/members')
export class ProjectMemberController {
	constructor(
		private readonly projectMemberService: ProjectMemberService,
		private readonly userService: UserService,
	) {}

	@Get()
	findAll(
		@Filters(ProjectMember)
		where: FindOptionsWhere<ProjectMember>,
		@SparseFieldsets(ProjectMember)
		select: FindOptionsSelect<ProjectMember>,
		@Includes(ProjectMember)
		relations: FindOptionsRelations<ProjectMember>,
	): Observable<ProjectMember[]> {
		return promiseToObservable(this.projectMemberService.findAll(where, select, relations));
	}

	@Get(':id')
	findOne(
		@Param('id')
		id: string,
		@Filters(ProjectMember)
		where: FindOptionsWhere<ProjectMember>,
		@SparseFieldsets(ProjectMember)
		select: FindOptionsSelect<ProjectMember>,
		@Includes(ProjectMember)
		relations: FindOptionsRelations<ProjectMember>,
	): Observable<ProjectMember> {
		return promiseToObservable(this.projectMemberService.findOne(id, where, select, relations));
	}

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
}
