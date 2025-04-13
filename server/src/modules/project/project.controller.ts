import { Get, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';
import { FindOptionsSelect, FindOptionsRelations, FindOptionsWhere } from 'typeorm';

import { Controller, User } from '@Common/decorators';
import { promiseToObervable } from '@Common/utils';
import { Project } from '@Entities/project';
import { AccessTokenGuard } from '@Guards/access-token.guard';
import { JsonApi } from '@JsonApi/lib';
import { ProjectService } from './project.service';
import { CRUDControllerMixin } from '../crud-mixin.controller';

@UseGuards(AccessTokenGuard)
@Controller(() => Project, {
	path: 'projects',
	version: '1',
})
export class ProjectController extends CRUDControllerMixin(Project, 'findAll') {
	constructor(private readonly projects: ProjectService) {
		super(projects);
	}

	@Get()
	findAll(
		@User() user: Express.User,
		@JsonApi.SparseFieldsets() sparseFieldsets: FindOptionsSelect<Project>,
		@JsonApi.Includes() includes: FindOptionsRelations<Project>,
		@JsonApi.Filters() filters: FindOptionsWhere<Project>,
	): Observable<Project[]> {
		return promiseToObervable(
			this.projects.readManyBy(sparseFieldsets, includes, {
				...filters,
				owner: {
					id: user['sub'],
				},
				members: {
					user: {
						id: user['sub'],
					},
				},
			}),
		);
	}
}
