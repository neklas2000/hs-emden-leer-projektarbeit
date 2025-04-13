import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';
import { FindOptionsWhere, FindOptionsSelect, FindOptionsRelations, DeepPartial } from 'typeorm';

import { Filters } from '@Decorators/filters.decorator';
import { Includes } from '@Decorators/includes.decorator';
import { SparseFieldsets } from '@Decorators/sparse-fieldsets.decorator';
import { ProjectMilestone } from '@Entities/project-milestone';
import { AccessTokenGuard } from '@Guards/access-token.guard';
import { ValidUUIDPipe } from '@Pipes/valid-uuid.pipe';
import { ProjectMilestoneService } from '@Services/project-milestone.service';
import { Success } from '@Types/success';
import { promiseToObservable } from '@Utils/promise-to-oberservable';

@UseGuards(AccessTokenGuard)
@Controller({
	path: 'project/milestones',
	version: '1',
})
export class ProjectMilestoneController {
	constructor(private readonly projectMilestoneService: ProjectMilestoneService) {}

	@Get()
	findAll(
		@Filters(ProjectMilestone)
		where: FindOptionsWhere<ProjectMilestone>,
		@SparseFieldsets(ProjectMilestone)
		select: FindOptionsSelect<ProjectMilestone>,
		@Includes(ProjectMilestone)
		relations: FindOptionsRelations<ProjectMilestone>,
	): Observable<ProjectMilestone[]> {
		return promiseToObservable(this.projectMilestoneService.findAll(where, select, relations));
	}

	@Post()
	create(
		@Body()
		payload: DeepPartial<ProjectMilestone>,
	): Observable<ProjectMilestone> {
		return promiseToObservable(this.projectMilestoneService.createOne(payload));
	}

	@Patch(':id')
	update(
		@Param('id', ValidUUIDPipe)
		id: string,
		@Body()
		payload: DeepPartial<ProjectMilestone>,
	): Observable<Success> {
		return promiseToObservable(this.projectMilestoneService.update(id, payload), (result) => {
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
		return promiseToObservable(this.projectMilestoneService.delete(id), (result) => {
			return {
				success: result,
			};
		}) as Observable<Success>;
	}
}
