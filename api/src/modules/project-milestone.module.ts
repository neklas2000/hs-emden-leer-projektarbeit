import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectMilestoneController } from '@Controllers/project-milestone.controller';
import { ProjectMilestone } from '@Entities/project-milestone';
import { MilestoneEstimateModule } from '@Modules/milestone-estimate.module';
import { ProjectMilestoneService } from '@Services/project-milestone.service';

@Module({
	imports: [MilestoneEstimateModule, TypeOrmModule.forFeature([ProjectMilestone])],
	providers: [ProjectMilestoneService],
	controllers: [ProjectMilestoneController],
	exports: [ProjectMilestoneService, MilestoneEstimateModule],
})
export class ProjectMilestoneModule {}
