import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';

import { promiseToObservable } from 'src/utils/promise-to-oberservable';
import { ProjectReport } from 'src/entities/project-report';
import { ProjectReportService } from 'src/services/project-report.service';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('project/reports')
export class ProjectReportController {
  constructor(private readonly projectReportService: ProjectReportService) {}

  @Get()
  findAll(): Observable<ProjectReport[]> {
    return promiseToObservable(this.projectReportService.findAll());
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<ProjectReport> {
    return promiseToObservable(this.projectReportService.findOne(id));
  }
}
