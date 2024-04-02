import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { Project } from '../entities';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  findAll(
    where: FindOptionsWhere<Project>,
    select: FindOptionsSelect<Project>,
    relations: FindOptionsRelations<Project>,
  ): Promise<Project[]> {
    return this.projectRepository.find({ relations, select, where });
  }

  findOne(
    id: string,
    where: FindOptionsWhere<Project>,
    select: FindOptionsSelect<Project>,
    relations: FindOptionsRelations<Project>,
  ): Promise<Project> {
    return this.projectRepository.findOne({
      relations,
      select,
      where: {
        ...where,
        id,
      },
    });
  }
}
