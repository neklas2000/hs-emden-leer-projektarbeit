import { Get, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';

import { Controller, User } from '@Common/decorators';
import { promiseToObervable } from '@Common/utils';
import { Project } from '@Entities/project';
import { AccessTokenGuard } from '@Guards/access-token.guard';
import { JsonApi, SparseFieldsets, Includes, Filters } from '@JsonApi/lib';
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
		@JsonApi.SparseFieldsets() sparseFieldsets: SparseFieldsets<Project>,
		@JsonApi.Includes() includes: Includes<Project>,
		@JsonApi.Filters() filters: Filters<Project>,
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
