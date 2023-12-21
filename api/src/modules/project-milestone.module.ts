import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectMilestoneController } from 'src/controllers/project-milestone.controller';
import { ProjectMilestone } from 'src/entities/project-milestone';
import { ProjectMilestoneService } from 'src/services/project-milestone.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectMilestone])],
  providers: [ProjectMilestoneService],
  controllers: [ProjectMilestoneController],
})
export class ProjectMilestoneModule {}
