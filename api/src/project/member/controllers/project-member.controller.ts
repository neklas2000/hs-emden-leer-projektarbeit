import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';
import { FindOptionsWhere, FindOptionsSelect, FindOptionsRelations } from 'typeorm';

import { Filters, SparseFieldsets, Includes } from '@Decorators/index';
import { AccessTokenGuard } from '@Guards/access-token.guard';
import { ProjectMember } from '@Routes/ProjectMember/entities';
import { ProjectMemberService } from '@Routes/ProjectMember/services';
import { promiseToObservable } from '@Utils/promise-to-oberservable';

@UseGuards(AccessTokenGuard)
@Controller('project/members')
export class ProjectMemberController {
	constructor(private readonly projectMemberService: ProjectMemberService) {}

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
}
