import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DeepPartial,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { ProjectMilestone } from '../entities';

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

  createOne(payload: DeepPartial<ProjectMilestone>): Promise<ProjectMilestone> {
    delete payload?.id;
    const entity = this.projectMilestoneRepository.create(payload);

    return this.projectMilestoneRepository.save(entity, { reload: true });
  }
}
