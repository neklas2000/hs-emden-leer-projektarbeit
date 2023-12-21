import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MilestoneEstimateController } from 'src/controllers/milestone-estimate.controller';
import { MilestoneEstimate } from 'src/entities/milestone-estimate';
import { MilestoneEstimateService } from 'src/services/milestone-estimate.service';

@Module({
  imports: [TypeOrmModule.forFeature([MilestoneEstimate])],
  providers: [MilestoneEstimateService],
  controllers: [MilestoneEstimateController],
})
export class MilestoneEstimateModule {}
