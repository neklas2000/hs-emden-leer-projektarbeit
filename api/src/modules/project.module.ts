import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectController } from '@Controllers/project.controller';
import { Project } from '@Entities/project';
import { ProjectMemberModule } from '@Modules/project-member.module';
import { ProjectMilestoneModule } from '@Modules/project-milestone.module';
import { ProjectService } from '@Services/project.service';

@Module({
	imports: [TypeOrmModule.forFeature([Project]), ProjectMilestoneModule, ProjectMemberModule],
	providers: [ProjectService],
	controllers: [ProjectController],
	exports: [ProjectService],
})
export class ProjectModule {}
