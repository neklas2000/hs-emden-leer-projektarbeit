import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';
import { FindOptionsWhere, FindOptionsSelect, FindOptionsRelations, DeepPartial } from 'typeorm';

import { Filters, SparseFieldsets, Includes } from '@Decorators/index';
import { AccessTokenGuard } from '@Guards/access-token.guard';
import { ProjectReport } from '@Routes/ProjectReport/entities';
import { ProjectReportService } from '@Routes/ProjectReport/services';
import { Success } from '@Types/index';
import { promiseToObservable } from '@Utils/promise-to-oberservable';

@UseGuards(AccessTokenGuard)
@Controller('project/reports')
export class ProjectReportController {
	constructor(private readonly projectReportService: ProjectReportService) {}

	@Get()
	findAll(
		@Filters(ProjectReport)
		where: FindOptionsWhere<ProjectReport>,
		@SparseFieldsets(ProjectReport)
		select: FindOptionsSelect<ProjectReport>,
		@Includes(ProjectReport)
		relations: FindOptionsRelations<ProjectReport>,
	): Observable<ProjectReport[]> {
		return promiseToObservable(this.projectReportService.findAll(where, select, relations));
	}

	@Get(':id')
	findOne(
		@Param('id')
		id: string,
		@Filters(ProjectReport)
		where: FindOptionsWhere<ProjectReport>,
		@SparseFieldsets(ProjectReport)
		select: FindOptionsSelect<ProjectReport>,
		@Includes(ProjectReport)
		relations: FindOptionsRelations<ProjectReport>,
	): Observable<ProjectReport> {
		return promiseToObservable(this.projectReportService.findOne(id, where, select, relations));
	}

	@Patch(':id')
	patchOne(
		@Param('id')
		id: string,
		@Body()
		payload: DeepPartial<ProjectReport>,
	): Observable<Success> {
		return promiseToObservable(
			this.projectReportService.patchOne(id, payload),
			(result: boolean) => {
				return {
					success: result,
				};
			},
		) as Observable<Success>;
	}
}
