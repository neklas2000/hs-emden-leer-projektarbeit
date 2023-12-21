import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';

import { MilestoneEstimateService } from 'src/services/milestone-estimate.service';
import { promiseToObservable } from 'src/utils/promise-to-oberservable';
import { MilestoneEstimate } from 'src/entities/milestone-estimate';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('milestone/estimates')
export class MilestoneEstimateController {
  constructor(
    private readonly milestoneEstimateService: MilestoneEstimateService,
  ) {}

  @Get()
  findAll(): Observable<MilestoneEstimate[]> {
    return promiseToObservable(this.milestoneEstimateService.findAll());
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<MilestoneEstimate> {
    return promiseToObservable(this.milestoneEstimateService.findOne(id));
  }
}
