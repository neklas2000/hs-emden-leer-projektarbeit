import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProjectMember } from 'src/entities/project-member';

@Injectable()
export class ProjectMemberService {
  constructor(
    @InjectRepository(ProjectMember)
    private projectMemberRepository: Repository<ProjectMember>,
  ) {}

  findAll(): Promise<ProjectMember[]> {
    return this.projectMemberRepository.find();
  }

  findOne(id: string): Promise<ProjectMember> {
    return this.projectMemberRepository.findOneBy({ id });
  }
}
