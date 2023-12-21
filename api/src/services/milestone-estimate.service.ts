import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MilestoneEstimate } from 'src/entities/milestone-estimate';

@Injectable()
export class MilestoneEstimateService {
  constructor(
    @InjectRepository(MilestoneEstimate)
    private milestoneEstimateRepository: Repository<MilestoneEstimate>,
  ) {}

  findAll(): Promise<MilestoneEstimate[]> {
    return this.milestoneEstimateRepository.find();
  }

  findOne(id: string): Promise<MilestoneEstimate> {
    return this.milestoneEstimateRepository.findOneBy({ id });
  }
}
