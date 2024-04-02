import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs';
import {
  FindOptionsWhere,
  FindOptionsSelect,
  FindOptionsRelations,
} from 'typeorm';

import { MilestoneEstimateService } from '../services';
import { promiseToObservable } from '../../../../utils';
import { MilestoneEstimate } from '../entities';
import { AccessTokenGuard } from '../../../../guards';
import { Filters, SparseFieldsets, Includes } from '../../../../decorators';

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
