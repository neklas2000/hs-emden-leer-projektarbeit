import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';
import {
  FindOptionsWhere,
  FindOptionsSelect,
  FindOptionsRelations,
  DeepPartial,
} from 'typeorm';

import { promiseToObservable } from '../../../utils';
import { ProjectMilestone } from '../entities';
import { ProjectMilestoneService } from '../services';
import { AccessTokenGuard } from '../../../guards';
import { Filters, SparseFieldsets, Includes } from '../../../decorators';

@UseGuards(AccessTokenGuard)
@Controller('project/milestones')
export class ProjectMilestoneController {
  constructor(
    private readonly projectMilestoneService: ProjectMilestoneService,
  ) {}

  @Get()
  findAll(
    @Filters(ProjectMilestone)
    where: FindOptionsWhere<ProjectMilestone>,
    @SparseFieldsets(ProjectMilestone)
    select: FindOptionsSelect<ProjectMilestone>,
    @Includes(ProjectMilestone)
    relations: FindOptionsRelations<ProjectMilestone>,
  ): Observable<ProjectMilestone[]> {
    return promiseToObservable(
      this.projectMilestoneService.findAll(where, select, relations),
    );
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
    return promiseToObservable(
      this.projectMilestoneService.findOne(id, where, select, relations),
    );
  }
}
