import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';
import { DeepPartial, FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from 'typeorm';

import { Filters } from '@Decorators/filters.decorator';
import { Includes } from '@Decorators/includes.decorator';
import { SparseFieldsets } from '@Decorators/sparse-fieldsets.decorator';
import { User } from '@Decorators/user.decorator';
import { Project } from '@Entities/project';
import { AccessTokenGuard } from '@Guards/access-token.guard';
import { ValidUUIDPipe } from '@Pipes/valid-uuid.pipe';
import { ProjectService } from '@Services/project.service';
import { Success } from '@Types/success';
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
		@User()
		user: Express.User,
	): Observable<Project[]> {
		return promiseToObservable(this.projectService.findAll(user['sub'], where, select, relations));
	}

	@Get(':id')
	findOne(
		@Param('id', ValidUUIDPipe)
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

	@Post()
	create(
		@Body()
		payload: DeepPartial<Project>,
		@User()
		user: Express.User,
	): Observable<Project> {
		return promiseToObservable(this.projectService.create(payload, user['sub']));
	}

	@Patch(':id')
	update(
		@Param('id', ValidUUIDPipe)
		id: string,
		@Body()
		payload: DeepPartial<Project>,
	): Observable<Success> {
		return promiseToObservable(this.projectService.update(id, payload), (result) => {
			return {
				success: result,
			};
		}) as Observable<Success>;
	}

	@Delete(':id')
	delete(
		@Param('id', ValidUUIDPipe)
		id: string,
		@User()
		user: Express.User,
	): Observable<Success> {
		return promiseToObservable(this.projectService.delete(id, user['sub']), (result) => {
			return {
				success: result,
			};
		}) as Observable<Success>;
	}
}
