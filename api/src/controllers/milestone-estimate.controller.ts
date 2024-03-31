import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';
import {
  FindOptionsWhere,
  FindOptionsSelect,
  FindOptionsRelations,
} from 'typeorm';

import { MilestoneEstimateService } from 'src/services/milestone-estimate.service';
import { promiseToObservable } from 'src/utils/promise-to-oberservable';
import { MilestoneEstimate } from 'src/entities/milestone-estimate';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { Filters, SparseFieldsets, Includes } from 'src/decorators';

@UseGuards(AccessTokenGuard)
@Controller('milestone/estimates')
export class MilestoneEstimateController {
  constructor(
    private readonly milestoneEstimateService: MilestoneEstimateService,
  ) {}

  @Get()
  findAll(
    @Filters(MilestoneEstimate)
    where: FindOptionsWhere<MilestoneEstimate>,
    @SparseFieldsets(MilestoneEstimate)
    select: FindOptionsSelect<MilestoneEstimate>,
    @Includes(MilestoneEstimate)
    relations: FindOptionsRelations<MilestoneEstimate>,
  ): Observable<MilestoneEstimate[]> {
    return promiseToObservable(
      this.milestoneEstimateService.findAll(where, select, relations),
    );
  }

  @Get(':id')
  findOne(
    @Param('id')
    id: string,
    @Filters(MilestoneEstimate)
    where: FindOptionsWhere<MilestoneEstimate>,
    @SparseFieldsets(MilestoneEstimate)
    select: FindOptionsSelect<MilestoneEstimate>,
    @Includes(MilestoneEstimate)
    relations: FindOptionsRelations<MilestoneEstimate>,
  ): Observable<MilestoneEstimate> {
    return promiseToObservable(
      this.milestoneEstimateService.findOne(id, where, select, relations),
    );
  }
}
