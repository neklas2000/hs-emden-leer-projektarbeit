import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';
import { FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from 'typeorm';

import { Filters, Includes, SparseFieldsets } from '@Decorators/index';
import { AccessTokenGuard } from '@Guards/access-token.guard';
import { Project } from '@Routes/Project/entities';
import { ProjectService } from '@Routes/Project/services';
import { promiseToObservable } from '@Utils/promise-to-oberservable';

@UseGuards(AccessTokenGuard)
@Controller('projects')
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	@Get()
	findAll(
		@Filters(Project)
		where: FindOptionsWhere<Project>,
		@SparseFieldsets(Project)
		select: FindOptionsSelect<Project>,
		@Includes(Project)
		relations: FindOptionsRelations<Project>,
	): Observable<Project[]> {
		return promiseToObservable(this.projectService.findAll(where, select, relations));
	}

	@Get(':id')
	findOne(
		@Param('id')
		id: string,
		@Filters(Project)
		where: FindOptionsWhere<Project>,
		@SparseFieldsets(Project)
		select: FindOptionsSelect<Project>,
		@Includes(Project)
		relations: FindOptionsRelations<Project>,
	): Observable<Project> {
		return promiseToObservable(this.projectService.findOne(id, where, select, relations));
	}
}
