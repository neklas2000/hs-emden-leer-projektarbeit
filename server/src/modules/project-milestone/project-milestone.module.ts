import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectMilestone } from '@Entities/project-milestone';
import { ProjectMilestoneService } from './project-milestone.service';
import { ProjectMilestoneController } from './project-milestone.controller';

@Module({
	imports: [TypeOrmModule.forFeature([ProjectMilestone])],
	providers: [ProjectMilestoneService],
	controllers: [ProjectMilestoneController],
})
export class ProjectMilestoneModule {}
