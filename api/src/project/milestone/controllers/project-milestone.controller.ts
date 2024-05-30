import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';
import { FindOptionsWhere, FindOptionsSelect, FindOptionsRelations, DeepPartial } from 'typeorm';

import { Filters, SparseFieldsets, Includes } from '@Decorators/index';
import { AccessTokenGuard } from '@Guards/access-token.guard';
import { ProjectMilestone } from '@Routes/ProjectMilestone/entities';
import { ProjectMilestoneService } from '@Routes/ProjectMilestone/services';
import { promiseToObservable } from '@Utils/promise-to-oberservable';
import { Success } from '@Types/index';

@UseGuards(AccessTokenGuard)
@Controller('project/milestones')
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

	@Get(':id')
	findOne(
		@Param('id')
		id: string,
		@Filters(ProjectMilestone)
		where: FindOptionsWhere<ProjectMilestone>,
		@SparseFieldsets(ProjectMilestone)
		select: FindOptionsSelect<ProjectMilestone>,
		@Includes(ProjectMilestone)
		relations: FindOptionsRelations<ProjectMilestone>,
	): Observable<ProjectMilestone> {
		return promiseToObservable(this.projectMilestoneService.findOne(id, where, select, relations));
	}

	@Patch(':id')
	update(
		@Param('id')
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
}
