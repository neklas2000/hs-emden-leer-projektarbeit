import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';
import {
  FindOptionsWhere,
  FindOptionsSelect,
  FindOptionsRelations,
} from 'typeorm';

import { ProjectMemberService } from '../services';
import { promiseToObservable } from '../../../utils';
import { ProjectMember } from '../entities';
import { AccessTokenGuard } from '../../../guards';
import { Filters, SparseFieldsets, Includes } from '../../../decorators';

@UseGuards(AccessTokenGuard)
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
