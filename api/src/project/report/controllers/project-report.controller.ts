import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';
import {
  FindOptionsWhere,
  FindOptionsSelect,
  FindOptionsRelations,
  DeepPartial,
} from 'typeorm';

import { promiseToObservable } from '../../../utils';
import { ProjectReport } from '../entities';
import { ProjectReportService } from '../services';
import { AccessTokenGuard } from '../../../guards';
import { Filters, SparseFieldsets, Includes } from '../../../decorators';
import { Success } from '../../../types';

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

  @Patch(':id')
  patchOne(
    @Param('id')
    id: string,
    @Body()
    payload: DeepPartial<ProjectReport>,
  ): Observable<Success> {
    const answer$ = new Promise<Success>(async (resolve, reject) => {
      try {
        const success = await this.projectReportService.patchOne(id, payload);

        resolve({
          success,
        });
      } catch (exception) {
        reject(exception);
      }
    });

    return promiseToObservable(answer$);
  }
}
