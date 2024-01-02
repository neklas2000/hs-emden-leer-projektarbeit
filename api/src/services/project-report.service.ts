import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { ProjectReport } from 'src/entities/project-report';

@Injectable()
export class ProjectReportService {
  constructor(
    @InjectRepository(ProjectReport)
    private projectReportRepository: Repository<ProjectReport>,
  ) {}

  findAll(
    where: FindOptionsWhere<ProjectReport>,
    select: FindOptionsSelect<ProjectReport>,
    relations: FindOptionsRelations<ProjectReport>,
  ): Promise<ProjectReport[]> {
    return this.projectReportRepository.find({ where, select, relations });
  }

  findOne(
    id: string,
    where: FindOptionsWhere<ProjectReport>,
    select: FindOptionsSelect<ProjectReport>,
    relations: FindOptionsRelations<ProjectReport>,
  ): Promise<ProjectReport> {
    return this.projectReportRepository.findOne({
      where: {
        ...where,
        id,
      },
      select,
      relations,
    });
  }
}
