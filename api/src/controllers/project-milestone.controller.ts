import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';
import {
  FindOptionsWhere,
  FindOptionsSelect,
  FindOptionsRelations,
} from 'typeorm';

import { promiseToObservable } from 'src/utils/promise-to-oberservable';
import { ProjectMilestone } from 'src/entities/project-milestone';
import { ProjectMilestoneService } from 'src/services/project-milestone.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Filters, SparseFieldsets, Includes } from 'src/decorators';

@UseGuards(JwtAuthGuard)
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
