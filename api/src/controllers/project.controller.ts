import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';

import { ProjectService } from 'src/services/project.service';
import { promiseToObservable } from 'src/utils/promise-to-oberservable';
import { Project } from 'src/entities/project';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  findAll(): Observable<Project[]> {
    return promiseToObservable(this.projectService.findAll());
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<Project> {
    return promiseToObservable(this.projectService.findOne(id));
  }
}
