import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectMilestone } from 'src/entities/project-milestone';

@Injectable()
export class ProjectMilestoneService {
  constructor(
    @InjectRepository(ProjectMilestone)
    private projectMilestoneRepository: Repository<ProjectMilestone>,
  ) {}

  findAll(): Promise<ProjectMilestone[]> {
    return this.projectMilestoneRepository.find();
  }

  findOne(id: string): Promise<ProjectMilestone> {
    return this.projectMilestoneRepository.findOneBy({ id });
  }
}
