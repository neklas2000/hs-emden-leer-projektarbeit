import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { ProjectMilestone } from 'src/entities/project-milestone';

@Injectable()
export class ProjectMilestoneService {
  constructor(
    @InjectRepository(ProjectMilestone)
    private projectMilestoneRepository: Repository<ProjectMilestone>,
  ) {}

  findAll(
    where: FindOptionsWhere<ProjectMilestone>,
    select: FindOptionsSelect<ProjectMilestone>,
    relations: FindOptionsRelations<ProjectMilestone>,
  ): Promise<ProjectMilestone[]> {
    return this.projectMilestoneRepository.find({ where, select, relations });
  }

  findOne(
    id: string,
    where: FindOptionsWhere<ProjectMilestone>,
    select: FindOptionsSelect<ProjectMilestone>,
    relations: FindOptionsRelations<ProjectMilestone>,
  ): Promise<ProjectMilestone> {
    return this.projectMilestoneRepository.findOne({
      where: {
        ...where,
        id,
      },
      select,
      relations,
    });
  }
}
