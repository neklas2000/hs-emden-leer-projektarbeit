import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';
import {
  FindOptionsWhere,
  FindOptionsSelect,
  FindOptionsRelations,
} from 'typeorm';

import { Filters, SparseFieldsets, Includes } from '@Decorators/index';
import { AccessTokenGuard } from '@Guards/access-token.guard';
import { MilestoneEstimateService } from '@Routes/MilestoneEstimate/services';
import { MilestoneEstimate } from '@Routes/MilestoneEstimate/entities';
import { promiseToObservable } from '@Utils/promise-to-oberservable';

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
