import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MilestoneEstimate } from '@Entities/milestone-estimate';
import { MilestoneEstimateService } from './milestone-estimate.service';
import { MilestoneEstimateController } from './milestone-estimate.controller';

@Module({
	imports: [TypeOrmModule.forFeature([MilestoneEstimate])],
	providers: [MilestoneEstimateService],
	controllers: [MilestoneEstimateController],
})
export class MilestoneEstimateModule {}
