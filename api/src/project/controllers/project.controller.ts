import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from 'typeorm';

import { ProjectService } from '../services';
import { promiseToObservable } from '../../utils';
import { Project } from '../entities';
import { AccessTokenGuard } from '../../guards';
import { Filters, Includes, SparseFieldsets } from '../../decorators';

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
    return promiseToObservable(
      this.projectService.findAll(where, select, relations),
    );
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
    return promiseToObservable(
      this.projectService.findOne(id, where, select, relations),
    );
  }
}
