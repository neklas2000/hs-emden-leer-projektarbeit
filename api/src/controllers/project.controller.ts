import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from 'typeorm';

import { ProjectService } from 'src/services/project.service';
import { promiseToObservable } from 'src/utils/promise-to-oberservable';
import { Project } from 'src/entities/project';
import { AuthGuard } from 'src/guards/auth.guard';
import { Filters, Includes, SparseFieldsets } from 'src/decorators';

@UseGuards(AuthGuard)
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
