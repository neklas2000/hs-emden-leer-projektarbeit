import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { MilestoneEstimate } from '@Routes/MilestoneEstimate/entities';

@Injectable()
export class MilestoneEstimateService {
  constructor(
    @InjectRepository(MilestoneEstimate)
    private milestoneEstimateRepository: Repository<MilestoneEstimate>,
  ) {}

  findAll(
    where: FindOptionsWhere<MilestoneEstimate>,
    select: FindOptionsSelect<MilestoneEstimate>,
    relations: FindOptionsRelations<MilestoneEstimate>,
  ): Promise<MilestoneEstimate[]> {
    return this.milestoneEstimateRepository.find({ where, select, relations });
  }

  findOne(
    id: string,
    where: FindOptionsWhere<MilestoneEstimate>,
    select: FindOptionsSelect<MilestoneEstimate>,
    relations: FindOptionsRelations<MilestoneEstimate>,
  ): Promise<MilestoneEstimate> {
    return this.milestoneEstimateRepository.findOne({
      where: {
        ...where,
        id,
      },
      select,
      relations,
    });
  }
}
