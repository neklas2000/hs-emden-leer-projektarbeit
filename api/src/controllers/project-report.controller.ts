import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';
import {
  FindOptionsWhere,
  FindOptionsSelect,
  FindOptionsRelations,
} from 'typeorm';

import { promiseToObservable } from 'src/utils/promise-to-oberservable';
import { ProjectReport } from 'src/entities/project-report';
import { ProjectReportService } from 'src/services/project-report.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Filters, SparseFieldsets, Includes } from 'src/decorators';

@UseGuards(JwtAuthGuard)
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
    return promiseToObservable(
      this.projectReportService.findAll(where, select, relations),
    );
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
    return promiseToObservable(
      this.projectReportService.findOne(id, where, select, relations),
    );
  }
}
