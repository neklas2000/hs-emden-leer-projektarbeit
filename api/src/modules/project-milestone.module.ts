import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectMilestoneController } from '@Controllers/project-milestone.controller';
import { ProjectMilestone } from '@Entities/project-milestone';
import { ProjectMilestoneService } from '@Services/project-milestone.service';

@Module({
	imports: [TypeOrmModule.forFeature([ProjectMilestone])],
	providers: [ProjectMilestoneService],
	controllers: [ProjectMilestoneController],
})
export class ProjectMilestoneModule {}
