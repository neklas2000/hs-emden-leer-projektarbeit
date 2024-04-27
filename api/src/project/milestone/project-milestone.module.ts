import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectMilestoneController } from './controllers';
import { ProjectMilestone } from './entities';
import { ProjectMilestoneService } from './services';

@Module({
	imports: [TypeOrmModule.forFeature([ProjectMilestone])],
	providers: [ProjectMilestoneService],
	controllers: [ProjectMilestoneController],
})
export class ProjectMilestoneModule {}
