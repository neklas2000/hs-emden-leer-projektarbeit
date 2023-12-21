import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';

import { ProjectMemberService } from 'src/services/project-member.service';
import { promiseToObservable } from 'src/utils/promise-to-oberservable';
import { ProjectMember } from 'src/entities/project-member';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('project/members')
export class ProjectMemberController {
  constructor(private readonly projectMemberService: ProjectMemberService) {}

  @Get()
  findAll(): Observable<ProjectMember[]> {
    return promiseToObservable(this.projectMemberService.findAll());
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<ProjectMember> {
    return promiseToObservable(this.projectMemberService.findOne(id));
  }
}
