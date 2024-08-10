import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';
import { FindOptionsWhere, FindOptionsSelect, FindOptionsRelations, DeepPartial } from 'typeorm';

import { Filters } from '@Decorators/filters.decorator';
import { Includes } from '@Decorators/includes.decorator';
import { SparseFieldsets } from '@Decorators/sparse-fieldsets.decorator';
import { ProjectReport } from '@Entities/project-report';
import { AccessTokenGuard } from '@Guards/access-token.guard';
import { ValidUUIDPipe } from '@Pipes/valid-uuid.pipe';
import { ProjectReportService } from '@Services/project-report.service';
import { Success } from '@Types/success';
import { promiseToObservable } from '@Utils/promise-to-oberservable';

@UseGuards(AccessTokenGuard)
@Controller('project/reports')
export class ProjectReportController {
	constructor(private readonly projectReportService: ProjectReportService) {}

	@Get(':id')
	findOne(
		@Param('id', ValidUUIDPipe)
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
		@Param('id', ValidUUIDPipe)
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

	@Post()
	create(
		@Body()
		payload: DeepPartial<ProjectReport>,
	): Observable<ProjectReport> {
		return promiseToObservable(this.projectReportService.create(payload));
	}
}
