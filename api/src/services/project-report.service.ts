import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectReport } from 'src/entities/project-report';

@Injectable()
export class ProjectReportService {
  constructor(
    @InjectRepository(ProjectReport)
    private projectReportRepository: Repository<ProjectReport>,
  ) {}

  findAll(): Promise<ProjectReport[]> {
    return this.projectReportRepository.find();
  }

  findOne(id: string): Promise<ProjectReport> {
    return this.projectReportRepository.findOneBy({ id });
  }
}
