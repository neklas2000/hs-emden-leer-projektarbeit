import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';
import {
  FindOptionsWhere,
  FindOptionsSelect,
  FindOptionsRelations,
} from 'typeorm';

import { ProjectMemberService } from 'src/services/project-member.service';
import { promiseToObservable } from 'src/utils/promise-to-oberservable';
import { ProjectMember } from 'src/entities/project-member';
import { AuthGuard } from 'src/guards/auth.guard';
import { Filters, SparseFieldsets, Includes } from 'src/decorators';

@UseGuards(AuthGuard)
@Controller('project/members')
export class ProjectMemberController {
  constructor(private readonly projectMemberService: ProjectMemberService) {}

  @Get()
  findAll(
    @Filters(ProjectMember)
    where: FindOptionsWhere<ProjectMember>,
    @SparseFieldsets(ProjectMember)
    select: FindOptionsSelect<ProjectMember>,
    @Includes(ProjectMember)
    relations: FindOptionsRelations<ProjectMember>,
  ): Observable<ProjectMember[]> {
    return promiseToObservable(
      this.projectMemberService.findAll(where, select, relations),
    );
  }

  @Get(':id')
  findOne(
    @Param('id')
    id: string,
    @Filters(ProjectMember)
    where: FindOptionsWhere<ProjectMember>,
    @SparseFieldsets(ProjectMember)
    select: FindOptionsSelect<ProjectMember>,
    @Includes(ProjectMember)
    relations: FindOptionsRelations<ProjectMember>,
  ): Observable<ProjectMember> {
    return promiseToObservable(
      this.projectMemberService.findOne(id, where, select, relations),
    );
  }
}
