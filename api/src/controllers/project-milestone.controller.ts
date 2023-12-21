import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';

import { promiseToObservable } from 'src/utils/promise-to-oberservable';
import { ProjectMilestone } from 'src/entities/project-milestone';
import { ProjectMilestoneService } from 'src/services/project-milestone.service';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('project/milestones')
export class ProjectMilestoneController {
  constructor(
    private readonly projectMilestoneService: ProjectMilestoneService,
  ) {}

  @Get()
  findAll(): Observable<ProjectMilestone[]> {
    return promiseToObservable(this.projectMilestoneService.findAll());
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<ProjectMilestone> {
    return promiseToObservable(this.projectMilestoneService.findOne(id));
  }
}
